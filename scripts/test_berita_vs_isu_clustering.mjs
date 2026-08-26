import * as fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) {
    process.env[k.trim()] = v.join('=').trim();
  }
});

async function runBeritaVsIsuTest() {
  const { matchArticleToIssue, generateNeutralIssueTitle } = await import('../src/lib/services/issue-cluster.ts');

  console.log('=== TEST BERITA ≠ ISU (Clustering & Deduplication) ===\n');

  // Candidate issues starting empty
  const candidateIssues = [];
  let issueCounter = 1;
  const createdIssues = [];
  const issueSourcesMap = new Map();

  const testArticles = [
    {
      id: 'art-01',
      title: 'Penertiban Keramba Jaring Apung KJA di Waduk Jatiluhur Dimulai Hari Ini',
      summary: 'Satpol PP bersama pengelola waduk menertibkan keramba jaring apung liar di Waduk Jatiluhur Purwakarta.',
      category: 'Agraria & Lingkungan',
      location: 'Purwakarta',
      sub_location: 'Kecamatan Jatiluhur',
      source_name: 'Antara Jabar',
      url: 'https://jabar.antaranews.com/berita/101'
    },
    {
      id: 'art-02',
      title: 'Pemkab Purwakarta dan PJT II Bahas Dampak Penataan KJA Waduk Jatiluhur',
      summary: 'Audiensi bersama pemangku kepentingan mengenai penataan kuota KJA Jatiluhur dan kompensasi pembudidaya.',
      category: 'Agraria & Lingkungan',
      location: 'Purwakarta',
      sub_location: 'Kecamatan Jatiluhur',
      source_name: 'Tempo Nasional',
      url: 'https://tempo.co/read/102'
    },
    {
      id: 'art-03',
      title: 'Pembudidaya Ikan Waduk Jatiluhur Keluhkan Penataan Keramba dan Ketidakpastian Bantuan',
      summary: 'Asosiasi petani ikan lokal Jatiluhur meminta kejelasan skema alih profesi pasca penertiban keramba jaring apung.',
      category: 'Agraria & Lingkungan',
      location: 'Purwakarta',
      sub_location: 'Kecamatan Jatiluhur',
      source_name: 'Radar Purwakarta',
      url: 'https://radar-purwakarta.com/103'
    },
    {
      id: 'art-04',
      title: 'Disparitas Upah Minimum dan Penyerapan Tenaga Kerja Lokal di Kawasan Industri Bungursari Purwakarta',
      summary: 'Serikat buruh menuntut kenaikan UMK dan perlindungan hak pekerja di kawasan industri.',
      category: 'Ketenagakerjaan',
      location: 'Purwakarta',
      sub_location: 'Kecamatan Bungursari',
      source_name: 'Republika',
      url: 'https://republika.co.id/104'
    }
  ];

  for (const art of testArticles) {
    console.log(`[Processing Article] "${art.title}" (${art.source_name})`);

    const match = matchArticleToIssue(
      {
        title: art.title,
        summary: art.summary,
        category: art.category,
        location: art.location,
        sub_location: art.sub_location,
        published_at: new Date().toISOString()
      },
      candidateIssues
    );

    if (match.isMatch && match.matchedIssueId) {
      console.log(` -> 🟢 CLUSTERED to existing Issue [${match.matchedIssueId}] "${match.matchedIssueTitle}"`);
      console.log(`    Match Score: ${match.similarityScore.toFixed(2)}, Reason: ${match.reason}`);
      const sources = issueSourcesMap.get(match.matchedIssueId) || [];
      sources.push({ url: art.url, source_name: art.source_name, title: art.title });
      issueSourcesMap.set(match.matchedIssueId, sources);
    } else {
      const issueId = `issue-${String(issueCounter++).padStart(2, '0')}`;
      const neutralTitle = generateNeutralIssueTitle(art.title, art.category, art.location, art.sub_location);
      console.log(` -> 🔵 CREATED NEW ISSUE [${issueId}] "${neutralTitle}"`);
      
      const newIssue = {
        id: issueId,
        title: neutralTitle,
        category: art.category,
        location: art.location,
        sub_location: art.sub_location,
        summary: art.summary,
        last_activity_at: new Date().toISOString(),
        detected_at: new Date().toISOString()
      };
      
      candidateIssues.push(newIssue);
      createdIssues.push(newIssue);
      issueSourcesMap.set(issueId, [{ url: art.url, source_name: art.source_name, title: art.title }]);
    }
    console.log('');
  }

  console.log('========================================');
  console.log('SUMMARY CLUSTERING VALIDATION:');
  console.log(`Total Articles Processed: ${testArticles.length}`);
  console.log(`Total Distinct Issues Created: ${createdIssues.length}`);
  console.log('----------------------------------------');
  for (const iss of createdIssues) {
    const sources = issueSourcesMap.get(iss.id) || [];
    console.log(`Issue [${iss.id}]: "${iss.title}"`);
    console.log(` -> Sources Attached (${sources.length} sources):`);
    sources.forEach((s, idx) => console.log(`    [Source ${String(idx+1).padStart(2, '0')}] ${s.source_name}: "${s.title}"`));
  }

  const isSuccess = 
    createdIssues.length === 2 && // 1 for Jatiluhur KJA topic, 1 for Bungursari Labor topic
    issueSourcesMap.get('issue-01')?.length === 3 &&
    issueSourcesMap.get('issue-02')?.length === 1;

  console.log('========================================');
  if (isSuccess) {
    console.log('✅ TEST BERITA ≠ ISU: PASSED (3 KJA articles clustered into 1 Issue, 1 Labor article formed distinct issue)');
  } else {
    console.log('❌ TEST BERITA ≠ ISU: FAILED');
  }
}

runBeritaVsIsuTest();
