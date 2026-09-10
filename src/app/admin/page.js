"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';
import imageCompression from 'browser-image-compression';
import styles from './admin.module.css';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const supabase = createClient();
  const [interviews, setInterviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [previewId, setPreviewId] = useState(null); // Para el modal
  
  // Paginación
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 10;
  
  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [oldImageUrl, setOldImageUrl] = useState(null);
  
  const [isCompressing, setIsCompressing] = useState(false);
  const [optimizedImage, setOptimizedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  
  const router = useRouter();

  const fetchInterviews = async (pageNumber = 1) => {
    setIsLoadingList(true);
    const from = (pageNumber - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, error } = await supabase
      .from('entrevistas')
      .select('id, title, created_at, image_url, subtitle, description, youtube_url')
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (data) {
      setInterviews(data);
      setHasMore(data.length === itemsPerPage);
    }
    setIsLoadingList(false);
  };

  useEffect(() => {
    fetchInterviews(page);
  }, [page]);

  const handleNextPage = () => {
    if (hasMore) setPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      setOptimizedImage(compressedFile);
    } catch (error) {
      alert('Error optimizando la imagen');
      console.error(error);
    } finally {
      setIsCompressing(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setUrl('');
    setDescription('');
    setOldImageUrl(null);
    setOptimizedImage(null);
    const fileInput = document.getElementById('image');
    if (fileInput) fileInput.value = '';
  };

  const handleEditClick = (interview) => {
    setEditingId(interview.id);
    setTitle(interview.title);
    setSubtitle(interview.subtitle);
    setUrl(interview.youtube_url);
    setDescription(interview.description);
    setOldImageUrl(interview.image_url);
    setOptimizedImage(null);
    const fileInput = document.getElementById('image');
    if (fileInput) fileInput.value = '';
    
    // Scroll smoothly to form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, title, imageUrl) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la entrevista: "${title}"?`)) return;

    try {
      const { error } = await supabase.from('entrevistas').delete().eq('id', id);
      if (error) throw error;
      
      if (imageUrl) {
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          await supabase.storage.from('portadas').remove([fileName]);
        }
      }
      
      alert('Entrevista eliminada correctamente.');
      if (editingId === id) resetForm();
      
      // Volver a la página 1 tras eliminar para evitar desfases
      setPage(1);
      fetchInterviews(1);
    } catch (error) {
      alert('Error eliminando la entrevista: ' + error.message);
    }
  };

  const handleSubmitInterview = async (e) => {
    e.preventDefault();
    
    // If creating new, image is required. If editing, image is optional.
    if (!editingId && !optimizedImage) {
      alert('Por favor selecciona y espera a que se optimice la imagen.');
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = null;

      if (optimizedImage) {
        // Subir la nueva imagen
        const fileExt = optimizedImage.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('portadas')
          .upload(fileName, optimizedImage);

        if (uploadError) throw new Error('Error subiendo la imagen: ' + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from('portadas')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrlData.publicUrl;
      }

      const payload = {
        title: title,
        subtitle: subtitle,
        youtube_url: url,
        description: description,
      };

      if (imageUrl) {
        payload.image_url = imageUrl;
      }

      if (editingId) {
        // UPDATE
        const { error: updateError } = await supabase
          .from('entrevistas')
          .update(payload)
          .eq('id', editingId);

        if (updateError) throw new Error('Error actualizando: ' + updateError.message);
        
        // Borrar la imagen vieja si se subió una nueva exitosamente
        if (imageUrl && oldImageUrl) {
          const oldFileName = oldImageUrl.split('/').pop();
          if (oldFileName) {
            await supabase.storage.from('portadas').remove([oldFileName]);
          }
        }
        
        alert('Entrevista actualizada con éxito!');
      } else {
        // INSERT
        const { error: insertError } = await supabase
          .from('entrevistas')
          .insert([payload]);

        if (insertError) throw new Error('Error guardando: ' + insertError.message);
        alert('Entrevista publicada con éxito!');
      }
      
      resetForm();
      fetchInterviews(page);
      
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Modal de Previsualización */}
      {previewId && (
        <div className={styles.modalOverlay} onClick={() => setPreviewId(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Vista Previa de Entrevista</h3>
              <button className={styles.modalCloseBtn} onClick={() => setPreviewId(null)}>&times;</button>
            </div>
            <iframe src={`/entrevistas/${previewId}`} className={styles.previewIframe} title="Preview" />
          </div>
        </div>
      )}

      <div className={styles.adminContainer}>
        <div className={styles.adminHeader}>
          <h2>Panel de Administración</h2>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={() => window.open('/', '_blank')} className={styles.pageBtn} style={{ padding: '5px 10px', fontSize: '0.9rem' }}>
              Ir a la Web ↗
            </button>
            <button onClick={handleLogout} className={styles.logoutBtn}>Cerrar Sesión</button>
          </div>
        </div>

        <div className={styles.adminGrid}>
          
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className={styles.adminCard}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '5px' }}>
              {editingId ? 'Editando Entrevista' : 'Subir Nueva Entrevista'}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
              {editingId ? 'Modifica los datos y guarda los cambios.' : 'Completa los datos para publicar.'}
            </p>

            <form className={styles.form} onSubmit={handleSubmitInterview}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Título</label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Especial Folklore Vivo" required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subtitle">Subtítulo</label>
                <input type="text" id="subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Ej: Con Los Nocheros" required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="url">URL del video de YouTube</label>
                <input type="url" id="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="desc">Descripción detallada</label>
                <textarea id="desc" rows="4" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe la entrevista..." required></textarea>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image">Miniatura/portada {isCompressing && "(Optimizando... ⏳)"}</label>
                <input 
                  type="file" 
                  id="image" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  required={!editingId} 
                />
                {editingId && !optimizedImage && (
                  <small style={{color: 'var(--text-muted)', marginTop: '5px'}}>Deja en blanco para conservar la imagen actual.</small>
                )}
                {optimizedImage && <small style={{color: 'var(--primary)', marginTop: '5px'}}>✓ Imagen optimizada lista.</small>}
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isCompressing || isUploading}>
                {isUploading ? 'Guardando...' : (editingId ? 'Guardar Cambios' : 'Publicar Entrevista')}
              </button>

              {editingId && (
                <button type="button" className={styles.cancelBtn} onClick={resetForm}>
                  Cancelar Edición
                </button>
              )}
            </form>
          </div>

          {/* COLUMNA DERECHA: LISTA DE ENTREVISTAS */}
          <div className={styles.adminCard}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '20px' }}>
              Inventario de Entrevistas
            </h2>
            
            <div className={styles.listContainer}>
              {isLoadingList ? (
                <p style={{ color: 'var(--text-muted)' }}>Cargando entrevistas...</p>
              ) : interviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No hay entrevistas publicadas aún.</p>
              ) : (
                interviews.map((interview, index) => (
                  <div key={interview.id} className={styles.listItem}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemTitle}>
                        {((page - 1) * itemsPerPage) + index + 1}. {interview.title}
                      </span>
                      <span className={styles.itemMeta}>
                        {new Date(interview.created_at).toLocaleDateString('es-AR', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className={styles.itemActions}>
                      <button 
                        onClick={() => setPreviewId(interview.id)}
                        className={styles.actionBtn} 
                        title="Ver en la web (Modal)"
                        aria-label="Ver"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>

                      <button 
                        onClick={() => handleEditClick(interview)}
                        className={styles.actionBtn} 
                        title="Editar"
                        aria-label="Editar"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(interview.id, interview.title, interview.image_url)}
                        className={`${styles.actionBtn} ${styles.delete}`} 
                        title="Eliminar"
                        aria-label="Eliminar"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Controles de Paginación */}
            {(!isLoadingList && (page > 1 || hasMore)) && (
              <div className={styles.paginationContainer}>
                <button 
                  className={styles.pageBtn} 
                  onClick={handlePrevPage} 
                  disabled={page === 1}
                >
                  Anterior
                </button>
                <span className={styles.pageInfo}>Página {page}</span>
                <button 
                  className={styles.pageBtn} 
                  onClick={handleNextPage} 
                  disabled={!hasMore}
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
