// Self-contained verification suite for Fase 6 role permissions, dossier generation, and discussion briefs

const ROLE_CONFIGS = {
  public: { key: 'public', label: 'Publik / Warga' },
  kader: { key: 'kader', label: 'Kader GMNI' },
  member: { key: 'member', label: 'Kader GMNI' },
  researcher: { key: 'researcher', label: 'Peneliti / Sospol' },
  admin: { key: 'admin', label: 'Administrator' }
};

function hasPermission(role, action) {
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

function getAvailableDepthLevels(role) {
  const normalizedRole = role === 'member' ? 'kader' : role;

  return [
    { level: 'ringkas', title: 'Ringkas (Publik)', isUnlocked: true },
    { level: 'analisis_mendalam', title: 'Analisis Mendalam', isUnlocked: normalizedRole === 'kader' || normalizedRole === 'researcher' || normalizedRole === 'admin' },
    { level: 'dossier_riset', title: 'Dossier Riset (18 Bab)', isUnlocked: normalizedRole === 'researcher' || normalizedRole === 'admin' },
  ];
}

function buildDossierCitations(issue, sources = []) {
  const combined = [...sources];
  if (combined.length === 0) {
    combined.push({
      id: `src-default-${issue.id}`,
      source_name: 'Pusat Data Ruang Isu GMNI',
      title: `${issue.title} - Rujukan Induk`,
      url: '#',
      tier: 'Established Media',
      published_at: issue.last_updated_at
    });
  }

  return combined.map((s, idx) => ({
    index: idx + 1,
    source_id: s.id,
    source_name: s.source_name || 'Media Rujukan',
    title: s.title || `${issue.title} (Liputan)`,
    url: s.url || '#',
    published_at: s.published_at || issue.last_updated_at,
    tier: s.source_type || 'Established Media',
    badge: `[Sumber ${String(idx + 1).padStart(2, '0')}]`
  }));
}

function generateResearchDossier(issue, sources = [], claims = [], generatedBy = 'AI Policy Research Engine') {
  const citations = buildDossierCitations(issue, sources);
  const primaryCitationBadge = citations[0]?.badge || '[Sumber 01]';
  const confidence = issue.confidence_score || 75;

  let qualityWarning = undefined;
  if (confidence < 30) {
    qualityWarning = 'PERINGATAN KUALITAS DATA: Tingkat keyakinan evidensi sangat rendah (<30%).';
  } else if (confidence < 50) {
    qualityWarning = 'CATATAN AWAL: Evidensi rujukan masih terbatas (<50%).';
  }

  const chapters = [
    { id: 'chap-01', number: 'I', title: 'IDENTITAS DAN PARAMETER ISU', bullet_points: [`Status: ${issue.status}`] },
    { id: 'chap-02', number: 'II', title: 'RINGKASAN EKSEKUTIF', paragraphs: [`${issue.description} ${primaryCitationBadge}`] },
    { id: 'chap-03', number: 'III', title: 'LATAR BELAKANG DAN KONTEKS STRUKTURAL', paragraphs: ['Konteks historis.'] },
    { id: 'chap-04', number: 'IV', title: 'KRONOLOGI DAN REKAM JEJAK PERISTIWA', bullet_points: issue.events?.map(e => `[${e.event_at}] ${e.event_title}`) || ['Deteksi awal.'] },
    { id: 'chap-05', number: 'V', title: 'DATA KUANTITATIF DAN INDIKATOR FAKTUAL', bullet_points: [`Dampak: ${issue.impact_score}`] },
    { id: 'chap-06', number: 'VI', title: 'FAKTA-FAKTA TERVERIFIKASI', bullet_points: claims.filter(c => c.claim_type === 'fact').map(c => c.statement) },
    { id: 'chap-07', number: 'VII', title: 'KLAIM, PERNYATAAN, DAN ATRIBUSI PIHAK', bullet_points: claims.filter(c => c.claim_type === 'claim').map(c => c.statement) },
    { id: 'chap-08', number: 'VIII', title: 'ANALISIS PERBEDAAN DAN KONTRADIKSI DATA', bullet_points: ['Diskrepansi data.'] },
    { id: 'chap-09', number: 'IX', title: 'PEMETAAN AKTOR DAN RELASI KEPENTINGAN', bullet_points: ['Aktor regulatif', 'Aktor terdampak'] },
    { id: 'chap-10', number: 'X', title: 'DAMPAK SOSIAL, EKONOMI, DAN KERAKYATAN', subsections: [{ subtitle: 'Dampak Langsung', content: ['Beban ekonomi.'] }] },
    { id: 'chap-11', number: 'XI', title: 'EVALUASI KEBIJAKAN DAN KEPATUHAN REGULASI', paragraphs: ['Implementation gap.'] },
    { id: 'chap-12', number: 'XII', title: 'ANALISIS STRUKTURAL DAN RELASI KEKUASAAN', paragraphs: ['Akar masalah struktural.'] },
    { id: 'chap-13', number: 'XIII', title: 'ANALISIS PERSPEKTIF GMNI: MARHAENISME & TRISAKTI', bullet_points: ['Sosio-Nasionalisme', 'Sosio-Demokrasi', 'Trisakti Bung Karno'] },
    { id: 'chap-14', number: 'XIV', title: 'DATA GAP DAN INFORMASI YANG BELUM TERSEDIA', bullet_points: ['Audit anggaran', 'Data korban'] },
    { id: 'chap-15', number: 'XV', title: 'PERTANYAAN KAJIAN DAN PENDALAMAN KRITIS (8 KATEGORI)', bullet_points: [
      '1. Kausal', '2. Kebijakan', '3. Sosial', '4. Ekonomi', '5. Tata Kelola', '6. Hukum', '7. Teritorial', '8. Struktural'
    ] },
    { id: 'chap-16', number: 'XVI', title: 'ALTERNATIF KEBIJAKAN DAN SKENARIO INTERVENSI', bullet_points: ['Moratorium', 'Revisi perda'] },
    { id: 'chap-17', number: 'XVII', title: 'REKOMENDASI ADVOKASI DAN RENCANA TINDAK KADER', bullet_points: ['Investigasi lapangan', 'Policy Brief', 'Hearing DPRD'] },
    { id: 'chap-18', number: 'XVIII', title: 'DAFTAR RUJUKAN DAN VERIFIKASI SUMBER DATA', citations: citations }
  ];

  return {
    id: `dossier-${issue.id}`,
    issue_id: issue.id,
    issue_title: issue.title,
    generated_at: new Date().toISOString(),
    generated_by: generatedBy,
    confidence_at_generation: confidence,
    status: 'current',
    is_stale: false,
    quality_warning: qualityWarning,
    chapters,
    total_sources_cited: citations.length,
    sources_list: citations
  };
}

function generateDiscussionBrief(issue, sources = [], claims = []) {
  const citations = buildDossierCitations(issue, sources);

  return {
    id: `brief-${issue.id}`,
    issue_id: issue.id,
    issue_title: issue.title,
    generated_at: new Date().toISOString(),
    executive_summary: `${issue.description}`,
    five_discussion_questions: [
      '1. Apa akar ketimpangan struktural?',
      '2. Bagaimana respon kebijakan pemda?',
      '3. Siapa pihak yang paling diuntungkan?',
      '4. Bagaimana pisau analisis Marhaenisme?',
      '5. Apa langkah advokasi konkret komisariat?'
    ],
    five_key_facts: [
      `Lokasi: ${issue.location}`,
      `Dampak: ${issue.impact_score}/100`,
      `Momentum: ${issue.momentum_score}/100`,
      `Rujukan: ${citations.length} sumber`,
      `Keyakinan: ${issue.confidence_score || 75}%`
    ],
    three_data_gaps: [
      '1. Belum ada dokumen audit resmi.',
      '2. Minim data kerugian riil per keluarga.',
      '3. Belum ada kepastian sanksi hukum.'
    ],
    three_stakeholder_angles: [
      { stakeholder: 'Pemda', perspective: 'Administratif dan mitigasi citra.' },
      { stakeholder: 'Masyarakat Terdampak', perspective: 'Menuntut keadilan dan ganti rugi.' },
      { stakeholder: 'GMNI', perspective: 'Mendorong transparansi dan advokasi kerakyatan.' }
    ],
    initial_conclusion: `Persoalan ${issue.title} memerlukan tindak lanjut kajian lapangan.`
  };
}

function isDossierStale(dossier, issue) {
  const dossierTime = new Date(dossier.generated_at).getTime();
  const issueUpdatedTime = new Date(issue.last_updated_at).getTime();

  if (issueUpdatedTime > dossierTime + 1000) {
    return {
      isStale: true,
      reason: `Terdapat pembaruan data/rujukan baru setelah dossier ini dibuat.`
    };
  }
  return { isStale: false };
}

function exportDossierToMarkdown(dossier) {
  let md = `# BERKAS KAJIAN KEBIJAKAN (AI RESEARCH DOSSIER)\n**GMNI KOMISARIAT WASTUKANCANA – PURWAKARTA**\n\n`;
  for (const chap of dossier.chapters) {
    md += `## BAB ${chap.number}. ${chap.title}\n`;
    if (chap.paragraphs) {
      for (const p of chap.paragraphs) md += `${p}\n\n`;
    }
    if (chap.bullet_points) {
      for (const b of chap.bullet_points) md += `- ${b}\n`;
      md += `\n`;
    }
  }
  return md;
}

// ------------------------------------------------------------------
// RUN TESTS
// ------------------------------------------------------------------
console.log('====================================================');
console.log('FASE 6 TEST SUITE: ROLE WORKSPACE & RESEARCH DOSSIER');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(name, condition) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${name}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${name}`);
  }
}

// 1. Role Permission Matrix
console.log('--- TEST GROUP 1: ROLE PERMISSION MATRIX ---');
assert('Public: can view public', hasPermission('public', 'view_public') === true);
assert('Public: CANNOT save issue', hasPermission('public', 'save_issue') === false);
assert('Public: CANNOT generate discussion brief', hasPermission('public', 'view_discussion_brief') === false);
assert('Public: CANNOT view deep analysis', hasPermission('public', 'view_deep_analysis') === false);
assert('Public: CANNOT generate research dossier', hasPermission('public', 'generate_dossier') === false);
assert('Public: CANNOT run sync', hasPermission('public', 'run_sync') === false);

assert('Kader: can view public', hasPermission('kader', 'view_public') === true);
assert('Kader: can save issue', hasPermission('kader', 'save_issue') === true);
assert('Kader: can view discussion brief', hasPermission('kader', 'view_discussion_brief') === true);
assert('Kader: can view deep analysis', hasPermission('kader', 'view_deep_analysis') === true);
assert('Kader: CANNOT generate research dossier', hasPermission('kader', 'generate_dossier') === false);
assert('Kader: CANNOT run sync', hasPermission('kader', 'run_sync') === false);

assert('Researcher: can view deep analysis', hasPermission('researcher', 'view_deep_analysis') === true);
assert('Researcher: can generate research dossier', hasPermission('researcher', 'generate_dossier') === true);
assert('Researcher: can access evidence locker', hasPermission('researcher', 'access_evidence_locker') === true);
assert('Researcher: can export markdown', hasPermission('researcher', 'export_markdown') === true);
assert('Researcher: CANNOT run sync', hasPermission('researcher', 'run_sync') === false);

assert('Admin: can view deep analysis', hasPermission('admin', 'view_deep_analysis') === true);
assert('Admin: can generate research dossier', hasPermission('admin', 'generate_dossier') === true);
assert('Admin: can run sync', hasPermission('admin', 'run_sync') === true);
assert('Admin: can manage issues', hasPermission('admin', 'manage_issues') === true);
assert('Admin: can verify sources', hasPermission('admin', 'verify_source') === true);

// 2. Depth Levels
console.log('\n--- TEST GROUP 2: EXPLANATION DEPTH ACCESS PER ROLE ---');
const publicLevels = getAvailableDepthLevels('public');
assert('Public sees Ringkas unlocked', publicLevels.find(l => l.level === 'ringkas')?.isUnlocked === true);
assert('Public sees Analisis Mendalam locked', publicLevels.find(l => l.level === 'analisis_mendalam')?.isUnlocked === false);
assert('Public sees Dossier Riset locked', publicLevels.find(l => l.level === 'dossier_riset')?.isUnlocked === false);

const kaderLevels = getAvailableDepthLevels('kader');
assert('Kader sees Ringkas unlocked', kaderLevels.find(l => l.level === 'ringkas')?.isUnlocked === true);
assert('Kader sees Analisis Mendalam unlocked', kaderLevels.find(l => l.level === 'analisis_mendalam')?.isUnlocked === true);
assert('Kader sees Dossier Riset locked', kaderLevels.find(l => l.level === 'dossier_riset')?.isUnlocked === false);

const researcherLevels = getAvailableDepthLevels('researcher');
assert('Researcher sees all 3 depth tiers unlocked', researcherLevels.every(l => l.isUnlocked === true));

// 3. Dossier Generation
console.log('\n--- TEST GROUP 3: 18-CHAPTER DOSSIER STRUCTURE ---');
const sampleIssue = {
  id: 'issue-pwk-01',
  slug: 'penertiban-kja-jatiluhur',
  title: 'Evaluasi Penertiban KJA Waduk Jatiluhur',
  description: 'Penertiban KJA Jatiluhur memicu dampak ekonomi bagi pembudidaya lokal.',
  location: 'Purwakarta',
  category: 'Agraria',
  status: 'Developing',
  impact_score: 91,
  evidence_score: 88,
  momentum_score: 85,
  confidence_score: 82,
  first_detected_at: '2026-08-20T10:00:00Z',
  last_updated_at: '2026-08-25T14:30:00Z',
  events: [{ event_at: '2026-08-21', event_title: 'Surat Peringatan' }]
};

const sampleSources = [{ id: 'src-01', source_name: 'Antara News', title: 'Penertiban Dimulai', source_type: 'Official Source' }];
const sampleClaims = [
  { claim_type: 'fact', statement: '2.400 petak KJA ditertibkan' },
  { claim_type: 'claim', statement: 'Pembudidaya belum terima kompensasi' }
];

const dossier = generateResearchDossier(sampleIssue, sampleSources, sampleClaims, 'Tim Peneliti Sospol GMNI');
assert('Dossier contains exact 18 chapters', dossier.chapters.length === 18);
assert('Bab I: Identitas Isu exists', dossier.chapters[0].title.includes('IDENTITAS'));
assert('Bab II: Ringkasan Eksekutif exists', dossier.chapters[1].title.includes('RINGKASAN EKSEKUTIF'));
assert('Bab VI: Verified Facts uses fact claims', dossier.chapters[5].bullet_points.some(b => b.includes('2.400 petak KJA')));
assert('Bab VII: Claims uses claim statements', dossier.chapters[6].bullet_points.some(b => b.includes('belum terima kompensasi')));
assert('Bab XIII: Perspektif GMNI contains Marhaenisme', dossier.chapters[12].bullet_points.some(b => b.includes('Sosio-Nasionalisme')));
assert('Bab XV: Pertanyaan Kajian contains 8 dimensions', dossier.chapters[14].bullet_points.length === 8);
assert('Bab XVIII: Citations list populated', dossier.chapters[17].citations.length === 1);

// 4. Quality Gate
console.log('\n--- TEST GROUP 4: DOSSIER QUALITY GATE ---');
const highConfDossier = generateResearchDossier({ ...sampleIssue, confidence_score: 85 }, sampleSources, sampleClaims);
assert('Confidence >= 50 has NO quality warning', highConfDossier.quality_warning === undefined);

const lowConfDossier = generateResearchDossier({ ...sampleIssue, confidence_score: 42 }, sampleSources, sampleClaims);
assert('Confidence 42 has preliminary warning', lowConfDossier.quality_warning.includes('CATATAN AWAL'));

const criticalLowDossier = generateResearchDossier({ ...sampleIssue, confidence_score: 25 }, sampleSources, sampleClaims);
assert('Confidence 25 has critical warning', criticalLowDossier.quality_warning.includes('PERINGATAN KUALITAS DATA'));

// 5. Staleness
console.log('\n--- TEST GROUP 5: STALENESS DETECTION ---');
const createdDossier = { ...dossier, generated_at: '2026-08-25T12:00:00Z' };
const updatedIssue = { ...sampleIssue, last_updated_at: '2026-08-25T15:00:00Z' };
const staleness = isDossierStale(createdDossier, updatedIssue);
assert('Dossier flagged as stale when issue updated', staleness.isStale === true);

// 6. Discussion Brief
console.log('\n--- TEST GROUP 6: DISCUSSION BRIEF FOR KADER ---');
const brief = generateDiscussionBrief(sampleIssue, sampleSources, sampleClaims);
assert('Discussion Brief contains 5 discussion questions', brief.five_discussion_questions.length === 5);
assert('Discussion Brief contains 5 key facts', brief.five_key_facts.length === 5);
assert('Discussion Brief contains 3 data gaps', brief.three_data_gaps.length === 3);
assert('Discussion Brief contains 3 stakeholder perspectives', brief.three_stakeholder_angles.length === 3);

// 7. Markdown Export
console.log('\n--- TEST GROUP 7: MARKDOWN EXPORT ---');
const md = exportDossierToMarkdown(dossier);
assert('Markdown export starts with title heading', md.includes('# BERKAS KAJIAN KEBIJAKAN (AI RESEARCH DOSSIER)'));
assert('Markdown export contains BAB I', md.includes('## BAB I. IDENTITAS DAN PARAMETER ISU'));
assert('Markdown export contains BAB XIII Marhaenisme', md.includes('BAB XIII. ANALISIS PERSPEKTIF GMNI'));

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passedTests} / ${totalTests} PASSED (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
console.log('====================================================\n');
