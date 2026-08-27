import { UserRole } from '@/types';

export type PermissionAction =
  | 'view_public'
  | 'save_issue'
  | 'view_discussion_brief'
  | 'access_kader_workspace'
  | 'view_deep_analysis'
  | 'view_research_dossier'
  | 'generate_dossier'
  | 'access_evidence_locker'
  | 'export_markdown'
  | 'manage_issues'
  | 'verify_source'
  | 'run_sync'
  | 'manage_territory'
  | 'view_audit_log';

export interface RoleConfig {
  key: UserRole;
  label: string;
  shortLabel: string;
  badgeColor: string;
  description: string;
  capabilities: string[];
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  public: {
    key: 'public',
    label: 'Publik / Warga',
    shortLabel: 'Publik',
    badgeColor: 'bg-stone-100 text-stone-700 border-stone-200',
    description: 'Akses umum informasi isu dan rujukan terverifikasi untuk masyarakat luas.',
    capabilities: [
      'Melihat ringkasan isu 3-5 menit',
      'Membaca timeline & rujukan media',
      'Melihat peta sebaran teritorial',
      'Membaca fakta vs klaim publik'
    ]
  },
  kader: {
    key: 'kader',
    label: 'Kader GMNI',
    shortLabel: 'Kader',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    description: 'Ruang kerja kader komisariat untuk bahan diskusi dan pendalaman isu advokasi.',
    capabilities: [
      'Semua akses publik',
      'Simpan daftar pantauan isu',
      'Akses Analisis Mendalam (Level 2)',
      'Generate Bahan Diskusi Komisariat',
      'Pertanyaan kajian & data gap'
    ]
  },
  member: {
    key: 'member',
    label: 'Kader GMNI',
    shortLabel: 'Kader',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    description: 'Ruang kerja kader komisariat untuk bahan diskusi dan pendalaman isu advokasi.',
    capabilities: [
      'Semua akses publik',
      'Simpan daftar pantauan isu',
      'Akses Analisis Mendalam (Level 2)',
      'Generate Bahan Diskusi Komisariat',
      'Pertanyaan kajian & data gap'
    ]
  },
  researcher: {
    key: 'researcher',
    label: 'Peneliti / Kader Sospol',
    shortLabel: 'Peneliti',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Workspace riset kebijakan, Evidence Locker, dan penyusunan AI Research Dossier 18 Bab.',
    capabilities: [
      'Semua akses kader & publik',
      'Akses AI Research Dossier 18 Bab (Level 3)',
      'Evidence Locker & Kontradiksi Data',
      'Analisis Struktural & Marhaenisme',
      'Ekspor Naskah Kajian Markdown / Print'
    ]
  },
  admin: {
    key: 'admin',
    label: 'Administrator Sistem',
    shortLabel: 'Admin',
    badgeColor: 'bg-stone-900 text-white border-stone-800',
    description: 'Kontrol penuh sistem, verifikasi sumber, sinkronisasi feed, dan audit log.',
    capabilities: [
      'Semua akses peneliti, kader & publik',
      'Sinkronisasi berita on-demand (Manual Sync)',
      'Manajemen metadata & status isu',
      'Verifikasi kualitas & klasifikasi sumber',
      'Pemantauan feed log & audit jejak'
    ]
  }
};

/**
 * Centralized Permission Check Helper
 */
export function hasPermission(role: UserRole, action: PermissionAction): boolean {
  const normalizedRole = role === 'member' ? 'kader' : role;

  switch (action) {
    case 'view_public':
      return true;

    case 'save_issue':
    case 'view_discussion_brief':
    case 'access_kader_workspace':
    case 'view_deep_analysis':
      return normalizedRole === 'kader' || normalizedRole === 'researcher' || normalizedRole === 'admin';

    case 'view_research_dossier':
    case 'generate_dossier':
    case 'access_evidence_locker':
    case 'export_markdown':
      return normalizedRole === 'researcher' || normalizedRole === 'admin';

    case 'manage_issues':
    case 'verify_source':
    case 'run_sync':
    case 'manage_territory':
    case 'view_audit_log':
      return normalizedRole === 'admin';

    default:
      return false;
  }
}

/**
 * Depth Levels available for an Issue per Role
 */
export type IssueExplanationDepthLevel = 'ringkas' | 'analisis_mendalam' | 'dossier_riset';

export interface DepthLevelOption {
  level: IssueExplanationDepthLevel;
  title: string;
  readingTime: string;
  badge: string;
  isUnlocked: boolean;
  requiredRole: string;
}

export function getAvailableDepthLevels(role: UserRole): DepthLevelOption[] {
  const normalizedRole = role === 'member' ? 'kader' : role;

  return [
    {
      level: 'ringkas',
      title: 'Ringkas (Publik)',
      readingTime: '3–5 menit',
      badge: 'Publik & Umum',
      isUnlocked: true,
      requiredRole: 'Semua Role',
    },
    {
      level: 'analisis_mendalam',
      title: 'Analisis Mendalam',
      readingTime: '10–15 menit',
      badge: 'Kader & Sospol',
      isUnlocked: normalizedRole === 'kader' || normalizedRole === 'researcher' || normalizedRole === 'admin',
      requiredRole: 'Kader / Peneliti / Admin',
    },
    {
      level: 'dossier_riset',
      title: 'Dossier Riset (18 Bab)',
      readingTime: 'Dokumen Lengkap',
      badge: 'Peneliti & Advokasi',
      isUnlocked: normalizedRole === 'researcher' || normalizedRole === 'admin',
      requiredRole: 'Peneliti / Admin',
    },
  ];
}

/**
 * Server-side Permission Guard for API Routes
 */
export function verifyApiRoleAuthorization(
  requestedAction: PermissionAction,
  userRoleHeader: string | null
): { authorized: boolean; role: UserRole; message?: string } {
  const role = (userRoleHeader as UserRole) || 'public';
  const allowed = hasPermission(role, requestedAction);

  if (!allowed) {
    return {
      authorized: false,
      role,
      message: `Akses ditolak. Role '${role}' tidak memiliki izin untuk aksi '${requestedAction}'.`,
    };
  }

  return { authorized: true, role };
}
