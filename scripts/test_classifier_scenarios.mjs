import * as fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) {
    process.env[k.trim()] = v.join('=').trim();
  }
});

async function runClassifierTests() {
  const { classifyArticleWithAI } = await import('../src/lib/services/ai-classifier.ts');

  const testCases = [
    {
      id: 1,
      name: 'Irrelevant Article (Horoscope/Entertainment)',
      title: 'Ramalan Zodiak Scorpio Hari Ini: Peluang Asmara dan Karir',
      content: 'Bagi pemilik zodiak Scorpio hari ini adalah hari penuh kejutan di bidang asmara.'
    },
    {
      id: 2,
      name: 'Purwakarta Article (Jatiluhur KJA)',
      title: 'Satpol PP dan PJT II Lakukan Penertiban Keramba Jaring Apung di Waduk Jatiluhur Purwakarta',
      content: 'Pemerintah Kabupaten Purwakarta bersama PJT II menertibkan ratusan petak KJA ilegal di Kecamatan Jatiluhur untuk pemulihan ekosistem dan pengamanan Obvitnas.'
    },
    {
      id: 3,
      name: 'Jawa Barat Article (Bandung Waste)',
      title: 'Pemprov Jawa Barat Evaluasi Kebijakan Pengelolaan Sampah dan Limbah Terpadu di Bandung Raya',
      content: 'Pemerintah Provinsi Jawa Barat meninjau tempat pembuangan akhir dan sistem pengolahan sampah regional di kawasan Bandung Raya.'
    },
    {
      id: 4,
      name: 'National Political Article (DPR & Election)',
      title: 'DPR dan KPU Matangkan Rancangan Peraturan Pilkada Serentak Nasional',
      content: 'Komisi II DPR RI menggelar rapat konsultasi bersama KPU dan Bawaslu untuk menyusun kerangka teknis pengawasan pemilu serentak.'
    },
    {
      id: 5,
      name: 'Social / Labor Article (Labor Wages & Layoffs)',
      title: 'Ratusan Buruh Pabrik Manufaktur Gelar Aksi Tolak PHK dan Tuntut Kepastian Upah Lembur',
      content: 'Serikat pekerja menggelar demonstrasi menuntut pembayaran pesangon dan transparansi perhitungan upah lembur bagi buruh kontrak.'
    },
    {
      id: 6,
      name: 'Environmental Article (Forest & River Pollution)',
      title: 'Aktivis Lingkungan Laporkan Pencemaran Limbah B3 Cair ke Aliran Sungai Citarum',
      content: 'Pencemaran limbah industri cair mengancam kualitas air sungai dan ekosistem perairan di hilir Jawa Barat.'
    },
    {
      id: 7,
      name: 'Conflicting Claims Article',
      title: 'Pemda Klaim Ganti Rugi Lahan Selesai, Warga Menyatakan Belum Terima Uang Kompensasi',
      content: 'Pihak dinas menyatakan seluruh kompensasi telah disalurkan melalui rekening desa, namun perwakilan warga menegaskan tidak ada pencairan resmi.'
    }
  ];

  console.log('--- Running AI Classifier Test Scenarios ---');
  let passedCount = 0;

  for (const tc of testCases) {
    const res = await classifyArticleWithAI(tc.title, tc.content);
    console.log(`\nTest #${tc.id}: ${tc.name}`);
    console.log(`- Relevant: ${res.relevant}`);
    console.log(`- Category: ${res.category}`);
    console.log(`- Location: ${res.location} (${res.sub_location || 'None'})`);
    console.log(`- Scores: Impact=${res.impact_score}, Evidence=${res.evidence_score}, Momentum=${res.momentum_score}`);
    console.log(`- Verified Facts: ${res.verified_facts.length} item(s)`);
    console.log(`- Claims: ${res.claims.length} item(s)`);
    console.log(`- Research Questions: ${res.research_questions.length} item(s)`);

    const hasRequiredFields = 
      typeof res.relevant === 'boolean' &&
      typeof res.title === 'string' &&
      typeof res.summary === 'string' &&
      typeof res.category === 'string' &&
      typeof res.location === 'string' &&
      typeof res.impact_score === 'number' &&
      typeof res.evidence_score === 'number' &&
      typeof res.momentum_score === 'number' &&
      Array.isArray(res.verified_facts) &&
      Array.isArray(res.claims) &&
      Array.isArray(res.research_questions);

    if (hasRequiredFields) {
      if (tc.id === 1 && res.relevant === false) {
        console.log('✅ PASS (Correctly filtered irrelevant)');
        passedCount++;
      } else if (tc.id === 2 && res.location === 'Purwakarta') {
        console.log('✅ PASS (Correctly tagged Purwakarta)');
        passedCount++;
      } else if (tc.id === 3 && res.location === 'Jawa Barat') {
        console.log('✅ PASS (Correctly tagged Jawa Barat)');
        passedCount++;
      } else if (tc.id > 3) {
        console.log('✅ PASS (Valid structured output)');
        passedCount++;
      } else {
        console.log('⚠️ PARTIAL MATCH');
      }
    } else {
      console.log('❌ FAIL (Invalid output schema)');
    }
  }

  console.log(`\n========================================`);
  console.log(`Test Result: ${passedCount}/${testCases.length} (${Math.round(passedCount/testCases.length * 100)}%) Scenarios Passed`);
  console.log(`========================================`);
}

runClassifierTests();
