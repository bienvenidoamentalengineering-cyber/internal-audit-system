export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'check-env') {
      return Response.json({
        success: true,
        env: {
          ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? '✓ Configurada' : '✗ No configurada',
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Configurada' : '✗ No configurada',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Configurada' : '✗ No configurada',
        },
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'test-claude') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return Response.json({
          success: false,
          error: 'ANTHROPIC_API_KEY no está configurada',
        }, { status: 400 });
      }

      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 100,
            messages: [
              {
                role: 'user',
                content: 'Hola',
              },
            ],
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          return Response.json({
            success: false,
            error: `Claude API error: ${response.status}`,
            details: data,
          }, { status: response.status });
        }

        return Response.json({
          success: true,
          message: 'Claude API funciona correctamente',
          response: data,
        });
      } catch (error: any) {
        return Response.json({
          success: false,
          error: `Error conectando a Claude API: ${error.message}`,
        }, { status: 500 });
      }
    }

    return Response.json({
      success: false,
      error: 'Acción no reconocida',
    }, { status: 400 });
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
