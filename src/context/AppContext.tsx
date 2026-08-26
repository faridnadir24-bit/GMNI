'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Issue, UserRole, BahanKajianDocument, Claim, Source, Article } from '@/types';
import { mockIssues } from '@/data/mockIssues';
import { mockClaims } from '@/data/mockClaims';
import { mockSources } from '@/data/mockSources';
import { mockKajianDocs } from '@/data/mockKajian';
import { supabase, isSupabaseConfigured } from '@/lib/services/supabase';
import { mapSupabaseRowToIssue, extractClaimsFromRow, extractSourcesFromRow, SupabaseIssueRow } from '@/lib/services/issue-adapter';

interface SyncResult {
  success: boolean;
  message: string;
  count?: number;
}

export interface SyncStatusInfo {
  status: string;
  last_sync_at: string | null;
  active_feeds: string;
  total_articles: number;
  total_issues: number;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  issues: Issue[];
  articles: Article[];
  addIssue: (issue: Issue) => void;
  claims: Claim[];
  addClaim: (claim: Claim) => void;
  sources: Source[];
  addSource: (source: Source) => void;
  kajianDocs: BahanKajianDocument[];
  addKajianDoc: (doc: BahanKajianDocument) => void;
  savedIssueIds: string[];
  toggleSaveIssue: (id: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isLoadingDb: boolean;
  isSyncingNews: boolean;
  lastSyncedTime: string | null;
  syncStatus: SyncStatusInfo | null;
  refreshDbData: () => Promise<void>;
  syncLiveNews: () => Promise<SyncResult>;
  isRealData: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('researcher');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [kajianDocs, setKajianDocs] = useState<BahanKajianDocument[]>(mockKajianDocs);
  const [savedIssueIds, setSavedIssueIds] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [isSyncingNews, setIsSyncingNews] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatusInfo | null>(null);
  const [isRealData, setIsRealData] = useState(false);

  // Fetch real data from Supabase / API
  const refreshDbData = useCallback(async () => {
    setIsLoadingDb(true);

    try {
      // 1. Fetch Issues
      const issuesRes = await fetch('/api/issues', { cache: 'no-store' });
      if (issuesRes.ok) {
        const json = await issuesRes.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setIssues(json.data);
          setIsRealData(true);
        }
      }

      // 2. Fetch Articles
      const artRes = await fetch('/api/articles?limit=40', { cache: 'no-store' });
      if (artRes.ok) {
        const artJson = await artRes.json();
        if (artJson.success && Array.isArray(artJson.data)) {
          setArticles(artJson.data);
        }
      }

      // 3. Fetch Sync Status
      const statusRes = await fetch('/api/sync-status', { cache: 'no-store' });
      if (statusRes.ok) {
        const statusJson = await statusRes.json();
        if (statusJson.success && statusJson.data) {
          setSyncStatus(statusJson.data);
          if (statusJson.data.last_sync_at) {
            setLastSyncedTime(new Date(statusJson.data.last_sync_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
          }
        }
      }
    } catch (e) {
      console.warn('[AppContext] API route fetch fallback to direct Supabase client');
    }

    // Direct Supabase Client fallback if API route fails
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .order('detected_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const rows = data as SupabaseIssueRow[];
          const mappedIssues = rows.map(mapSupabaseRowToIssue);
          const mappedClaims = rows.flatMap(extractClaimsFromRow);
          const mappedSources = rows.flatMap(extractSourcesFromRow);

          setIssues(mappedIssues);
          setClaims(mappedClaims);
          setSources(mappedSources);
          setIsRealData(true);
        }
      } catch (err) {
        console.warn('[AppContext] Error connecting to Supabase:', err);
      }
    }

    setIsLoadingDb(false);
  }, []);

  // Trigger On-Demand Real-Time News Ingestion
  const syncLiveNews = useCallback(async (): Promise<SyncResult> => {
    setIsSyncingNews(true);

    try {
      const res = await fetch('/api/sync-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (data.success) {
        setLastSyncedTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
        await refreshDbData();
        setIsSyncingNews(false);
        return {
          success: true,
          message: data.message || 'Sinkronisasi berita real-time berhasil.',
          count: data.data?.summary?.newIssuesCreated || 0,
        };
      } else {
        setIsSyncingNews(false);
        return {
          success: false,
          message: data.error || data.message || 'Gagal melakukan sinkronisasi berita.',
        };
      }
    } catch (err: any) {
      setIsSyncingNews(false);
      return {
        success: false,
        message: err?.message || 'Terjadi kesalahan jaringan saat sinkronisasi.',
      };
    }
  }, [refreshDbData]);

  useEffect(() => {
    refreshDbData();

    // Supabase Realtime Subscription (if supported)
    let channel: any = null;
    if (isSupabaseConfigured()) {
      try {
        channel = supabase
          .channel('public:issues_realtime')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, () => {
            refreshDbData();
          })
          .subscribe();
      } catch (e) {
        console.warn('[AppContext] Realtime subscription fallback to polling');
      }
    }

    // Near real-time periodic background sync (every 60s)
    const interval = setInterval(() => {
      refreshDbData();
    }, 60000);

    return () => {
      clearInterval(interval);
      if (channel) supabase.removeChannel(channel);
    };
  }, [refreshDbData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addIssue = (newIssue: Issue) => {
    setIssues(prev => [newIssue, ...prev]);
  };

  const addClaim = (newClaim: Claim) => {
    setClaims(prev => [newClaim, ...prev]);
  };

  const addSource = (newSource: Source) => {
    setSources(prev => [newSource, ...prev]);
  };

  const addKajianDoc = (newDoc: BahanKajianDocument) => {
    setKajianDocs(prev => [newDoc, ...prev]);
  };

  const toggleSaveIssue = (id: string) => {
    setSavedIssueIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        issues,
        articles,
        addIssue,
        claims,
        addClaim,
        sources,
        addSource,
        kajianDocs,
        addKajianDoc,
        savedIssueIds,
        toggleSaveIssue,
        isSearchOpen,
        setIsSearchOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isLoadingDb,
        isSyncingNews,
        lastSyncedTime,
        syncStatus,
        refreshDbData,
        syncLiveNews,
        isRealData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
