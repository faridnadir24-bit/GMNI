async function run() {
  const base = 'https://gmni-wastu.vercel.app';
  
  const resHealth = await fetch(`${base}/api/health`);
  console.log('GET /api/health Status:', resHealth.status);
  const textHealth = await resHealth.text();
  console.log('GET /api/health Text (first 500 chars):', textHealth.slice(0, 500));

  const resHome = await fetch(`${base}/`);
  console.log('GET / Status:', resHome.status);
  const textHome = await resHome.text();
  console.log('GET / Text (first 500 chars):', textHome.slice(0, 500));
}

run();
