import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) {
    env[k.trim()] = v.join('=').trim();
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testCRUD() {
  console.log('Testing CRUD operations on all tables...\n');

  // 1. Articles table
  const testArticle = {
    url: `https://test.example.com/article-${Date.now()}`,
    canonical_url: `https://test.example.com/article-${Date.now()}`,
    title: 'Test Artikel Ingestion Radar Purwakarta',
    summary: 'Pengujian integrasi pipeline Supabase V2.',
    content: 'Konten pengujian integrasi.',
    source_name: 'Media Test',
    source_type: 'national_media',
    published_at: new Date().toISOString(),
    fetched_at: new Date().toISOString(),
    hash: `hash-${Date.now()}`,
    language: 'id',
    processed: false
  };

  const { data: artData, error: artErr } = await supabase
    .from('articles')
    .insert(testArticle)
    .select()
    .single();

  if (artErr) {
    console.log('❌ articles insert error:', artErr.message);
  } else {
    console.log('✅ articles insert SUCCESS. ID:', artData.id);
  }

  // 2. Query issues
  const { data: issuesData, error: issuesErr } = await supabase
    .from('issues')
    .select('id, title, category, location, sub_location, impact_score, evidence_score, momentum_score, source_count')
    .limit(3);

  if (issuesErr) {
    console.log('❌ issues query error:', issuesErr.message);
  } else {
    console.log(`✅ issues query SUCCESS. Fetched ${issuesData.length} sample issues.`);
    issuesData.forEach(i => console.log(`   - [${i.location}] ${i.title} (${i.category})`));
  }

  // 3. Test issue_sources
  if (issuesData && issuesData.length > 0 && artData) {
    const testSource = {
      issue_id: issuesData[0].id,
      article_id: artData.id,
      source_url: testArticle.url,
      source_name: 'Media Test',
      source_type: 'national_media',
      relevance_score: 95,
      credibility_score: 85,
      is_primary: true
    };

    const { data: srcData, error: srcErr } = await supabase
      .from('issue_sources')
      .insert(testSource)
      .select()
      .single();

    if (srcErr) {
      console.log('❌ issue_sources insert error:', srcErr.message);
    } else {
      console.log('✅ issue_sources insert SUCCESS. ID:', srcData.id);
    }

    // 4. Test issue_events
    const testEvent = {
      issue_id: issuesData[0].id,
      event_type: 'source_added',
      title: 'Uji Validasi Sumber Terverifikasi',
      description: 'Penambahan sumber data verifikasi sistem ke timeline perkembangan isu.',
      source_name: 'Media Test',
      event_at: new Date().toISOString()
    };

    const { data: evtData, error: evtErr } = await supabase
      .from('issue_events')
      .insert(testEvent)
      .select()
      .single();

    if (evtErr) {
      console.log('❌ issue_events insert error:', evtErr.message);
    } else {
      console.log('✅ issue_events insert SUCCESS. ID:', evtData.id);
    }
  }
}

testCRUD();
