"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';
import styles from './admin.module.css';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [optimizedImage, setOptimizedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

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
        maxSizeMB: 0.5, // Mximo 500kb
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      setOptimizedImage(compressedFile);
    } catch (error) {
      console.error('Error optimizando la imagen:', error);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmitInterview = async (e) => {
    e.preventDefault();
    
    if (!optimizedImage) {
      alert('Por favor selecciona y espera a que se optimice la imagen.');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Subir la imagen al bucket 'portadas'
      const fileExt = optimizedImage.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portadas')
        .upload(fileName, optimizedImage);

      if (uploadError) {
        throw new Error('Error subiendo la imagen: ' + uploadError.message);
      }

      // 2. Obtener la URL pblica de la imagen
      const { data: publicUrlData } = supabase.storage
        .from('portadas')
        .getPublicUrl(fileName);
      
      const imageUrl = publicUrlData.publicUrl;

      // 3. Guardar todos los datos en la tabla 'entrevistas'
      const { data: insertData, error: insertError } = await supabase
        .from('entrevistas')
        .insert([
          {
            title: title,
            subtitle: subtitle,
            youtube_url: url,
            description: description,
            image_url: imageUrl,
          }
        ]);

      if (insertError) {
        throw new Error('Error guardando los datos en la base de datos: ' + insertError.message);
      }

      alert('Entrevista publicada con Ǹxito!');
      
      // Limpiar el formulario
      setTitle('');
      setSubtitle('');
      setUrl('');
      setDescription('');
      setOptimizedImage(null);
      document.getElementById('image').value = '';
      
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className={`container ${styles.adminMain}`}>
      <div className={styles.adminCard}>
        <div className={styles.adminHeader}>
          <h2>Panel de Administracin</h2>
          <button onClick={handleLogout} className={styles.logoutBtn}>Cerrar Sesin</button>
        </div>
        <p>Sube una nueva entrevista</p>

        <form className={styles.form} onSubmit={handleSubmitInterview}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Ttulo</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Especial Folklore Vivo" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subtitle">Subttulo</label>
            <input type="text" id="subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Ej: Con Los Nocheros" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="url">URL del video de YouTube</label>
            <input type="url" id="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="desc">Descripcin detallada</label>
            <textarea id="desc" rows="4" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe la entrevista..." required></textarea>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Miniatura/portada {isCompressing && "(Optimizando... ?)"}</label>
            <input 
              type="file" 
              id="image" 
              accept="image/*" 
              onChange={handleImageChange}
              required 
            />
            {optimizedImage && <small style={{color: 'var(--primary)', marginTop: '5px'}}>o. Imagen optimizada lista para subir.</small>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isCompressing || isUploading}>
            {isUploading ? 'Subiendo entrevista a la nube...' : (isCompressing ? 'Procesando...' : 'Publicar Entrevista')}
          </button>
        </form>
      </div>
    </main>
  );
}
