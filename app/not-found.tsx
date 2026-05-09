export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0E27',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      color: 'white',
      textAlign: 'center',
    }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404</h1>
        <p style={{ fontSize: '1rem', color: '#9CA3AF' }}>Página no encontrada</p>
        <a href="/" style={{
          display: 'inline-block',
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#1C3A5E',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.5rem',
        }}>
          Volver al inicio
        </a>
      </div>
    </div>
  );
}
