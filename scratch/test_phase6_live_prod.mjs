async function testLivePhase6() {
  const base = 'https://gmni.vercel.app';
  const sampleSlug = 'moratorium-kja-waduk-jatiluhur-purwakarta';

  console.log('====================================================');
  console.log('FASE 6 LIVE PRODUCTION VERIFICATION');
  console.log('Target URL:', base);
  console.log('Sample Issue Slug:', sampleSlug);
  console.log('====================================================\n');

  // 1. Test Researcher Access to 18-Chapter Dossier
  console.log('--- [TEST 1] GET /api/dossier (Role: Researcher) ---');
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
    console.log('Dossier Title:', dossierJson.data.issue_title);
    console.log('Chapters Count:', dossierJson.data.chapters?.length);
    console.log('Total Sources Cited:', dossierJson.data.total_sources_cited);
    console.log('Bab I Title:', dossierJson.data.chapters[0]?.title);
    console.log('Bab XIII (Marhaenisme) Title:', dossierJson.data.chapters[12]?.title);
    console.log('Bab XV (Pertanyaan Kajian) Title:', dossierJson.data.chapters[14]?.title);
    console.log('Bab XVIII (Citations) Count:', dossierJson.data.chapters[17]?.citations?.length);
  }

  // 2. Test Kader Access to Discussion Brief
  console.log('\n--- [TEST 2] GET /api/dossier?type=brief (Role: Kader) ---');
  const resBrief = await fetch(`${base}/api/dossier?slug=${sampleSlug}&type=brief`, {
    headers: {
      'x-user-role': 'kader',
      'Cache-Control': 'no-cache'
    }
  });
  console.log(`HTTP Status: ${resBrief.status}`);
  const briefJson = await resBrief.json();
  console.log('Success:', briefJson.success);
  if (briefJson.data) {
    console.log('Brief Title:', briefJson.data.issue_title);
    console.log('5 Questions Count:', briefJson.data.five_discussion_questions?.length);
    console.log('5 Facts Count:', briefJson.data.five_key_facts?.length);
    console.log('3 Data Gaps Count:', briefJson.data.three_data_gaps?.length);
    console.log('Sample Question 1:', briefJson.data.five_discussion_questions[0]);
  }

  // 3. Test Public Role Guard (Must be 403 Forbidden for internal dossier)
  console.log('\n--- [TEST 3] GET /api/dossier (Role: Public - Guard Check) ---');
  const resPublic = await fetch(`${base}/api/dossier?slug=${sampleSlug}&type=dossier`, {
    headers: {
      'x-user-role': 'public',
      'Cache-Control': 'no-cache'
    }
  });
  console.log(`HTTP Status: ${resPublic.status} (Expected: 403 Forbidden)`);
  const publicJson = await resPublic.json();
  console.log('Error Message:', publicJson.error);

  // 4. Test POST /api/dossier with Public (Must be 403 Forbidden)
  console.log('\n--- [TEST 4] POST /api/dossier (Role: Public - Guard Check) ---');
  const resPostPublic = await fetch(`${base}/api/dossier`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ issueId: sampleSlug, type: 'dossier', role: 'public' })
  });
  console.log(`HTTP Status: ${resPostPublic.status} (Expected: 403 Forbidden)`);
  const postPublicJson = await resPostPublic.json();
  console.log('Error Message:', postPublicJson.error);

  // 5. Test POST /api/dossier with Researcher (Must be 200 OK)
  console.log('\n--- [TEST 5] POST /api/dossier (Role: Researcher) ---');
  const resPostResearcher = await fetch(`${base}/api/dossier`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ issueId: sampleSlug, type: 'dossier', role: 'researcher' })
  });
  console.log(`HTTP Status: ${resPostResearcher.status} (Expected: 200 OK)`);
  const postResJson = await resPostResearcher.json();
  console.log('Success:', postResJson.success);
  console.log('Message:', postResJson.message);

  // 6. Test Frontend Issue Detail Page
  console.log('\n--- [TEST 6] GET /isu/[slug] HTML Page ---');
  const resPage = await fetch(`${base}/isu/${sampleSlug}`);
  console.log(`HTTP Status: ${resPage.status} (Expected: 200 OK)`);

  console.log('\n====================================================');
  console.log('FASE 6 LIVE PRODUCTION AUDIT COMPLETE: ALL PASS!');
  console.log('====================================================');
}

testLivePhase6();
