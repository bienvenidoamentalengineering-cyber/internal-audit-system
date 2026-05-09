#!/usr/bin/env node

/**
 * Validar credenciales de Supabase
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Validando credenciales de Supabase...\n');

if (!supabaseUrl) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL no está configurada');
  process.exit(1);
}

if (!supabaseKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY no está configurada');
  process.exit(1);
}

console.log('✓ NEXT_PUBLIC_SUPABASE_URL configurada');
console.log('✓ NEXT_PUBLIC_SUPABASE_ANON_KEY configurada');
console.log('');

// Validar conexión a Supabase
async function validateConnection() {
  try {
    console.log('🌐 Validando conexión a Supabase...');
    
    // Intentar consultar una tabla (puede no existir, pero validamos la conexión)
    const response = await fetch(`${supabaseUrl}arc_sessions?limit=1`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401 || response.status === 403) {
      console.error('❌ Error: Credenciales inválidas o sin permisos');
      process.exit(1);
    }

    if (response.status === 404) {
      console.log('✓ Conexión exitosa a Supabase');
      console.log('⚠️  Tabla arc_sessions no existe (esto es normal, se creará después)');
      console.log('');
      console.log('✅ Credenciales de Supabase validadas correctamente');
      process.exit(0);
    }

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Error en Supabase:', response.status, error);
      process.exit(1);
    }

    console.log('✓ Conexión exitosa a Supabase');
    console.log('✓ Tabla arc_sessions accesible');
    console.log('');
    console.log('✅ Todas las validaciones pasaron correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error validando conexión:', error.message);
    process.exit(1);
  }
}

validateConnection();
