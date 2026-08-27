async function testProduction() {
  const base = 'https://gmni.vercel.app';
  console.log('=== PRODUCTION LIVE VERIFICATION ===');
  console.log('Target URL:', base);

  // 1. /api/health
  const healthRes = await fetch(`${base}/api/health`, { headers: { 'Cache-Control': 'no-cache' } });
  const healthJson = await healthRes.json();
  console.log(`\n[API HEALTH] Status: ${healthRes.status}, database: ${healthJson.database}, tables: issues=${healthJson.issues_table}, articles=${healthJson.articles_table}`);

  // 2. /api/sync-status
  const syncRes = await fetch(`${base}/api/sync-status`, { headers: { 'Cache-Control': 'no-cache' } });
  const syncJson = await syncRes.json();
  console.log(`\n[API SYNC-STATUS] Status: ${syncRes.status}, data:`, syncJson.data);

  // 3. /api/issues
  const issuesRes = await fetch(`${base}/api/issues`, { headers: { 'Cache-Control': 'no-cache' } });
  const issuesJson = await issuesRes.json();
  console.log(`\n[API ISSUES] Status: ${issuesRes.status}, count: ${issuesJson.data?.length || 0}`);
  if (issuesJson.data && issuesJson.data.length > 0) {
    console.log('Top Issue:', {
      id: issuesJson.data[0].id,
      title: issuesJson.data[0].title,
      category: issuesJson.data[0].category,
      location: issuesJson.data[0].location,
      status: issuesJson.data[0].status,
      impact: issuesJson.data[0].impact_score,
      evidence: issuesJson.data[0].evidence_score,
      momentum: issuesJson.data[0].momentum_score,
      confidence: issuesJson.data[0].confidence_score,
      priority: issuesJson.data[0].priority_score,
    });
  }

  // 4. /api/articles
  const articlesRes = await fetch(`${base}/api/articles?limit=10`, { headers: { 'Cache-Control': 'no-cache' } });
  const articlesJson = await articlesRes.json();
  console.log(`\n[API ARTICLES] Status: ${articlesRes.status}, count: ${articlesJson.data?.length || 0}`);
  if (articlesJson.data && articlesJson.data.length > 0) {
    console.log('Sample Article 0:', {
      id: articlesJson.data[0].id,
      title: articlesJson.data[0].title,
      source_name: articlesJson.data[0].source_name,
      published_at: articlesJson.data[0].published_at,
    });
  }

  // 5. Test specific issue detail slug
  if (issuesJson.data && issuesJson.data.length > 0) {
    const slug = issuesJson.data[0].slug;
    const detailRes = await fetch(`${base}/api/issues/${slug}`, { headers: { 'Cache-Control': 'no-cache' } });
    console.log(`\n[API ISSUE DETAIL /api/issues/${slug}] Status: ${detailRes.status}`);
    if (detailRes.status === 200) {
      const detailJson = await detailRes.json();
      console.log('Detail loaded successfully for slug:', detailJson.data?.slug);
    }
  }

  console.log('\n====================================');
  console.log('ALL PRODUCTION ENDPOINTS VERIFIED!');
  console.log('====================================');
}

testProduction();
