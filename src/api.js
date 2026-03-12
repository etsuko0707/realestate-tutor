// サーバー側のAPIルート経由で呼び出す（ブラウザからAPIキーを隠蔽）
async function callClaude(systemPrompt, userPrompt) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error('HTTP ' + res.status + ': ' + (err?.error?.message || JSON.stringify(err)));
  }

  const data = await res.json();
  return data.content[0].text;
}

export async function getTutorResponse(lang, history, userText) {
  const isEnglish = lang === 'english';

  const systemPrompt =
    'You are a real estate language coach for Japanese entrepreneurs. ' +
    'Always respond with a valid JSON object only. No markdown, no explanation text before or after — just the raw JSON.';

  const userPrompt =
    'Conversation so far:\n' + history + '\n\n' +
    'Student said: ' + userText + '\n\n' +
    (isEnglish
      ? 'Reply as a business English real estate coach. Use natural, professional English.'
      : 'Reply as a Thai real estate coach. Use Thai script with romanization in parentheses.') +
    '\n\nReturn exactly this JSON (fill in real values, no placeholder text):\n' +
    JSON.stringify({
      tutorResponse: 'your reply',
      japaneseTranslation: 'Japanese translation',
      feedback: {
        positive: 'what student did well (Japanese)',
        correction: 'correction if needed, else empty string',
        tip: 'one real estate business tip (Japanese)',
      },
      suggestedVocab: 'one useful word',
      accuracy: 80,
    });

  const rawText = await callClaude(systemPrompt, userPrompt);
  const match = rawText.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in response');
  return JSON.parse(match[0]);
}
