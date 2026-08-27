async function testSingle() {
  const base = 'https://gmni.vercel.app';
  const slug = 'moratorium-kja-waduk-jatiluhur-purwakarta';
  const res = await fetch(`${base}/api/issues/${slug}`);
  console.log(`GET /api/issues/${slug} -> Status: ${res.status}`);
  const json = await res.json();
  console.log('Success:', json.success);
  if (json.data) {
    console.log('Title:', json.data.title);
    console.log('Slug:', json.data.slug);
    console.log('Category:', json.data.category);
    console.log('Location:', json.data.location);
    console.log('Impact:', json.data.impact_score);
    console.log('Confidence:', json.data.confidence_score);
    console.log('Evidence Breakdown:', json.data.evidence_breakdown);
    console.log('Events Count:', json.data.events?.length);
    console.log('What Changed:', json.data.what_changed);
  }
}

testSingle();
