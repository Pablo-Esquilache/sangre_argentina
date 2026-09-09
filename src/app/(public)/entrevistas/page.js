import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../../lib/supabase';
import styles from './entrevistas.module.css';

export const revalidate = 60; // ISR cache de 60 segundos

export const metadata = {
  title: 'Todas las Entrevistas | Sangre Argentina',
  description: 'Explora el archivo completo de entrevistas de Sangre Argentina con grandes referentes de nuestra cultura nacional.',
};

export default async function Entrevistas() {
  const { data: entrevistas, error } = await supabase
    .from('entrevistas')
    .select('id, title, subtitle, image_url')
    .order('created_at', { ascending: false });

  const list = entrevistas || [];

  return (
    <main className="container section-100vh">
      <div className={styles.header}>
        <h1>Todas las Entrevistas</h1>
        <p>Revive las mejores charlas que pasaron por Sangre Argentina.</p>
      </div>

      <div className={styles.grid}>
        {list.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No hay entrevistas publicadas aún.</p>
        ) : (
          list.map((interview) => (
            <Link href={`/entrevistas/${interview.id}`} key={interview.id} className={styles.card}>
              <div className={styles.thumbnailPlaceholder} style={{ position: 'relative' }}>
                <Image 
                  src={interview.image_url} 
                  alt={`Entrevista a ${interview.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={styles.cardContent}>
                <h3>{interview.title}</h3>
                <p>{interview.subtitle}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
