'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{
        minHeight: '100vh',
        backgroundColor: '#0A0E27',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Error</h1>
          <p style={{ fontSize: '1rem', color: '#9CA3AF', marginBottom: '2rem' }}>
            Algo salió mal. Por favor intenta de nuevo.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#1C3A5E',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
