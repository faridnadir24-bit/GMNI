async function testGmniVercelApp() {
  const base = 'https://gmni.vercel.app';
  console.log('Testing endpoints on:', base);

  const eps = ['/api/health', '/api/sync-status', '/api/issues', '/api/articles'];
  for (const ep of eps) {
    const res = await fetch(`${base}${ep}`);
    console.log(`\n=== GET ${ep} (Status: ${res.status}) ===`);
    try {
      const json = await res.json();
      console.log('JSON keys:', Object.keys(json));
      if (json.data) {
        if (Array.isArray(json.data)) {
          console.log(`Data count: ${json.data.length}`);
          if (json.data.length > 0) {
            console.log('Item 0:', JSON.stringify(json.data[0]).slice(0, 200));
          }
        } else {
          console.log('Data object:', json.data);
        }
      }
    } catch (e) {
      console.log('Raw text:', (await res.text()).slice(0, 200));
    }
  }
}

testGmniVercelApp();
