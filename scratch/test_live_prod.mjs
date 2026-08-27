async function run() {
  const base = 'https://gmni-wastu.vercel.app';
  console.log('Testing live production APIs at:', base);

  const endpoints = ['/api/health', '/api/sync-status', '/api/issues', '/api/articles'];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${base}${ep}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      console.log(`\n=== GET ${ep} (Status: ${res.status}) ===`);
      const json = await res.json();
      console.log('Response keys:', Object.keys(json));
      if (json.data) {
        if (Array.isArray(json.data)) {
          console.log(`Data count: ${json.data.length}`);
          if (json.data.length > 0) {
            console.log('Sample item 0 title:', json.data[0].title);
            console.log('Sample item 0 keys:', Object.keys(json.data[0]));
          }
        } else {
          console.log('Data object:', json.data);
        }
      }
      if (json.error) console.log('Error:', json.error);
    } catch (e) {
      console.error(`Failed GET ${ep}:`, e.message);
    }
  }
}

run();
