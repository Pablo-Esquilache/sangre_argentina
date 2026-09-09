"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import styles from './InterviewGrid.module.css';

export default function InterviewGrid({ initialInterviews }) {
  const [interviews, setInterviews] = useState(initialInterviews || []);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const scrollRef = useRef(null);
  const itemsPerPage = 9;

  const fetchInterviews = async (pageNumber) => {
    setIsLoading(true);
    const from = (pageNumber - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, error } = await supabase
      .from('entrevistas')
      .select('id, title, subtitle, image_url')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!error && data) {
      setInterviews(data);
      setHasMore(data.length === itemsPerPage);
    }
    setIsLoading(false);
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchInterviews(nextPage);
    // Scroll al principio del modal al cambiar de página
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      fetchInterviews(prevPage);
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    }
  };

  return (
    <div className={styles.gridWrapper}>
      <div className={styles.gridScroll} ref={scrollRef}>
        <div className={styles.grid}>
          {interviews.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>
              Aún no hay entrevistas publicadas.
            </p>
          ) : (
            interviews.map((interview) => (
              <Link href={`/entrevistas/${interview.id}`} key={interview.id} className={styles.card}>
                <div className={styles.thumbnailContainer}>
                  <Image 
                    src={interview.image_url} 
                    alt={`Portada de entrevista a ${interview.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={styles.thumbnailImage}
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
      </div>
      
      {/* Paginación */}
      <div className={styles.paginationContainer}>
        <button 
          className={styles.pageBtn} 
          onClick={handlePrevPage} 
          disabled={page === 1 || isLoading}
        >
          Anterior
        </button>
        <span className={styles.pageInfo}>
          {isLoading ? 'Cargando...' : `Página ${page}`}
        </span>
        <button 
          className={styles.pageBtn} 
          onClick={handleNextPage} 
          disabled={!hasMore || isLoading}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
