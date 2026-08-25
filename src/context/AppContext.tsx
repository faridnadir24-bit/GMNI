'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Issue, UserRole, BahanKajianDocument, Claim, Source } from '@/types';
import { mockIssues } from '@/data/mockIssues';
import { mockClaims } from '@/data/mockClaims';
import { mockSources } from '@/data/mockSources';
import { mockKajianDocs } from '@/data/mockKajian';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  issues: Issue[];
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('researcher'); // default to researcher / kader for rich capability
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [claims, setClaims] = useState<Claim[]>(mockClaims);
  const [sources, setSources] = useState<Source[]>(mockSources);
  const [kajianDocs, setKajianDocs] = useState<BahanKajianDocument[]>(mockKajianDocs);
  const [savedIssueIds, setSavedIssueIds] = useState<string[]>(['issue-pwk-01', 'issue-pwk-02']);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
        setIsAuthModalOpen
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
