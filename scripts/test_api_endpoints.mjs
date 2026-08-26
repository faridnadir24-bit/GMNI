import * as fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) {
    process.env[k.trim()] = v.join('=').trim();
  }
});

async function testAPIEndpoints() {
  console.log('--- Testing API Endpoints Locally ---\n');

  // 1. Test /api/health
  console.log('[1] Testing /api/health ...');
  const { GET: healthGET } = await import('../src/app/api/health/route.ts');
  const healthRes = await healthGET();
  const healthJson = await healthRes.json();
  console.log('Status:', healthRes.status);
  console.log('Response:', JSON.stringify(healthJson, null, 2));

  // 2. Test /api/sync-status
  console.log('\n[2] Testing /api/sync-status ...');
  const { GET: statusGET } = await import('../src/app/api/sync-status/route.ts');
  const statusRes = await statusGET();
  const statusJson = await statusRes.json();
  console.log('Status:', statusRes.status);
  console.log('Response:', JSON.stringify(statusJson, null, 2));

  // 3. Test /api/issues
  console.log('\n[3] Testing /api/issues ...');
  const { GET: issuesGET } = await import('../src/app/api/issues/route.ts');
  const dummyReq = { nextUrl: { searchParams: new URLSearchParams() } };
  const issuesRes = await issuesGET(dummyReq);
  const issuesJson = await issuesRes.json();
  console.log('Status:', issuesRes.status);
  console.log(`Fetched: ${issuesJson.data?.length || 0} issues`);
  if (issuesJson.data && issuesJson.data.length > 0) {
    console.log('Sample Issue:', issuesJson.data[0].title);
  }

  console.log('\n✅ All API Routes Responded with Valid JSON');
}

testAPIEndpoints();
