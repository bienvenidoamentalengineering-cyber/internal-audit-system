'use client';

import { useState } from 'react';

export default function DebugPage() {
  const [checkEnvResult, setCheckEnvResult] = useState<any>(null);
  const [testClaudeResult, setTestClaudeResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkEnv = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check-env' }),
      });
      const data = await response.json();
      setCheckEnvResult(data);
    } catch (error: any) {
      setCheckEnvResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testClaude = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-claude' }),
      });
      const data = await response.json();
      setTestClaudeResult(data);
    } catch (error: any) {
      setTestClaudeResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0E27',
      color: 'white',
      padding: '2rem',
      fontFamily: 'monospace',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>🔧 Debug Panel</h1>

        <div style={{ marginTop: '2rem' }}>
          <button
            onClick={checkEnv}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginRight: '1rem',
            }}
          >
            {loading ? 'Cargando...' : 'Verificar Variables de Entorno'}
          </button>

          <button
            onClick={testClaude}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#1C3A5E',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Cargando...' : 'Probar Claude API'}
          </button>
        </div>

        {checkEnvResult && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#1e2022',
            borderRadius: '0.5rem',
            border: '1px solid #1C3A5E',
          }}>
            <h2>Resultado: Variables de Entorno</h2>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {JSON.stringify(checkEnvResult, null, 2)}
            </pre>
          </div>
        )}

        {testClaudeResult && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#1e2022',
            borderRadius: '0.5rem',
            border: '1px solid #1C3A5E',
          }}>
            <h2>Resultado: Test Claude API</h2>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {JSON.stringify(testClaudeResult, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ marginTop: '2rem', color: '#9CA3AF' }}>
          <p>Esta página de debug te ayuda a identificar problemas con las variables de entorno y la conexión a Claude API.</p>
        </div>
      </div>
    </div>
  );
}
