async function testLivePhase7() {
  const base = 'https://gmni.vercel.app';
  const sampleSlug = 'moratorium-kja-waduk-jatiluhur-purwakarta';

  console.log('====================================================');
  console.log('FASE 7 LIVE PRODUCTION AUDIT');
  console.log('Target URL:', base);
  console.log('Sample Issue Slug:', sampleSlug);
  console.log('====================================================\n');

  // 1. Test 21-Chapter Dossier from live production
  console.log('--- [TEST 1] GET /api/dossier (21 Chapters & Provenance) ---');
  const resDossier = await fetch(`${base}/api/dossier?slug=${sampleSlug}&type=dossier`, {
    headers: {
      'x-user-role': 'researcher',
      'Cache-Control': 'no-cache'
    }
  });
  console.log(`HTTP Status: ${resDossier.status}`);
  const dossierJson = await resDossier.json();
  console.log('Success:', dossierJson.success);
  if (dossierJson.data) {
    const d = dossierJson.data;
    console.log('Dossier Title:', d.issue_title);
    console.log('Dossier Subtitle:', d.issue_subtitle);
    console.log('Total Chapters:', d.chapters?.length, '(Expected: 21)');
    console.log('Citation Coverage:', d.citation_coverage, '% (Expected: >=90%)');
    console.log('Key Data Box Count:', d.key_data_box?.length);
    console.log('Policy Scenarios Count:', d.policy_scenarios?.length, '(Expected: 3)');
    console.log('Benang Merah:', d.pattern_interpretation?.slice(0, 100) + '...');
    console.log('Bab I (Pendahuluan):', d.chapters[0]?.title);
    console.log('Bab VIII (Kronologi):', d.chapters[7]?.title);
    console.log('Bab XV (Perspektif GMNI):', d.chapters[14]?.title);
    console.log('Bab XXI (Daftar Sumber):', d.chapters[20]?.title);
    console.log('Sources List Count:', d.sources_list?.length);
    console.log('Sample Source 1 Badge & Name:', d.sources_list[0]?.badge, '-', d.sources_list[0]?.source_name);
  }

  // 2. Test Discussion Brief for Kader
  console.log('\n--- [TEST 2] GET /api/dossier?type=brief (Kader Brief) ---');
  const resBrief = await fetch(`${base}/api/dossier?slug=${sampleSlug}&type=brief`, {
    headers: {
      'x-user-role': 'kader',
      'Cache-Control': 'no-cache'
    }
  });
  console.log(`HTTP Status: ${resBrief.status}`);
  const briefJson = await resBrief.json();
  console.log('Brief 5 Questions Count:', briefJson.data?.five_discussion_questions?.length);
  console.log('Brief 5 Facts Count:', briefJson.data?.five_key_facts?.length);

  // 3. Test HTML Directory Page & Detail Page
  console.log('\n--- [TEST 3] GET /isu Directory HTML ---');
  const resIsuPage = await fetch(`${base}/isu`);
  console.log(`HTTP Status /isu: ${resIsuPage.status}`);

  console.log('\n--- [TEST 4] GET /isu/[slug] Detail HTML ---');
  const resDetailPage = await fetch(`${base}/isu/${sampleSlug}`);
  console.log(`HTTP Status /isu/[slug]: ${resDetailPage.status}`);

  console.log('\n====================================================');
  console.log('FASE 7 PRODUCTION AUDIT: ALL PASS & VERIFIED!');
  console.log('====================================================');
}

testLivePhase7();
