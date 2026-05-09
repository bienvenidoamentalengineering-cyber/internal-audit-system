#!/usr/bin/env node

/**
 * Validar credenciales de Claude API
 */

const apiKey = process.env.ANTHROPIC_API_KEY;
const model = process.env.CLAUDE_MODEL;

console.log('🔍 Validando credenciales de Claude API...\n');

if (!apiKey) {
  console.error('❌ Error: ANTHROPIC_API_KEY no está configurada');
  process.exit(1);
}

if (!model) {
  console.error('❌ Error: CLAUDE_MODEL no está configurada');
  process.exit(1);
}

console.log('✓ ANTHROPIC_API_KEY configurada');
console.log('✓ CLAUDE_MODEL configurada:', model);
console.log('');

// Validar conexión a Claude API
async function validateConnection() {
  try {
    console.log('🌐 Validando conexión a Claude API...');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Responde con "OK" solamente.',
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Error en Claude API:', response.status, error);
      process.exit(1);
    }

    const data = await response.json();
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error('❌ Respuesta inválida de Claude API');
      process.exit(1);
    }

    const responseText = data.content[0].text.trim();
    console.log('✓ Conexión exitosa a Claude API');
    console.log('✓ Respuesta:', responseText);
    console.log('');
    console.log('✅ Todas las validaciones pasaron correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error validando conexión:', error.message);
    process.exit(1);
  }
}

validateConnection();
