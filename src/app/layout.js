import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair' 
});

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat' 
});

export const metadata = {
  metadataBase: new URL('https://sangre-argentina.netlify.app'),
  title: 'Sangre Argentina | Radio Folclore Nacional',
  description: 'Escucha Sangre Argentina en vivo. El mejor Folclore Nacional, Tango y Cultura con la conducción de Rodrigo Migueles. Lunes a Viernes de 19:00 a 21:00 hs por AM 1250 y FM 98.7.',
  keywords: ['Folclore', 'Radio en vivo', 'Tango', 'Cultura Argentina', 'Rodrigo Migueles', 'AM 1250', 'FM 98.7', 'Música Argentina', 'Sangre Argentina'],
  authors: [{ name: 'Rodrigo Migueles' }],
  creator: 'Rodrigo Migueles',
  publisher: 'Radio Sangre Argentina',
  openGraph: {
    title: 'Sangre Argentina | Folclore Nacional',
    description: 'La voz del folclore y la cultura argentina. Escúchanos en vivo con Rodrigo Migueles.',
    siteName: 'Sangre Argentina Radio',
    images: [
      {
        url: '/logo_og.jpg',
        width: 800,
        height: 800,
        alt: 'Logo Sangre Argentina',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sangre Argentina | Radio Folclore',
    description: 'El mejor Folclore Nacional, Tango y Cultura. En vivo de Lunes a Viernes 19 a 21hs.',
    images: ['/banner_desktop.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${playfair.variable} ${montserrat.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
