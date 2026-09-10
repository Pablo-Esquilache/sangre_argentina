import { supabase } from '../lib/supabase';
import { SITE_URL } from '../lib/constants';

export const revalidate = 3600; // Refrescar sitemap cada hora

export default async function sitemap() {
  const baseUrl = SITE_URL;

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
