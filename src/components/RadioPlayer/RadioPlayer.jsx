"use client";
import { useState, useRef, useEffect } from 'react';
import styles from './RadioPlayer.module.css';

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(null);

  const streamUrl = "https://streaming01.shockmedia.com.ar:10458/stream";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setError(false);
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Error al reproducir:", err);
        setError(true);
      });
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className={styles.playerContainer}>
      
      {/* Fondo: Mástil de guitarra (Fretboard) */}
      <div className={styles.fretboard}>
        <div className={styles.frets}></div>
        <div className={styles.stringsContainer}>
          <div className={`${styles.string} ${styles.bass} ${isPlaying ? styles.vibrate : ''}`} style={{ animationDelay: '0.0s' }}></div>
          <div className={`${styles.string} ${styles.bass} ${isPlaying ? styles.vibrate : ''}`} style={{ animationDelay: '0.1s' }}></div>
          <div className={`${styles.string} ${styles.bass} ${isPlaying ? styles.vibrate : ''}`} style={{ animationDelay: '0.2s' }}></div>
          <div className={`${styles.string} ${styles.treble} ${isPlaying ? styles.vibrate : ''}`} style={{ animationDelay: '0.3s' }}></div>
          <div className={`${styles.string} ${styles.treble} ${isPlaying ? styles.vibrate : ''}`} style={{ animationDelay: '0.4s' }}></div>
          <div className={`${styles.string} ${styles.treble} ${isPlaying ? styles.vibrate : ''}`} style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>

      {/* Capa Frontal: Interfaz transparente flotante */}
      <div className={styles.uiOverlay}>
        <div className={styles.playerHeader}>
          <div className={styles.liveBadge}>
            <span className={`${styles.dot} ${isPlaying ? styles.pulse : ''}`}></span>
            EN VIVO
          </div>
        </div>

        <div className={styles.playerControls}>
          <div className={styles.volumeContainer}>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume} 
              onChange={handleVolumeChange} 
              className={styles.volumeSlider}
              aria-label="Volumen"
            />
          </div>
          <button onClick={togglePlay} className={styles.playBtn} aria-label={isPlaying ? "Pausar" : "Reproducir"}>
            {isPlaying ? (
              <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" strokeWidth="2" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" strokeWidth="2" fill="currentColor" style={{marginLeft: '4px'}}>
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>
        </div>
        
        {error && (
          <div className={styles.errorMsg}>
            Error al conectar.<br/>Intenta más tarde.
          </div>
        )}
      </div>

      <audio ref={audioRef} preload="none">
        <source src={streamUrl} type="audio/mpeg" />
      </audio>
    </div>
  );
}
