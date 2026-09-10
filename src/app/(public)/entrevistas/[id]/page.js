import Link from 'next/link';
import { supabase } from '../../../../lib/supabase';
import { SITE_URL } from '../../../../lib/constants';
import styles from './interview.module.css';

// Función para transformar URL de YouTube a embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { data: interview } = await supabase
    .from('entrevistas')
    .select('title, description, image_url')
    .eq('id', params.id)
    .single();

  if (!interview) return {};
  
  const shortDesc = interview.description ? interview.description.substring(0, 160) + '...' : '';

  return {
    title: `${interview.title} | Sangre Argentina`,
    description: shortDesc,
    alternates: {
      canonical: `/entrevistas/${params.id}`,
    },
    openGraph: {
      title: `${interview.title} | Entrevista exclusiva`,
      description: shortDesc,
      images: [
        {
          url: interview.image_url,
          width: 1200,
          height: 630,
          alt: `Portada de ${interview.title}`,
        }
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${interview.title} | Sangre Argentina`,
      description: shortDesc,
      images: [interview.image_url],
    }
  };
}

export default async function InterviewDetail({ params }) {
  const { id } = params;

  // Buscar la entrevista real en la base de datos
  const { data: interview, error } = await supabase
    .from('entrevistas')
    .select('*')
    .eq('id', id)
    .single();

  if (!interview || error) {
    return (
      <main className={`container ${styles.interviewMain}`} style={{ textAlign: 'center', paddingTop: '200px' }}>
        <h2>Entrevista no encontrada</h2>
        <Link href="/#entrevistas" style={{ color: 'var(--primary)', marginTop: '20px', display: 'inline-block' }}>
          Volver a la portada
        </Link>
      </main>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(interview.youtube_url);

  // Marcado de datos estructurados (JSON-LD) para Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RadioEpisode',
    name: interview.title,
    description: interview.description,
    image: interview.image_url,
    url: `${SITE_URL}/entrevistas/${interview.id}`,
    datePublished: interview.created_at,
    author: {
      '@type': 'Person',
      name: 'Rodrigo Migueles'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sangre Argentina',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`
      }
    }
  };

  return (
    <main className={`container ${styles.interviewMain}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.headerRow}>
        <h1>{interview.title}</h1>
      </div>

      <div className={styles.videoContainer}>
        {embedUrl ? (
          <iframe 
            src={embedUrl} 
            title={interview.title}
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            style={{ width: '100%', height: '100%' }}
          ></iframe>
        ) : (
          <div className={styles.iframePlaceholder}>
            <p>El enlace de YouTube no es válido</p>
          </div>
        )}
      </div>

      <div className={styles.detailsContainer}>
        <p className={styles.description}>
          {interview.description}
        </p>
      </div>
    </main>
  );
}
