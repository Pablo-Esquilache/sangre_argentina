"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import styles from '../admin/admin.module.css'; // Reutilizamos los estilos del admin
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [authError, setAuthError] = useState('');
  const [recoveryMsg, setRecoveryMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    setIsLoading(false);
    
    if (error) {
      setAuthError('Credenciales incorrectas');
    } else {
      router.push('/admin'); // Redirigir al dashboard después de loguearse
      router.refresh();
    }
  };

  const handleRecovery = async (e) => {
    e.preventDefault();
    setAuthError('');
    setRecoveryMsg('');
    if (!email) {
      setAuthError('Por favor ingresa tu email primero');
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setIsLoading(false);
    
    if (error) {
      setAuthError('Error al enviar el correo. Verifica tu dirección.');
    } else {
      setRecoveryMsg('Revisa tu bandeja de entrada para restablecer tu contraseña.');
    }
  };

  return (
    <main className={`container ${styles.loginMain}`}>
      <div className={styles.loginCard}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button onClick={() => router.push('/')} className={styles.toggleAuthBtn} style={{ marginTop: 0 }}>
            ← Volver a la Web
          </button>
        </div>
        <h2>Acceso Privado</h2>
        <p>{isRecovering ? 'Ingresa tu email para recuperar' : 'Ingresa tus credenciales para entrar al panel'}</p>

        <form className={styles.form} onSubmit={isRecovering ? handleRecovery : handleLogin}>
          <div className={styles.formGroup}>
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          {!isRecovering && (
            <div className={styles.formGroup}>
              <input 
                type="password" 
                placeholder="Contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          )}
          
          {authError && <p className={styles.errorText}>{authError}</p>}
          {recoveryMsg && <p style={{color: 'green', fontSize: '0.9rem', marginBottom: '10px'}}>{recoveryMsg}</p>}
          
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Cargando...' : (isRecovering ? 'Enviar link de recuperación' : 'Ingresar')}
          </button>
        </form>

        <button 
          className={styles.toggleAuthBtn}
          onClick={() => setIsRecovering(!isRecovering)}
          type="button"
        >
          {isRecovering ? 'Volver al login' : 'Olvidé mi contraseña'}
        </button>
      </div>
    </main>
  );
}
