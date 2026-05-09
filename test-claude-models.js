#!/usr/bin/env node

const apiKey = process.env.ANTHROPIC_API_KEY;

const models = [
  'claude-3-5-sonnet-20241022',
  'claude-3-opus-20250219',
  'claude-3-sonnet-20250229',
  'claude-opus-4-1-20250805',
  'claude-sonnet-4-20250514',
  'claude-3-haiku-20240307',
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
];

async function testModel(model) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 50,
        messages: [
          {
            role: 'user',
            content: 'OK',
          },
        ],
      }),
    });

    if (response.ok) {
      console.log(`✅ ${model} — DISPONIBLE`);
      return true;
    } else {
      const error = await response.json();
      console.log(`❌ ${model} — ${error.error?.message || 'Error desconocido'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${model} — ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Probando modelos disponibles en Claude API...\n');
  
  let found = false;
  for (const model of models) {
    if (await testModel(model)) {
      found = true;
    }
  }
  
  if (!found) {
    console.log('\n⚠️  No se encontraron modelos disponibles.');
  }
}

main();
