import Link from 'next/link';
import styles from './interview.module.css';

export default function InterviewDetail({ params }) {
  const { id } = params;

  return (
    <main className={`container ${styles.interviewMain}`}>
      <div className={styles.headerRow}>
        <h1>Entrevista Especial #{id}</h1>
      </div>

      <div className={styles.videoContainer}>
        <div className={styles.iframePlaceholder}>
          <p>Iframe de YouTube (Video ID: {id})</p>
        </div>
      </div>

      <div className={styles.detailsContainer}>
        <p className={styles.description}>
          Esta es la descripción detallada de la entrevista. Aquí iría el texto largo
          que el administrador ingresa al momento de publicar el video. Cuenta los temas
          que se hablaron, presenta al invitado y da contexto.
        </p>
      </div>
    </main>
  );
}
