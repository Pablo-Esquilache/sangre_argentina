"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  
  // No mostrar el navbar público en las rutas de login o admin
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }
  
  // Detectar si estamos en la página individual de una entrevista
  const isInterviewPage = pathname?.startsWith('/entrevistas/');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?q=${encodeURIComponent(searchTerm.trim())}#entrevistas`);
      closeMenu();
    } else {
      router.push(`/#entrevistas`);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        
        <div className={styles.leftSection}>
          <Link href="/#inicio" className={styles.logoLink} onClick={closeMenu}>
            <Image src="/logo.png" alt="Logo Sangre Argentina" width={55} height={55} className={styles.logoImg} />
          </Link>
          <form className={styles.search} onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Buscar entrevistas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        {isInterviewPage ? (
          <Link href="/#entrevistas" className={styles.backBtnNav}>
            ← Volver
          </Link>
        ) : (
          <>
            {/* Hamburger Icon */}
            <button className={styles.hamburger} onClick={toggleMenu} aria-label="Abrir menú">
              <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <ul className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
              <li><Link href="/#inicio" onClick={closeMenu}>Inicio</Link></li>
              <li><Link href="/#quienes-somos" onClick={closeMenu}>Sangre Argentina</Link></li>
              <li><Link href="/#entrevistas" onClick={closeMenu}>Entrevistas</Link></li>
              <li><Link href="#contacto" onClick={closeMenu}>Contacto</Link></li>
            </ul>
          </>
        )}

      </div>
    </nav>
  );
}
