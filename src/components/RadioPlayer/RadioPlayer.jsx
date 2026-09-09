import styles from './RadioPlayer.module.css';

export default function RadioPlayer() {
  return (
    <div className={styles.playerContainer}>
      <div className={styles.banner}>
        <h2>EN VIVO: Sangre Argentina</h2>
        <p>Lunes a Viernes de 10:00 a 13:00 hs</p>
        <span className={styles.liveIndicator}>Transmisión en vivo</span>
      </div>
      
      <div className={styles.iframeWrapper}>
        {/* Aquí va el iframe real de la radio provisto por el usuario */}
        <div className={styles.placeholder}>
          <p>Reproductor de Radio (Iframe)</p>
          <p className={styles.hint}>Aquí incrustaremos el enlace de tu streaming</p>
        </div>
      </div>
    </div>
  );
}
