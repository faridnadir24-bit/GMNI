async function verify3Items() {
  const base = 'https://gmni.vercel.app';
  console.log('====================================================');
  console.log('FINAL AUDIT: MANUAL SYNC + REALTIME/POLLING + SCHEDULER');
  console.log('Target Production URL:', base);
  console.log('====================================================\n');

  // -----------------------------------------------------------
  // 1. BEFORE STATE
  // -----------------------------------------------------------
  console.log('--- [ITEM 1] RECORDING BEFORE STATE ---');
  const beforeRes = await fetch(`${base}/api/sync-status`, { headers: { 'Cache-Control': 'no-cache' } });
  const beforeData = (await beforeRes.json()).data;
  console.log('Before State:', beforeData);

  // -----------------------------------------------------------
  // 2. TRIGGER MANUAL SYNC ON PRODUCTION (POST /api/sync-news)
  // -----------------------------------------------------------
  console.log('\n--- [ITEM 2] EXECUTING LIVE MANUAL SYNC (POST /api/sync-news) ---');
  const syncStartTime = Date.now();
  const syncRes = await fetch(`${base}/api/sync-news`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({ batchLimit: 15 })
  });

  const syncDurationMs = Date.now() - syncStartTime;
  console.log(`Manual Sync HTTP Status: ${syncRes.status} (Duration: ${(syncDurationMs / 1000).toFixed(2)}s)`);

  const syncJson = await syncRes.json();
  console.log('Manual Sync Response:', JSON.stringify(syncJson, null, 2));

  // -----------------------------------------------------------
  // 3. AFTER STATE & DELTA VERIFICATION
  // -----------------------------------------------------------
  console.log('\n--- [ITEM 3] RECORDING AFTER STATE ---');
  const afterRes = await fetch(`${base}/api/sync-status`, { headers: { 'Cache-Control': 'no-cache' } });
  const afterData = (await afterRes.json()).data;
  console.log('After State:', afterData);

  // -----------------------------------------------------------
  // 4. TEST CRON SCHEDULER ENDPOINT (/api/cron)
  // -----------------------------------------------------------
  console.log('\n--- [ITEM 4] TESTING SCHEDULER CRON ENDPOINT (/api/cron) ---');
  
  // A. Unauthorized request without secret
  const unauthCronRes = await fetch(`${base}/api/cron`);
  console.log(`Cron (No Secret / Public): HTTP ${unauthCronRes.status} (Expected 401/403 for security)`);

  // B. Health check confirmation of scheduler config
  const healthRes = await fetch(`${base}/api/health`, { headers: { 'Cache-Control': 'no-cache' } });
  const healthJson = await healthRes.json();
  console.log('Production Health Config:', healthJson.config);
  console.log('Production Schema Status:', healthJson.schema_v2_status);

  console.log('\n====================================================');
  console.log('AUDIT COMPLETED');
  console.log('====================================================');
}

verify3Items();
