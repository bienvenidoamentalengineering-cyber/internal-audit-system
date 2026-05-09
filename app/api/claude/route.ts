import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/claude
 * Procesa un diagnóstico con Claude API
 */
export async function POST(request: NextRequest) {
  try {
    const { context, prompt, systemPrompt, model } = await request.json();
    console.log('[Claude API] Request received:', { hasContext: !!context, hasPrompt: !!prompt, model });

    if (!context || !prompt) {
      console.error('[Claude API] Missing context or prompt');
      return NextResponse.json(
        { error: 'Missing context or prompt' },
        { status: 400 }
      );
    }

    // Obtener API key de variables de entorno
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('[Claude API] ANTHROPIC_API_KEY not configured');
      return NextResponse.json(
        { error: 'Claude API not configured' },
        { status: 500 }
      );
    }

    const claudeModel = 'claude-3-5-sonnet-20241022';
    console.log('[Claude API] Using model:', claudeModel);

    // Llamar a Claude API con timeout de 30 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let response;
    try {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: claudeModel,
          max_tokens: 1024,
          system: systemPrompt || 'Eres un asistente útil.',
          messages: [
            {
              role: 'user',
              content: `${prompt}\n\nCONTEXTO:\n${context}`,
            },
          ],
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const error = await response.text();
      console.error(`[Claude API] Anthropic error (${response.status}):`, error);
      return NextResponse.json(
        { error: `Claude API error (${response.status}): ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[Claude API] Response received:', { hasContent: !!data.content, contentLength: data.content?.[0]?.text?.length });
    const result = data.content[0].text;
    console.log('[Claude API] Returning result, length:', result.length);

    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Claude API timeout: Request took longer than 30 seconds');
      return NextResponse.json(
        { error: 'Claude API timeout: Request took too long (30s limit)' },
        { status: 504 }
      );
    }
    console.error('[Claude API] Error in Claude endpoint:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[Claude API] Error details:', errorMsg);
    return NextResponse.json(
      { error: `Internal server error: ${errorMsg}` },
      { status: 500 }
    );
  }
}
