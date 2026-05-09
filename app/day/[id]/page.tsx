'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDayResponses } from '@/lib/use-day-responses';
import { saveDayResponses as saveToSupabase } from '@/lib/supabase-service';

interface DayContent {
  title: string;
  subtitle: string;
  mainQuestion: string;
  exploration: string[];
  audit: string | string[];
  closure: string[];
}

const DAYS_CONTENT: Record<number, DayContent> = {
  1: {
    title: 'Desalineación Interna',
    subtitle: 'Día 1 de 7',
    mainQuestion: '¿Y si el problema no es la falta de objetivos… sino que los objetivos que sostienes ya no están alineados con quien eres ahora?',
    exploration: [
      '¿Qué área de tu vida genera resultados externos pero produce fricción interna?',
      '¿Qué decisiones sigues defendiendo solo porque en su momento tenían sentido?',
      '¿Qué estructura estás manteniendo por inercia — no por elección activa?',
    ],
    audit: 'Si elimino las expectativas externas, lo que realmente quiero es…',
    closure: [
      'La mayor desalineación que estoy ignorando es…',
      'Lo que sigo sosteniendo aunque ya no encaja es…',
      'El coste psicológico de mantener esto probablemente será…',
    ],
  },
  2: {
    title: 'Funcionando Pero Desconectado',
    subtitle: 'Día 2 de 7',
    mainQuestion: '¿Qué área de tu vida sigue funcionando externamente… pero internamente ya no genera alineación real?',
    exploration: [
      '¿Qué consume la mayor parte de tu energía ahora mismo?',
      '¿Qué es lo que realmente te devuelve energía?',
    ],
    audit: 'El desequilibrio entre lo que drena y lo que alimenta está en…',
    closure: [
      'La mayor desconexión entre mi vida externa e interna está en…',
      'Lo que más energía drena sin que lo admita es…',
      'Lo que sigo justificando constantemente es…',
    ],
  },
  3: {
    title: 'Fricción Cognitiva',
    subtitle: 'Día 3 de 7',
    mainQuestion: '¿Dónde estás diciendo que necesitas más claridad… cuando en realidad ya sabes suficiente para actuar?',
    exploration: [
      '¿Qué decisión llevas demasiado tiempo posponiendo?',
      '¿Qué conversación sigues evitando?',
      '¿Qué área necesita acción — no más análisis?',
    ],
    audit: 'Sé perfectamente que necesito ______ pero sigo retrasándolo porque ______',
    closure: [
      'La decisión que sigo evitando es…',
      'El coste acumulado de no actuar está siendo…',
      'El análisis infinito me está costando…',
    ],
  },
  4: {
    title: 'Pérdida de Señal Interna',
    subtitle: 'Día 4 de 7',
    mainQuestion: '¿Cuándo fue la última vez que tomaste una decisión realmente alineada contigo — y no solo funcional?',
    exploration: [
      '¿Qué señales internas llevas tiempo ignorando?',
      '¿Qué parte de ti has dejado fuera de las decisiones importantes?',
      '¿Qué ya no puedes seguir racionalizando?',
    ],
    audit: 'La última vez que sentí coherencia real entre lo que hacía y lo que era fue cuando…',
    closure: [
      'Llevo tiempo ignorando…',
      'La señal más clara que estoy evitando es…',
      'Si no corrijo dirección, el impacto será…',
    ],
  },
  5: {
    title: 'Agotamiento Estructural',
    subtitle: 'Día 5 de 7',
    mainQuestion: '¿Qué estructura de tu vida sabes que ya no es sostenible… aunque sigas operando dentro de ella?',
    exploration: [
      '¿Qué parte de tu vida requiere demasiado esfuerzo para sostenerse?',
      '¿Qué mantienes por reputación, miedo o compromiso externo?',
      '¿Qué coste psicológico estás normalizando?',
    ],
    audit: 'Lo que sigo sosteniendo aunque me desgaste es…',
    closure: [
      'El área donde más me estoy drenando es…',
      'El coste psicológico que estoy normalizando es…',
      'Seguir así probablemente me llevará a…',
    ],
  },
  6: {
    title: 'Realineación Retrasada',
    subtitle: 'Día 6 de 7',
    mainQuestion: 'Si no tuvieras que justificar tus decisiones ante nadie… ¿qué cambiarías inmediatamente?',
    exploration: [
      '¿Qué harías si el juicio externo no fuera una variable?',
      '¿Qué decisión ya está tomada dentro de ti pero no has ejecutado?',
      '¿Qué sigues retrasando esperando una certeza que no llegará sola?',
    ],
    audit: 'Si eliminara el miedo al juicio, empezaría a…',
    closure: [
      'Ya sé que necesito…',
      'Lo que sigo esperando innecesariamente es…',
      'El siguiente movimiento lógico sería…',
    ],
  },
  7: {
    title: 'Decisión Interna',
    subtitle: 'Día 7 de 7',
    mainQuestion: 'Ahora que has identificado la fricción real… ¿qué ya no estás dispuesto a seguir tolerando?',
    exploration: [
      '¿Qué versión de ti ya no quieres seguir sosteniendo?',
      '¿Qué tendría que pasar para que realmente cambiaras?',
      '¿Qué ocurrirá si dentro de 12 meses todo sigue igual?',
    ],
    audit: 'A partir de ahora, dejo de ______ y empiezo a actuar desde…',
    closure: [
      'La decisión que ya no puedo postergar es…',
      'Lo que necesito proteger a partir de ahora es…',
      'Mi siguiente paso real será…',
    ],
  },
};

