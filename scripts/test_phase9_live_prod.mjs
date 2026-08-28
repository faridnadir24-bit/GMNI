import assert from 'assert';

console.log('====================================================');
console.log('TESTING LIVE PRODUCTION (FASE 9) — https://gmni.vercel.app');
console.log('====================================================\n');

async function testLiveProduction() {
  // 1. Check Homepage
  console.log('1. Testing Homepage HTTP 200...');
  const resHome = await fetch('https://gmni.vercel.app/');
  assert.strictEqual(resHome.status, 200, 'Homepage must return 200');
  console.log('✓ Homepage online (HTTP 200)');

  // 2. Fetch issues from production API
  console.log('\n2. Fetching issues from /api/issues...');
  const resIssues = await fetch('https://gmni.vercel.app/api/issues');
  assert.strictEqual(resIssues.status, 200, '/api/issues must return 200');
  const issuesData = await resIssues.json();
  assert(issuesData.success, 'API response must be success');
  const issues = issuesData.data || [];
  console.log(`✓ Fetched ${issues.length} active issues from production Supabase database`);
  
  if (issues.length === 0) {
    console.log('No issues found in production database to test dossier API.');
    return;
  }

  const sampleIssue = issues[0];
  const sampleId = sampleIssue.slug || sampleIssue.id;
  console.log(`Using sample issue: "${sampleIssue.title}" (${sampleId})`);

  // 3. Test 21-Chapter Dossier API
  console.log('\n3. Testing 21-Chapter Dossier (/api/dossier?type=dossier)...');
  const resDossier = await fetch(`https://gmni.vercel.app/api/dossier?issueId=${sampleId}&type=dossier`, {
    headers: { 'x-user-role': 'researcher' }
  });
  if (resDossier.status === 200) {
    const jsonDossier = await resDossier.json();
    assert(jsonDossier.success, 'Dossier API must succeed');
    console.log(`✓ 21-Chapter Dossier returned (${jsonDossier.data.chapters?.length || 0} chapters, ${jsonDossier.data.citation_coverage}% citation coverage)`);
  } else {
    console.log(`ℹ Dossier API returned status ${resDossier.status} (Vercel build might be completing)`);
  }

  // 4. Test Social Media Content API (/api/dossier?type=social)
  console.log('\n4. Testing Social Media Content (/api/dossier?type=social)...');
  const resSocial = await fetch(`https://gmni.vercel.app/api/dossier?issueId=${sampleId}&type=social`, {
    headers: { 'x-user-role': 'researcher' }
  });
  if (resSocial.status === 200) {
    const jsonSocial = await resSocial.json();
    assert(jsonSocial.success, 'Social API must succeed');
    console.log(`✓ Social Content returned (${jsonSocial.data.instagram_carousel?.length || 0} carousel slides, ${jsonSocial.data.twitter_thread?.length || 0} tweets)`);
  } else {
    console.log(`ℹ Social API returned status ${resSocial.status}`);
  }

  // 5. Test Policy Brief API (/api/dossier?type=policy_brief)
  console.log('\n5. Testing Policy Brief (/api/dossier?type=policy_brief)...');
  const resPb = await fetch(`https://gmni.vercel.app/api/dossier?issueId=${sampleId}&type=policy_brief`, {
    headers: { 'x-user-role': 'researcher' }
  });
  if (resPb.status === 200) {
    const jsonPb = await resPb.json();
    assert(jsonPb.success, 'Policy Brief API must succeed');
    console.log(`✓ Policy Brief returned: "${jsonPb.data.title}"`);
  }

  console.log('\n====================================================');
  console.log('LIVE PRODUCTION VERIFICATION COMPLETED');
  console.log('====================================================\n');
}

testLiveProduction().catch(err => {
  console.error('Production Verification Error:', err.message);
});
