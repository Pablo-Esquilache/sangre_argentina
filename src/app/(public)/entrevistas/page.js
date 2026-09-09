import Link from 'next/link';
import styles from './entrevistas.module.css';

// Datos de prueba temporales hasta que conectemos Supabase
const mockInterviews = Array(9).fill(null).map((_, i) => ({
  id: i + 1,
  title: `Entrevista Especial #${i + 1}`,
  description: 'Breve descripción de la entrevista y el invitado especial del día.',
}));

export default function Entrevistas() {
  return (
    <main className="container section-100vh">
      <div className={styles.header}>
        <h1>Entrevistas</h1>
        <p>Revive las mejores charlas que pasaron por Sangre Argentina.</p>
      </div>

      <div className={styles.grid}>
        {mockInterviews.map((interview) => (
          <Link href={`/entrevistas/${interview.id}`} key={interview.id} className={styles.card}>
            <div className={styles.thumbnailPlaceholder}>
              Miniatura
            </div>
            <div className={styles.cardContent}>
              <h3>{interview.title}</h3>
              <p>{interview.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.loadMoreContainer}>
        <button className={styles.loadMoreBtn}>Cargar más entrevistas</button>
      </div>
    </main>
  );
}
