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
  title: 'Sangre Argentina - Radio',
  description: 'Radio en vivo y entrevistas exclusivas.',
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
