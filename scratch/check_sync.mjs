async function run() {
  const domains = [
    'https://gmni-wastu.vercel.app',
    'https://gmni.vercel.app'
  ];

  for (const d of domains) {
    try {
      const res = await fetch(`${d}/api/sync-status`);
      console.log(`[${d}] Status: ${res.status}`);
      if (res.status === 200) {
        console.log(`[${d}] Body:`, await res.json());
      } else {
        console.log(`[${d}] Text:`, (await res.text()).slice(0, 100));
      }
    } catch (e) {
      console.log(`[${d}] Error:`, e.message);
    }
  }
}

run();
