import { supabase } from '../src/lib/services/supabase.ts';

async function checkIssueSlug() {
  const { data, error } = await supabase
    .from('issues')
    .select('id, slug, title')
    .limit(5);

  console.log('Direct Supabase issues:', data);
  if (error) console.error('Error:', error);

  if (data && data.length > 0) {
    for (const item of data) {
      console.log(`Checking slug "${item.slug}" and id "${item.id}"...`);
      const bySlug = await supabase.from('issues').select('id, slug').eq('slug', item.slug).maybeSingle();
      console.log('Match by slug result:', bySlug.data?.slug);
    }
  }
}

checkIssueSlug();