export default function DayPage() {
  const params = useParams();
  const dayId = params.id as string;
  const dayNumber = parseInt(dayId, 10);
  
  const day = DAYS_CONTENT[dayNumber] || null;
  const { saveDayResponses, getDayResponses } = useDayResponses();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = getDayResponses(dayNumber);
    if (saved) {
      const flattened: Record<string, string> = {};
      if (saved.mainQuestion) flattened['main-question'] = saved.mainQuestion;
      if (saved.exploration) {
        saved.exploration.forEach((exp, idx) => {
          flattened[`exploration-${idx}`] = exp;
        });
      }
      if (saved.audit) flattened['audit'] = saved.audit;
      if (saved.closure) {
        saved.closure.forEach((cls, idx) => {
          flattened[`closure-${idx}`] = cls;
        });
      }
      setResponses(flattened);
    }
  }, [dayNumber, getDayResponses]);

  if (!day) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0A0E27',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontFamily: 'Georgia, serif', color: 'white', margin: 0 }}>Día no encontrado</h1>
          <a href="/" style={{ color: '#3B82F6', textDecoration: 'none', cursor: 'pointer' }}>
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  const handleResponseChange = (key: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const dayResponses = {
      mainQuestion: responses['main-question'] || '',
      exploration: Array.from({ length: day?.exploration.length || 0 }, (_, i) => responses[`exploration-${i}`] || ''),
      audit: responses['audit'] || '',
      closure: Array.from({ length: day?.closure.length || 0 }, (_, i) => responses[`closure-${i}`] || ''),
    };
    saveDayResponses(dayNumber, dayResponses);
    
    // Guardar en Supabase de forma asíncrona
    saveToSupabase(dayNumber, dayResponses).catch(error => {
      console.error('Error saving to Supabase:', error);
    });
    
    setTimeout(() => {
      if (dayNumber < 7) {
        window.location.href = `/day/${dayNumber + 1}`;
      } else {
        window.location.href = '/diagnosis';
      }
    }, 300);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (dayNumber > 1) {
      window.location.href = `/day/${dayNumber - 1}`;
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0E27',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem 1rem 2rem 1rem',
    }}>
      <div style={{
        maxWidth: '42rem',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}>
        {/* Progress indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '1rem',
          borderBottom: '1px solid #1F2937',
        }}>
          <p style={{
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            color: '#6B7280',
            margin: 0,
          }}>
            {dayNumber} / 7
          </p>
          <div style={{
            width: '120px',
            height: '4px',
            backgroundColor: '#1F2937',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}>
            <div
              style={{
                backgroundColor: '#3B82F6',
                height: '4px',
                width: `${(dayNumber / 7) * 100}%`,
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          borderBottom: '1px solid #1F2937',
          paddingBottom: '1.5rem',
        }}>
          <p style={{
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            color: '#3B82F6',
            fontWeight: 'bold',
            margin: 0,
          }}>
            {day.subtitle}
          </p>
          <h1 style={{
            fontSize: 'clamp(2rem, 8vw, 3rem)',
            fontFamily: 'Georgia, serif',
            color: 'white',
            lineHeight: '1.2',
            margin: 0,
          }}>
            {day.title}
          </h1>
        </div>

        {/* Main Question */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          backgroundColor: '#050810',
          border: '1px solid #1C3A5E',
          borderRadius: '0.5rem',
          padding: '1.5rem',
        }}>
          <p style={{
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            color: '#3B82F6',
            fontWeight: 'bold',
            margin: 0,
          }}>
            PREGUNTA PRINCIPAL
          </p>
          <p style={{
            fontSize: '1.125rem',
            color: 'white',
            lineHeight: '1.6',
            margin: 0,
            fontWeight: '500',
          }}>
            {day.mainQuestion}
          </p>
          <textarea
            value={responses['main-question'] || ''}
            onChange={(e) => handleResponseChange('main-question', e.target.value)}
            placeholder="Tu respuesta..."
            style={{
              width: '100%',
              backgroundColor: '#0A0E27',
              border: '1px solid #1F2937',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              color: 'white',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: '80px',
              boxSizing: 'border-box',
              marginTop: '0.5rem',
            }}
            rows={2}
          />
        </div>

        {/* Exploration */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <p style={{
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            color: '#3B82F6',
            fontWeight: 'bold',
            margin: 0,
          }}>
            EXPLORACIÓN
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {day.exploration.map((question, idx) => (
              <div key={`exp-${idx}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{
                  display: 'block',
                  color: 'white',
                  fontWeight: '500',
                  margin: 0,
                  fontSize: '0.95rem',
                }}>
                  {question}
                </label>
                <textarea
                  value={responses[`exploration-${idx}`] || ''}
                  onChange={(e) => handleResponseChange(`exploration-${idx}`, e.target.value)}
                  placeholder="Tu respuesta..."
                  style={{
                    width: '100%',
                    backgroundColor: '#050810',
                    border: '1px solid #1F2937',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    minHeight: '80px',
                    boxSizing: 'border-box',
                  }}
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Audit */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          backgroundColor: '#050810',
          border: '1px solid #1F2937',
          borderRadius: '0.5rem',
          padding: '1.5rem',
        }}>
          <p style={{
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            color: '#3B82F6',
            fontWeight: 'bold',
            margin: 0,
          }}>
            AUDITORÍA RÁPIDA
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            margin: 0,
          }}>
            Completa sin editar:
          </p>
          <p style={{
            fontSize: '1rem',
            color: 'white',
            margin: 0,
            fontWeight: '500',
          }}>
            {typeof day.audit === 'string' ? day.audit : day.audit.join(' ')}
          </p>
          <textarea
            value={responses['audit'] || ''}
            onChange={(e) => handleResponseChange('audit', e.target.value)}
            placeholder="Completa la frase..."
            style={{
              width: '100%',
              backgroundColor: '#0A0E27',
              border: '1px solid #1F2937',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              color: 'white',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: '80px',
              boxSizing: 'border-box',
            }}
            rows={2}
          />
        </div>

        {/* Closure */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <p style={{
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            color: '#3B82F6',
            fontWeight: 'bold',
            margin: 0,
          }}>
            DIAGNÓSTICO DE CIERRE
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {day.closure.map((prompt, idx) => (
              <div key={`closure-${idx}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{
                  display: 'block',
                  color: 'white',
                  fontWeight: '500',
                  margin: 0,
                  fontSize: '0.95rem',
                }}>
                  {prompt}
                </label>
                <textarea
                  value={responses[`closure-${idx}`] || ''}
                  onChange={(e) => handleResponseChange(`closure-${idx}`, e.target.value)}
                  placeholder="Tu respuesta..."
                  style={{
                    width: '100%',
                    backgroundColor: '#050810',
                    border: '1px solid #1F2937',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    minHeight: '80px',
                    boxSizing: 'border-box',
                  }}
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          paddingTop: '2rem',
          paddingBottom: '1rem',
        }}>
          <a
            href={dayNumber > 1 ? `/day/${dayNumber - 1}` : '/'}
            onClick={handlePrevious}
            style={{
              flex: 1,
              border: '1px solid #1C3A5E',
              color: 'white',
              fontWeight: '600',
              padding: '1rem 1.5rem',
              borderRadius: '0.5rem',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'block',
              textAlign: 'center',
              transition: 'background-color 0.2s',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
            } as React.CSSProperties}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#050810')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Anterior
          </a>
          <a
            href={dayNumber < 7 ? `/day/${dayNumber + 1}` : '/diagnosis'}
            onClick={handleNext}
            style={{
              flex: 1,
              backgroundColor: '#3B82F6',
              color: 'white',
              fontWeight: '600',
              padding: '1rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              opacity: loading ? 0.5 : 1,
              textDecoration: 'none',
              display: 'block',
              textAlign: 'center',
              transition: 'background-color 0.2s',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
            } as React.CSSProperties}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#0EA5E9')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#3B82F6')}
          >
            {loading ? 'Guardando...' : dayNumber === 7 ? 'Ver Diagnóstico' : 'Siguiente'}
          </a>
        </div>
      </div>
    </div>
  );
}
