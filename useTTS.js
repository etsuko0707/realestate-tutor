import { useCallback, useRef, useState } from 'react';

export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef(null);

  const speak = useCallback((text, lang = 'en-US') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.9;
    utter.pitch = 1.0;
    utter.volume = 1.0;

    // 利用可能な声から最適なものを選ぶ
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith(lang.split('-')[0]) && !v.name.includes('Compact'));
    if (preferred) utter.voice = preferred;

    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);

    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis && window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking };
}
