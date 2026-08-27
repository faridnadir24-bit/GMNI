async function run() {
  const domains = [
    'https://gmni-wastu.vercel.app',
    'https://gmniwastukancana.vercel.app',
    'https://gmni.vercel.app'
  ];

  for (const d of domains) {
    try {
      const res = await fetch(`${d}/api/health`);
      console.log(`Domain: ${d} -> /api/health Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text.slice(0, 150)}...\n`);
    } catch (e) {
      console.log(`Domain: ${d} failed: ${e.message}\n`);
    }
  }
}

run();
