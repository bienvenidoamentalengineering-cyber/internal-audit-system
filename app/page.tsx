'use client';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0E27',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        maxWidth: '42rem',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        textAlign: 'center',
      }}>
        {/* Logo/Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '0.5rem',
          }}>
            <p style={{
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: '#6B7280',
              fontWeight: '500',
              margin: 0,
              fontStyle: 'italic',
            }}>Mental Engineering™</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h1 style={{
              fontSize: 'clamp(2rem, 10vw, 3.75rem)',
              fontFamily: 'Georgia, serif',
              color: 'white',
              lineHeight: '1.2',
              margin: 0,
            }}>
              Algo no encaja.
            </h1>
            <p style={{
              fontSize: '0.875rem',
              letterSpacing: '0.1em',
              color: '#3B82F6',
              fontWeight: 'bold',
              margin: 0,
            }}>
              UN PROCESO DE 7 DÍAS
            </p>
          </div>
        </div>

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '2rem', paddingBottom: '2rem' }}>
          <p style={{
            fontSize: '1.25rem',
            color: 'white',
            lineHeight: '1.6',
            margin: 0,
          }}>
            7 días para identificar exactamente qué está generando fricción interna — aunque todo funcione externamente.
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            textAlign: 'left',
            backgroundColor: '#050810',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            border: '1px solid rgba(31, 41, 55, 0.5)',
          }}>
            <h2 style={{
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: '#3B82F6',
              fontWeight: 'bold',
              margin: 0,
            }}>CÓMO FUNCIONA</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#6B7280', margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              <li style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ color: '#3B82F6', fontWeight: 'bold', flexShrink: 0 }}>1.</span>
                <span>Responde preguntas precisas cada día</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ color: '#3B82F6', fontWeight: 'bold', flexShrink: 0 }}>2.</span>
                <span>ARC analiza tus respuestas en profundidad</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ color: '#3B82F6', fontWeight: 'bold', flexShrink: 0 }}>3.</span>
                <span>Recibe un diagnóstico clínico y exacto</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '2rem' }}>
          <a
            href="/day/1"
            style={{
              display: 'block',
              width: '100%',
              backgroundColor: '#3B82F6',
              color: 'white',
              fontWeight: '600',
              padding: '1rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              textAlign: 'center',
              cursor: 'pointer',
              border: 'none',
              fontSize: '1rem',
              transition: 'background-color 0.2s',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
            } as React.CSSProperties}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0EA5E9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3B82F6')}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/day/1';
            }}
          >
            Comenzar
          </a>
          <p style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            margin: 0,
          }}>
            Toma aproximadamente 10-15 minutos por día
          </p>
        </div>
      </div>
    </div>
  );
}
