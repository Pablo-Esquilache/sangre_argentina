import { supabase } from '../lib/supabase';

export default async function sitemap() {
  const baseUrl = 'https://sangre-argentina.netlify.app';

  // Obtener todas las entrevistas para el sitemap
  const { data: entrevistas } = await supabase
    .from('entrevistas')
    .select('id, created_at');

  const entrevistasUrls = (entrevistas || []).map((entrevista) => ({
    url: `${baseUrl}/entrevistas/${entrevista.id}`,
    lastModified: new Date(entrevista.created_at).toISOString(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...entrevistasUrls,
  ];
}
