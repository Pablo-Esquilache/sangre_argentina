"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Detectar si estamos en la página individual de una entrevista
  const isInterviewPage = pathname?.startsWith('/entrevistas/');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        
        <div className={styles.leftSection}>
          <Link href="/#inicio" className={styles.logoLink} onClick={closeMenu}>
            <Image src="/logo.png" alt="Logo Sangre Argentina" width={55} height={55} className={styles.logoImg} />
          </Link>
          <div className={styles.search}>
            <input type="text" placeholder="Buscar entrevistas..." />
          </div>
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
              <li><Link href="/#quienes-somos" onClick={closeMenu}>Quiénes somos</Link></li>
              <li><Link href="/#entrevistas" onClick={closeMenu}>Entrevistas</Link></li>
              <li><Link href="#contacto" onClick={closeMenu}>Contacto</Link></li>
            </ul>
          </>
        )}

      </div>
    </nav>
  );
}
