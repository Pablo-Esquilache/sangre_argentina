import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer id="contacto" className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.info}>
          <h3>Sangre Argentina</h3>
          <p className={styles.quote}>
            &ldquo;Lo que pinta este pincel ni el tiempo lo ha de borrar, ninguno se ha de animar a corregirme la plana, no pinta quien tiene gana sino quien sabe pintar&rdquo;.
          </p>
        </div>
        
        <div className={styles.contactSocials}>
          <h4>Contacto y Redes Sociales</h4>
          <ul className={styles.contactList}>
            <li>
              <a href="https://wa.me/5492357401144" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                WhatsApp
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/sangreargentina92.3?stkn=NHJteWczNTZoN3E3" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                Instagram
              </a>
            </li>
            <li>
              <a href="mailto:rodrigomigueles1@gmail.com" aria-label="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Email
              </a>
            </li>
            <li>
              <a href="https://youtube.com/@rodrigomigueles1904?si=CmwcyKK_DlI4q-sc" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} Sangre Argentina. Todos los derechos reservados. | Desarrollado por Pablo Esquilache</p>
      </div>
    </footer>
  );
}
