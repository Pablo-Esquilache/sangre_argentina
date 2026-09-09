import './globals.css';

export const metadata = {
  title: 'Sangre Argentina - Radio',
  description: 'Radio en vivo y entrevistas exclusivas.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
