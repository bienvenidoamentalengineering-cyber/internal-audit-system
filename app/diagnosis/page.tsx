'use client';

import { useState, useEffect } from 'react';
import { useDayResponses } from '@/lib/use-day-responses';
import { generateDiagnosis, chatWithARC } from '@/lib/claude-service';
import { saveDiagnosis } from '@/lib/supabase-service';

interface DiagnosisData {
  pattern: string;
  contradiction: string;
  decision: string;
  cost: string;
  alignmentScore: number;
  frictionIndex: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function DiagnosisPage() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAllResponses } = useDayResponses();
  const [diagnosis, setDiagnosis] = useState<DiagnosisData>({
    pattern: 'Sostienes múltiples objetivos que requieren direcciones opuestas, generando fricción constante entre lo que haces y lo que eres.',
    contradiction: 'Buscas libertad pero mantienes estructuras que te limitan. Quieres autenticidad pero sigues justificando decisiones que no te representan.',
    decision: 'Realinear tu vida desde la congruencia interna, no desde la validación externa.',
    cost: 'Psicológico: Agotamiento emocional por disonancia. Energético: Desgaste constante. Integridad: Erosión gradual de tu autoconcepto.',
    alignmentScore: 34,
    frictionIndex: 8.2,
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const generateDiagnosisFromResponses = async () => {
      try {
        const allResponses = getAllResponses();
        if (Object.keys(allResponses).length > 0) {
          const result = await generateDiagnosis(allResponses);
          setDiagnosis(result);
          
          // Guardar diagnóstico en Supabase
          try {
            await saveDiagnosis({
              pattern: result.pattern,
              contradiction: result.contradiction,
              decision: result.decision,
              cost: result.cost,
              alignment_score: result.alignmentScore,
              friction_index: result.frictionIndex,
            });
          } catch (error) {
            console.error('Error saving diagnosis to Supabase:', error);
          }
        }
      } catch (error) {
        setError("No se pudo generar el diagnóstico. Por favor intenta de nuevo.");
        console.error("Error generating diagnosis:", error);
      } finally {
        setGenerating(false);
      }
    };

    generateDiagnosisFromResponses();
  }, [getAllResponses]);

  const handleRequestSession = (e: React.MouseEvent) => {
    e.preventDefault();
    // No hacer nada - dejar que el link se abra normalmente con target="_blank"
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const allResponses = getAllResponses();
      console.log('[Chat] Sending message:', userMessage);
      console.log('[Chat] Responses available:', Object.keys(allResponses).length);
      const response = await chatWithARC(userMessage, allResponses);
      console.log('[Chat] Response received:', response.substring(0, 100));
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('[Chat] Error in chat:', errorMsg);
      setChatMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMsg}` }]);
    } finally {
      setChatLoading(false);
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
            DIAGNÓSTICO FINAL
          </p>
          <h1 style={{
            fontSize: 'clamp(2rem, 8vw, 3rem)',
            fontFamily: 'Georgia, serif',
            color: 'white',
            lineHeight: '1.2',
            margin: 0,
          }}>
            Tu Auditoría Interna
          </h1>
          <p style={{
            fontSize: '0.95rem',
            color: '#9CA3AF',
            lineHeight: '1.6',
            margin: 0,
          }}>
            {generating ? 'Analizando tus respuestas...' : 'Basado en tus respuestas de los 7 días, aquí está lo que hemos detectado.'}
          </p>
        </div>

        {!generating && (
          <>
            {/* Pattern */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
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
                PATRÓN DETECTADO
              </p>
              <p style={{
                fontSize: '1rem',
                color: 'white',
                lineHeight: '1.6',
                margin: 0,
              }}>
                {diagnosis.pattern}
              </p>
            </div>

            {/* Contradiction */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
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
                CONTRADICCIÓN CENTRAL
              </p>
              <p style={{
                fontSize: '1rem',
                color: 'white',
                lineHeight: '1.6',
                margin: 0,
              }}>
                {diagnosis.contradiction}
              </p>
            </div>

            {/* Decision */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
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
                DECISIÓN DETECTADA
              </p>
              <p style={{
                fontSize: '1rem',
                color: 'white',
                lineHeight: '1.6',
                margin: 0,
              }}>
                {diagnosis.decision}
              </p>
            </div>

            {/* Cost */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
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
                COSTE ACUMULADO
              </p>
              <p style={{
                fontSize: '1rem',
                color: 'white',
                lineHeight: '1.6',
                margin: 0,
              }}>
                {diagnosis.cost}
              </p>
            </div>

            {/* Scores */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              backgroundColor: '#050810',
              border: '1px solid #1F2937',
              borderRadius: '0.5rem',
              padding: '1.5rem',
            }}>
              {/* Alignment Score */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <p style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    color: '#3B82F6',
                    fontWeight: 'bold',
                    margin: 0,
                  }}>
                    ALIGNMENT SCORE
                  </p>
                  <p style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: diagnosis.alignmentScore > 50 ? '#10B981' : '#EF4444',
                    margin: 0,
                  }}>
                    {diagnosis.alignmentScore}%
                  </p>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#1F2937',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}>
                  <div
                    style={{
                      backgroundColor: diagnosis.alignmentScore > 50 ? '#10B981' : '#EF4444',
                      height: '8px',
                      width: `${diagnosis.alignmentScore}%`,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  margin: 0,
                }}>
                  Qué tan alineada está tu vida con tus valores reales.
                </p>
              </div>

              {/* Internal Friction Index */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <p style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    color: '#3B82F6',
                    fontWeight: 'bold',
                    margin: 0,
                  }}>
                    INTERNAL FRICTION INDEX
                  </p>
                  <p style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: diagnosis.frictionIndex > 5 ? '#EF4444' : '#10B981',
                    margin: 0,
                  }}>
                    {diagnosis.frictionIndex}/10
                  </p>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#1F2937',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}>
                  <div
                    style={{
                      backgroundColor: diagnosis.frictionIndex > 5 ? '#EF4444' : '#10B981',
                      height: '8px',
                      width: `${(diagnosis.frictionIndex / 10) * 100}%`,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  margin: 0,
                }}>
                  Nivel de disonancia entre lo que haces y lo que eres.
                </p>
              </div>
            </div>

            {/* Chat con ARC */}
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
                EXPLORAR CON ARC
              </p>

              {/* Chat messages */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                maxHeight: '300px',
                overflowY: 'auto',
                paddingBottom: '1rem',
              }}>
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '85%',
                        backgroundColor: msg.role === 'user' ? '#3B82F6' : '#1F2937',
                        color: 'white',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }}>
                    <div
                      style={{
                        backgroundColor: '#1F2937',
                        color: '#6B7280',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.9rem',
                      }}
                    >
                      ARC está pensando...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat input */}
              <form
                onSubmit={handleChatSubmit}
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                }}
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Pregunta a ARC..."
                  disabled={chatLoading}
                  style={{
                    flex: 1,
                    backgroundColor: '#0A0E27',
                    border: '1px solid #1F2937',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  style={{
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    cursor: chatLoading ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    opacity: chatLoading || !chatInput.trim() ? 0.5 : 1,
                  }}
                >
                  Enviar
                </button>
              </form>
            </div>

            {/* CTA */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              paddingTop: '1rem',
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#9CA3AF',
                textAlign: 'center',
                margin: 0,
                lineHeight: '1.5',
              }}>
                Este diagnóstico es el punto de partida. El siguiente paso es transformar esta claridad en acción estructurada.
              </p>
              <a
                href="https://wa.me/34603647173?text=Hola+Pedro+acabo+de+terminar+el+journal+de+7+dias+y+quiero+continuar+el+proceso"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleRequestSession}
                style={{
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
                {loading ? 'Redirigiendo...' : 'Continuar el proceso'}
              </a>
              <a
                href="/"
                style={{
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
                Volver al Inicio
              </a>
            </div>
          </>
        )}

        {generating && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px',
          }}>
            <p style={{
              color: '#6B7280',
              fontSize: '1rem',
            }}>
              Procesando tu auditoría interna...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
