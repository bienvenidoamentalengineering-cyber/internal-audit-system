/**
 * Claude Service - ARC (Auditoría Existencial para Altos Performers)
 * Sistema privado de diagnóstico y exploración existencial
 */

interface UserResponses {
  mainQuestion?: string;
  exploration?: string[];
  audit?: string;
  closure?: string[];
}

interface DiagnosisResult {
  pattern: string;
  contradiction: string;
  decision: string;
  cost: string;
  alignmentScore: number;
  frictionIndex: number;
}

const ARC_SYSTEM_PROMPT = `Eres ARC. Un sistema de reflexión estratégica interna.
Hablas como Pedro Jordà — directo, sobrio, sin teoría.

REGLAS ABSOLUTAS:
- Máximo 2-3 líneas por respuesta
- Solo UNA pregunta por respuesta
- NUNCA expliques tu análisis
- NUNCA menciones VAK, kinestésico, visual, auditivo
- NUNCA digas "patrón", "diagnóstico", "canal dominante"
- NUNCA uses términos técnicos
- NUNCA hagas más de una pregunta
- NUNCA des consejos ni soluciones

TU ÚNICO OBJETIVO:
Hacer la pregunta que el usuario no se ha hecho todavía.
La pregunta más simple y más incómoda.

EJEMPLOS:
Usuario: "tengo que tomar una decisión ya"
ARC: "¿Qué decisión?"

Usuario: "estoy agotado física y mentalmente"
ARC: "¿Desde cuándo lo sabes y no haces nada?"

Usuario: "ya no puedo más la verdad"
ARC: "¿Qué es lo que no puedes seguir sosteniendo?"

Nunca resuelves. Solo abres.`;

/**
 * Genera un diagnóstico completo basado en las respuestas del usuario
 */
export async function generateDiagnosis(
  dayResponses: Record<number, UserResponses>
): Promise<DiagnosisResult> {
  try {
    const context = compileDayResponses(dayResponses);

    // Timeout de 35 segundos para la llamada fetch (30s del servidor + margen)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    let response;
    try {
      response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context,
          systemPrompt: ARC_SYSTEM_PROMPT,
          prompt: DIAGNOSIS_PROMPT,
          model: 'claude-opus-4-1-20250805',
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(`Claude API error (${response.status}): ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    return parseClaudeResponse(data.result);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error generating diagnosis:', errorMsg);
    return getDefaultDiagnosis();
  }
}

/**
 * Chat con ARC para explorar más profundamente
 */
export async function chatWithARC(
  userMessage: string,
  dayResponses: Record<number, UserResponses>
): Promise<string> {
  try {
    const context = compileDayResponses(dayResponses);

    // Timeout de 35 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    let response;
    try {
      response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context,
          systemPrompt: ARC_SYSTEM_PROMPT,
          prompt: `El usuario pregunta: "${userMessage}"

Responde máximo 3 líneas. Nunca resuelves — solo profundizas. Haz preguntas o señala contradicciones.`,
          model: 'claude-opus-4-1-20250805',
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(`Claude API error (${response.status}): ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    // El endpoint retorna { result: string }
    const result = data.result;
    if (!result) {
      throw new Error('No response from Claude API');
    }
    return result;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in chat with ARC:', errorMsg);
    return 'Hubo un error procesando tu pregunta. Intenta de nuevo.';
  }
}

/**
 * Compila todas las respuestas de los 7 días en un contexto coherente
 */
function compileDayResponses(dayResponses: Record<number, UserResponses>): string {
  let context = 'RESPUESTAS DEL USUARIO A LO LARGO DE 7 DÍAS DE AUDITORÍA INTERNA:\n\n';

  for (let day = 1; day <= 7; day++) {
    const responses = dayResponses[day];
    if (!responses) continue;

    context += `DÍA ${day}:\n`;
    if (responses.mainQuestion) {
      context += `- Pregunta Principal: ${responses.mainQuestion}\n`;
    }
    if (responses.exploration && responses.exploration.length > 0) {
      const explorations = responses.exploration
        .filter(e => e && e.trim())
        .join(' | ');
      if (explorations) context += `- Exploración: ${explorations}\n`;
    }
    if (responses.audit) {
      context += `- Auditoría: ${responses.audit}\n`;
    }
    if (responses.closure && responses.closure.length > 0) {
      const closures = responses.closure
        .filter(c => c && c.trim())
        .join(' | ');
      if (closures) context += `- Cierre: ${closures}\n`;
    }
    context += '\n';
  }

  return context;
}

/**
 * Parsea la respuesta de Claude en formato DiagnosisResult
 */
function parseClaudeResponse(response: string): DiagnosisResult {
  try {
    const parsed = JSON.parse(response);
    return {
      pattern: parsed.pattern || '',
      contradiction: parsed.contradiction || '',
      decision: parsed.decision || '',
      cost: parsed.cost || '',
      alignmentScore: Math.min(100, Math.max(0, parsed.alignmentScore || 50)),
      frictionIndex: Math.min(10, Math.max(0, parsed.frictionIndex || 5)),
    };
  } catch {
    return getDefaultDiagnosis();
  }
}

/**
 * Retorna un diagnóstico por defecto
 */
function getDefaultDiagnosis(): DiagnosisResult {
  return {
    pattern: 'Sostienes múltiples objetivos que requieren direcciones opuestas, generando fricción constante entre lo que haces y lo que eres.',
    contradiction: 'Buscas libertad pero mantienes estructuras que te limitan. Quieres autenticidad pero sigues justificando decisiones que no te representan.',
    decision: 'Realinear tu vida desde la congruencia interna, no desde la validación externa.',
    cost: 'Psicológico: Agotamiento emocional por disonancia. Energético: Desgaste constante. Integridad: Erosión gradual de tu autoconcepto.',
    alignmentScore: 34,
    frictionIndex: 8.2,
  };
}

/**
 * Prompt para generar diagnóstico
 */
const DIAGNOSIS_PROMPT = `Analiza las respuestas del usuario y genera un diagnóstico en JSON con esta estructura exacta:
{
  "pattern": "Descripción del patrón central detectado (máx 3 líneas)",
  "contradiction": "La contradicción central (máx 3 líneas, desde palabras exactas del usuario)",
  "decision": "La decisión que lleva 7 días sin ejecutarse (máx 1 línea)",
  "cost": "Coste acumulado: psicológico + energético + integridad (máx 3 líneas)",
  "alignmentScore": número 0-100,
  "frictionIndex": número 0-10
}

IMPORTANTE:
- Construye el diagnóstico desde las palabras exactas del usuario
- Sé clínico y preciso, nunca motivacional
- Identifica patrones VAK, generalizaciones, verbos modales, identidad limitante
- Detecta nivel de conciencia (0-3), dolor (leve-sistémico), apertura (resistente-listo)
- Retorna SOLO JSON válido, sin explicaciones adicionales`;
