import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import styles from './page.module.css';

import RadioPlayer from '../../components/RadioPlayer/RadioPlayer';

export const revalidate = 0; // Refrescar siempre los datos nuevos

export default async function Home() {
  // Traer máximo 12 entrevistas reales de Supabase
  const { data: entrevistas, error } = await supabase
    .from('entrevistas')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12);

  const entrevistasList = entrevistas || [];

  return (
    <main className={styles.main}>
      
      {/* SECCIÓN 1: PORTADA Y RADIO (100vh) */}
      <section id="inicio" className={styles.sectionPortada}>
        <div className={styles.portadaContainer}>
          {/* Izquierda (20%): Iframe Radio */}
          <div className={styles.radioWrapper}>
            <RadioPlayer />
          </div>
          
          {/* Derecha (80%): Banner */}
          <div className={styles.bannerWrapper}>
             {/* La imagen generada por IA se mostrará como fondo mediante CSS */}
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: QUIÉNES SOMOS */}
      <section id="quienes-somos" className={styles.quienesSomosSection}>
        <div className={styles.sectionHeader}>
          <h2>Quiénes Somos</h2>
        </div>

        <div className={styles.aboutContainer}>
          {/* Fila 1: Info de la Radio */}
          <div className={styles.aboutRow}>
            <div className={styles.aboutImageWrapper}>
              <Image 
                src="/info_radio.jpg" 
                alt="Información Sangre Argentina" 
                width={500} 
                height={500} 
                className={styles.aboutImage}
              />
            </div>
            <div className={styles.aboutTextWrapper}>
              <p>
                Sangre Argentina es un programa de radio nacido en Carlos Tejedor, provincia de Buenos Aires, con la misión fundamental de conectar con todas aquellas personas que aman nuestras tradiciones más profundas. Nuestra propuesta está centrada en la difusión del folclore nacional, el tango y el teatro, ofreciendo a nuestra audiencia actualidad detallada todos los días y un espacio dedicado a las efemérides de los artistas que representan la cultura de nuestro país.
              </p>
              <p>
                Nos enorgullece ser un proyecto declarado de interés cultural, que trabaja respetando el acervo popular y la idiosincrasia de todo nuestro territorio nacional.
              </p>
            </div>
          </div>

          {/* Fila 2: Rodrigo Migueles (Invertido) */}
          <div className={`${styles.aboutRow} ${styles.reverseRow}`}>
            <div className={styles.aboutImageWrapper}>
              <Image 
                src="/rodrigo.jpg" 
                alt="Rodrigo Migueles" 
                width={400} 
                height={400} 
                className={styles.rodrigoImage}
              />
            </div>
            <div className={styles.aboutTextWrapper}>
              <p>
                Este espacio es impulsado por la pasión de Rodrigo Migueles, un joven folklorista, presentador del cancionero popular y oriundo de Carlos Tejedor, quien ejerce como creador, locutor y conductor del ciclo. A través de nuestro programa, que se transmite de 19:00 a 21:00 hs, buscamos no solo entretener sino también preservar y enriquecer nuestro patrimonio cultural.
              </p>
              <p>
                Hasta la fecha, hemos realizado más de 300 entrevistas a diversas personalidades, consolidando a Sangre Argentina como un referente en la divulgación de las voces y las historias que definen nuestra identidad nacional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: ENTREVISTAS (100vh) */}
      <section id="entrevistas" className={styles.entrevistasSection}>
        <div className={styles.sectionHeader}>
          <h2>Entrevistas</h2>
        </div>
        <div className={styles.entrevistasContainer}>
          
          <div className={styles.gridWrapper}>
            <div className={styles.gridScroll}>
              <div className={styles.grid}>
                
                {entrevistasList.length === 0 ? (
                  <p style={{color: 'white', textAlign: 'center', gridColumn: '1 / -1', padding: '40px'}}>
                    Aún no hay entrevistas publicadas.
                  </p>
                ) : (
                  entrevistasList.map((interview) => (
                    <Link href={`/entrevistas/${interview.id}`} key={interview.id} className={styles.card}>
                      <div className={styles.thumbnailContainer}>
                        <img 
                          src={interview.image_url} 
                          alt={interview.title}
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
            
            {/* Si hay 12, es muy probable que haya más en la base de datos, mostramos botón */}
            {entrevistasList.length === 12 && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link href="/entrevistas" className={styles.loadMoreBtn}>
                  Ver más entrevistas
                </Link>
              </div>
            )}
            
          </div>
        </div>
      </section>

    </main>
  );
}
