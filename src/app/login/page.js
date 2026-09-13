"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';
import styles from '../admin/admin.module.css'; // Reutilizamos los estilos del admin
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [recoveryMsg, setRecoveryMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Escuchar cambios de estado de autenticación (ej: cuando vuelve del link del correo)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsUpdatingPassword(true);
      }
    });
    
    // Checkear si la URL trae un hash indicando recovery (por si falla el evento)
    if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
      setIsUpdatingPassword(true);
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

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
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setIsLoading(false);
    
    if (error) {
      setAuthError('Error al enviar el correo. Verifica tu dirección.');
    } else {
      setRecoveryMsg('Revisa tu bandeja de entrada para restablecer tu contraseña.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setAuthError('');
    setRecoveryMsg('');
    
    if (password.length < 6) {
      setAuthError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password: password });
    setIsLoading(false);
    
    if (error) {
      setAuthError('Error al actualizar la contraseña: ' + error.message);
    } else {
      setRecoveryMsg('Contraseña actualizada con éxito. Redirigiendo al panel...');
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 2000);
    }
  };

  if (isUpdatingPassword) {
    return (
      <main className={`container ${styles.loginMain}`}>
        <div className={styles.loginCard}>
          <h2>Restablecer Contraseña</h2>
          <p>Ingresa tu nueva contraseña para acceder al panel.</p>

          <form className={styles.form} onSubmit={handleUpdatePassword}>
            <div className={styles.formGroup}>
              <input 
                type="password" 
                placeholder="Nueva Contraseña (mín. 6 caracteres)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            {authError && <p className={styles.errorText}>{authError}</p>}
            {recoveryMsg && <p style={{color: 'green', fontSize: '0.9rem', marginBottom: '10px'}}>{recoveryMsg}</p>}
            
            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? 'Actualizando...' : 'Guardar y Entrar'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className={`container ${styles.loginMain}`}>
      <div className={styles.loginCard}>
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
