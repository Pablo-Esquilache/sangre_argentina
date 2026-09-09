"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './RadioPlayer.module.css';

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef(null);

  // Intentaremos reproducir la URL directamente (agregando /; que es el truco para Shoutcast)
  // Reemplazaremos http:// por https:// para probar si Shockmedia lo soporta nativamente.
  const streamUrl = "https://streaming01.shockmedia.com.ar:8484/;";

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setError(false);
      // Forzar recarga del stream en vivo para no escuchar caché
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Error al reproducir:", err);
        setError(true);
      });
    }
  };

  return (
    <div className={styles.playerContainer}>
      <div className={styles.playerHeader}>
        <div className={styles.liveBadge}>
          <span className={`${styles.dot} ${isPlaying ? styles.pulse : ''}`}></span>
          EN VIVO
        </div>
        <h3 className={styles.stationName}>Radio Municipal</h3>
      </div>
      
      <div className={styles.playerBody}>
        <div className={`${styles.artwork} ${isPlaying ? styles.spin : ''}`}>
          <Image src="/logo.jpg" alt="Radio Logo" width={120} height={120} className={styles.logoImg} />
        </div>
      </div>

      <div className={styles.playerControls}>
        <button onClick={togglePlay} className={styles.playBtn} aria-label={isPlaying ? "Pausar" : "Reproducir"}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2" fill="currentColor" style={{marginLeft: '4px'}}>
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
      </div>

      {error && (
        <div className={styles.errorMsg}>
          Bloqueado por seguridad (HTTPS).<br/>Contacta a Shockmedia.
        </div>
      )}

      {/* Elemento de audio invisible */}
      <audio ref={audioRef} preload="none">
        <source src={streamUrl} type="audio/mpeg" />
      </audio>
    </div>
  );
}
