import { describe, it, expect } from 'vitest';

describe('Claude API Credentials', () => {
  it('should have ANTHROPIC_API_KEY configured', () => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toMatch(/^sk-ant-/);
  });

  it('should have CLAUDE_MODEL configured', () => {
    const model = process.env.CLAUDE_MODEL;
    expect(model).toBeDefined();
    expect(model).toContain('claude');
  });

  it('should validate Claude API connection', async () => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const model = process.env.CLAUDE_MODEL;

    if (!apiKey || !model) {
      throw new Error('Missing Claude API credentials');
    }

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

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.content).toBeDefined();
    expect(data.content[0].text).toContain('OK');
  });
});
