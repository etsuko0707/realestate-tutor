import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Target, MessageSquare, CheckCircle, Languages,
  BookMarked, Plus, X, ChevronRight, Building2, Star,
  RotateCcw, Volume2, VolumeX, TrendingUp, BookOpen, Settings
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocalStorage } from './useStorage';
import { useTTS } from './useTTS';
import { getTutorResponse } from './api';
import {
  LANGUAGES, DEFAULT_VOCAB, DEFAULT_GOALS, QUICK_PHRASES,
  CATEGORY_COLORS, ALL_CATEGORIES
} from './constants';

// ─── helpers ────────────────────────────────────────────────────────────────

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ─── sub-components ─────────────────────────────────────────────────────────

function SpeakButton({ text, lang, speak, stop, speaking, small }) {
  const ttsLang = LANGUAGES[lang]?.ttsLang || 'en-US';
  const size = small ? 13 : 15;
  return (
    <button
      onClick={() => speaking ? stop() : speak(text, ttsLang)}
      className={`flex items-center justify-center rounded-full transition-all ${
        speaking
          ? 'text-amber-400 animate-pulse'
          : 'text-slate-500 hover:text-amber-400'
      } ${small ? 'p-1' : 'p-1.5'}`}
      title="音声読み上げ"
    >
      {speaking ? <VolumeX size={size} /> : <Volume2 size={size} />}
    </button>
  );
}

// ─── Chat Tab ────────────────────────────────────────────────────────────────

function ChatTab({ lang, messages, input, setInput, loading, sendMessage, feedback, showTranslation, toggleTranslation, speak, stop, speaking, bottomRef }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {messages.map(m => (
          <div key={m.id} className={`flex fade-in ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'tutor' && (
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-base mr-2 flex-shrink-0 mt-1 shadow-lg shadow-amber-500/20">
                {LANGUAGES[lang].flag}
              </div>
            )}
            <div className="max-w-[78vw] md:max-w-md">
              <div
                onClick={m.sender === 'tutor' ? () => toggleTranslation(m.id) : undefined}
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed select-none transition-all ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-slate-900 font-medium rounded-br-none'
                    : 'bg-slate-800/90 border border-slate-700/60 text-slate-100 rounded-bl-none cursor-pointer hover:border-amber-500/40 backdrop-blur-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
                {m.sender === 'tutor' && showTranslation[m.id] && m.translation && (
                  <p className="mt-2 pt-2 border-t border-slate-600/60 text-xs text-amber-400/90 flex items-center gap-1">
                    <Languages size={11} /> {m.translation}
                  </p>
                )}
                {m.sender === 'tutor' && m.suggestedVocab && (
                  <p className="mt-1.5 text-xs text-slate-500">
                    📌 <span className="text-amber-400 font-medium">{m.suggestedVocab}</span>
                  </p>
                )}
                {m.sender === 'tutor' && !showTranslation[m.id] && (
                  <p className="text-xs mt-1 text-slate-600">タップで日本語訳</p>
                )}
              </div>
              {m.sender === 'tutor' && (
                <div className="flex items-center mt-1 ml-1">
                  <SpeakButton text={m.text} lang={lang} speak={speak} stop={stop} speaking={speaking} small />
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 ml-10">
            <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl px-4 py-3 flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-amber-400 rounded-full"
                  style={{ animation: 'bounce 0.8s ease infinite', animationDelay: i * 0.15 + 's' }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* feedback bar */}
      {feedback && (
        <div className="border-t border-slate-800 bg-slate-900/60 px-3 py-2 flex gap-2 flex-wrap backdrop-blur-sm">
          {feedback.positive && (
            <span className="text-xs bg-emerald-900/40 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-800/50">
              ✅ {feedback.positive}
            </span>
          )}
          {feedback.correction && (
            <span className="text-xs bg-orange-900/40 text-orange-400 px-2.5 py-1 rounded-full border border-orange-800/50">
              📝 {feedback.correction}
            </span>
          )}
          {feedback.tip && (
            <span className="text-xs bg-blue-900/40 text-blue-400 px-2.5 py-1 rounded-full border border-blue-800/50">
              💡 {feedback.tip}
            </span>
          )}
        </div>
      )}

      {/* quick phrases */}
      <div className="border-t border-slate-800/80 px-3 py-2 flex gap-2 overflow-x-auto">
        {QUICK_PHRASES[lang].map(phrase => (
          <button
            key={phrase}
            onClick={() => setInput(phrase)}
            className="text-xs bg-slate-800/70 hover:bg-slate-700 border border-slate-700/60 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 px-3 py-1.5 rounded-full whitespace-nowrap transition-all flex-shrink-0"
          >
            {phrase}
          </button>
        ))}
      </div>

      {/* input */}
      <div className="bg-slate-900/80 border-t border-slate-800 px-3 py-3 backdrop-blur-sm" style={{paddingBottom: 'max(12px, env(safe-area-inset-bottom))'}}>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            onFocus={() => setTimeout(() => bottomRef.current?.scrollIntoView({behavior:'smooth'}), 400)}
            placeholder={`${LANGUAGES[lang].nativeName}で入力...`}
            className="flex-1 px-4 py-2.5 bg-slate-800/80 border border-slate-700/60 rounded-full text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/70 focus:border-transparent"
            disabled={loading}
            style={{fontSize: '16px'}}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-amber-500 text-slate-900 rounded-full p-2.5 hover:bg-amber-400 active:scale-95 disabled:opacity-40 transition-all shadow-lg shadow-amber-500/20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Vocab Tab ───────────────────────────────────────────────────────────────

function VocabTab({ lang, vocabList, setVocabList, speak, stop, speaking }) {
  const [category, setCategory] = useState('すべて');
  const [quizMode, setQuizMode] = useState(false);
  const [quizCard, setQuizCard] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newWord, setNewWord] = useState({ word: '', reading: '', meaning: '', example: '', category: '投資' });

  const filtered = vocabList[lang].filter(v => category === 'すべて' || v.category === category);

  const startQuiz = () => {
    const list = filtered.length > 0 ? filtered : vocabList[lang];
    setQuizCard(list[Math.floor(Math.random() * list.length)]);
    setFlipped(false);
    setQuizMode(true);
  };

  const nextCard = () => {
    const list = filtered.length > 0 ? filtered : vocabList[lang];
    const next = list[Math.floor(Math.random() * list.length)];
    setQuizCard(next);
    setFlipped(false);
    // increment learnCount
    setVocabList(p => ({
      ...p,
      [lang]: p[lang].map(v => v.id === (quizCard?.id) ? { ...v, learnCount: (v.learnCount || 0) + 1 } : v)
    }));
  };

  const toggleStar = id => setVocabList(p => ({
    ...p, [lang]: p[lang].map(v => v.id === id ? { ...v, starred: !v.starred } : v)
  }));
  const removeVocab = id => setVocabList(p => ({ ...p, [lang]: p[lang].filter(v => v.id !== id) }));
  const addVocab = () => {
    if (!newWord.word || !newWord.meaning) return;
    setVocabList(p => ({ ...p, [lang]: [...p[lang], { ...newWord, id: Date.now(), starred: false, learnCount: 0 }] }));
    setNewWord({ word: '', reading: '', meaning: '', example: '', category: '投資' });
    setShowAdd(false);
  };

  if (quizMode) return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-lg mx-auto mt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-amber-400">フラッシュカード</h2>
          <button onClick={() => setQuizMode(false)} className="flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors">
            <X size={15} /> 終了
          </button>
        </div>
        {quizCard && (
          <div
            onClick={() => setFlipped(p => !p)}
            className="bg-slate-800/80 border border-slate-700/60 hover:border-amber-500/40 rounded-3xl p-10 text-center cursor-pointer transition-all min-h-56 flex flex-col items-center justify-center gap-4 backdrop-blur-sm shadow-2xl fade-in"
          >
            <span className={`text-xs px-2.5 py-0.5 rounded-full border ${CATEGORY_COLORS[quizCard.category] || 'bg-slate-700 text-slate-400 border-slate-600'}`}>
              {quizCard.category}
            </span>
            <p className="text-3xl font-bold text-white">{quizCard.word}</p>
            {!flipped ? (
              <p className="text-slate-500 text-sm">タップして意味を確認</p>
            ) : (
              <div className="space-y-2 fade-in">
                <p className="text-amber-400 text-xl font-semibold">{quizCard.meaning}</p>
                {quizCard.reading && <p className="text-slate-400 text-sm">読み: {quizCard.reading}</p>}
                {quizCard.example && (
                  <p className="text-slate-500 text-xs italic border-t border-slate-700/60 pt-3 mt-2">
                    "{quizCard.example}"
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        <div className="flex gap-3 mt-6 justify-center">
          <SpeakButton text={quizCard?.word || ''} lang={lang} speak={speak} stop={stop} speaking={speaking} />
          <button
            onClick={nextCard}
            className="flex items-center gap-2 bg-amber-500 text-slate-900 font-semibold px-6 py-3 rounded-full hover:bg-amber-400 active:scale-95 transition-all"
          >
            次のカード <ChevronRight size={18} />
          </button>
          <button onClick={() => setFlipped(false)} className="bg-slate-700 text-white px-4 py-3 rounded-full hover:bg-slate-600 transition-colors">
            <RotateCcw size={16} />
          </button>
        </div>
        <p className="text-center text-slate-600 text-xs mt-4">
          学習済み: {vocabList[lang].reduce((s, v) => s + (v.learnCount || 0), 0)} 回
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-safe">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">不動産単語帳</h2>
          <p className="text-slate-500 text-xs mt-0.5">{LANGUAGES[lang].flag} {vocabList[lang].length}語</p>
        </div>
        <div className="flex gap-2">
          <button onClick={startQuiz} className="flex items-center gap-1.5 bg-amber-500 text-slate-900 font-semibold text-sm px-4 py-2 rounded-full hover:bg-amber-400 active:scale-95 transition-all">
            <BookOpen size={14} /> クイズ
          </button>
          <button onClick={() => setShowAdd(p => !p)} className="flex items-center gap-1.5 bg-slate-700 text-white text-sm px-4 py-2 rounded-full hover:bg-slate-600 transition-colors">
            <Plus size={14} /> 追加
          </button>
        </div>
      </div>

      {/* add form */}
      {showAdd && (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 mb-4 backdrop-blur-sm fade-in">
          <p className="text-sm font-semibold text-amber-400 mb-3">新しい単語を追加</p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {[['word','単語 *'],['reading','読み方'],['meaning','意味 *']].map(([k, ph]) => (
              <input key={k} value={newWord[k]} onChange={e => setNewWord(p => ({ ...p, [k]: e.target.value }))} placeholder={ph}
                className="bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500" />
            ))}
            <select value={newWord.category} onChange={e => setNewWord(p => ({ ...p, category: e.target.value }))}
              className="bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500">
              {['投資','取引','管理','基本','物件','開発'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <input value={newWord.example} onChange={e => setNewWord(p => ({ ...p, example: e.target.value }))} placeholder="例文（任意）"
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 mb-3" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAdd(false)} className="text-sm text-slate-400 px-3 py-1.5 hover:text-white">キャンセル</button>
            <button onClick={addVocab} className="bg-amber-500 text-slate-900 font-semibold text-sm px-4 py-1.5 rounded-full hover:bg-amber-400">追加する</button>
          </div>
        </div>
      )}

      {/* category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {ALL_CATEGORIES.filter(c => c === 'すべて' || vocabList[lang].some(v => v.category === c)).map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
              category === c ? 'bg-amber-500 text-slate-900 font-semibold' : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60'
            }`}>
            {c}
          </button>
        ))}
      </div>

      {/* vocab list */}
      <div className="space-y-2">
        {filtered.map(v => (
          <div key={v.id} className="bg-slate-800/70 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-3.5 transition-all backdrop-blur-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-bold">{v.word}</span>
                  {v.reading && <span className="text-slate-500 text-xs font-mono">({v.reading})</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[v.category] || 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                    {v.category}
                  </span>
                  {v.learnCount > 0 && (
                    <span className="text-xs text-slate-600">×{v.learnCount}</span>
                  )}
                </div>
                <p className="text-amber-400 text-sm mt-1 font-medium">{v.meaning}</p>
                {v.example && <p className="text-slate-500 text-xs mt-1 italic">"{v.example}"</p>}
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <SpeakButton text={v.word} lang={lang} speak={speak} stop={stop} speaking={speaking} small />
                <button onClick={() => toggleStar(v.id)} className={`p-1.5 rounded-lg transition-all ${v.starred ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}>
                  <Star size={14} fill={v.starred ? 'currentColor' : 'none'} />
                </button>
                <button onClick={() => removeVocab(v.id)} className="p-1.5 rounded-lg text-slate-700 hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stats Tab ───────────────────────────────────────────────────────────────

function StatsTab({ lang, goals, setGoals, history }) {
  const chartData = history.map((h, i) => ({ day: i === history.length - 1 ? '今日' : -( history.length - 1 - i) + '日前', accuracy: h.accuracy, messages: h.messages }));

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-safe space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">学習サマリー</h2>
        <p className="text-slate-500 text-sm">{LANGUAGES[lang].flag} 不動産ビジネス習熟度</p>
      </div>

      {/* accuracy chart */}
      {history.length > 1 && (
        <div className="bg-slate-800/70 border border-slate-700/50 rounded-2xl p-4 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <TrendingUp size={15} className="text-amber-400" /> 精度の推移
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#94a3b8' }} itemStyle={{ color: '#f59e0b' }} />
              <Area type="monotone" dataKey="accuracy" stroke="#f59e0b" strokeWidth={2} fill="url(#grad)" dot={{ fill: '#f59e0b', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* goals */}
      <div className="bg-slate-800/70 border border-slate-700/50 rounded-2xl p-4 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Target size={15} className="text-amber-400" /> 学習目標
        </h3>
        <div className="space-y-3">
          {goals[lang].map(g => (
            <div key={g.id} onClick={() => setGoals(p => ({
              ...p, [lang]: p[lang].map(x => x.id === g.id ? { ...x, completed: !x.completed, progress: x.completed ? x.progress : 100 } : x)
            }))} className="cursor-pointer group">
              <div className="flex items-center gap-3 mb-1.5">
                {g.completed
                  ? <CheckCircle size={16} className="text-amber-400 flex-shrink-0" />
                  : <div className="w-4 h-4 border-2 border-slate-600 rounded-full flex-shrink-0 group-hover:border-amber-500/60 transition-colors" />
                }
                <span className={`text-sm ${g.completed ? 'line-through text-slate-500' : 'text-white'}`}>{g.text}</span>
                <span className="ml-auto text-xs text-slate-500 font-mono">{g.progress}%</span>
              </div>
              <div className="w-full bg-slate-700/60 rounded-full h-1.5 ml-7">
                <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-1.5 rounded-full transition-all duration-700" style={{ width: g.progress + '%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* message chart */}
      {history.length > 1 && (
        <div className="bg-slate-800/70 border border-slate-700/50 rounded-2xl p-4 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <MessageSquare size={15} className="text-amber-400" /> 会話数の推移
          </h3>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#94a3b8' }} itemStyle={{ color: '#60a5fa' }} />
              <Area type="monotone" dataKey="messages" stroke="#60a5fa" strokeWidth={2} fill="url(#grad2)" dot={{ fill: '#60a5fa', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({ onReset }) {
  const [apiKey, setApiKey] = useLocalStorage('re_api_key', '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-safe space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">設定</h2>
        <p className="text-slate-500 text-sm">アプリの設定とデータ管理</p>
      </div>

      <div className="bg-slate-800/70 border border-slate-700/50 rounded-2xl p-4 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-white mb-1">Anthropic APIキー</h3>
        <p className="text-xs text-slate-500 mb-3">
          Vercelにデプロイした場合は環境変数 <span className="font-mono text-amber-400/80">REACT_APP_ANTHROPIC_API_KEY</span> を設定してください。
          ローカル確認用にここでも入力できます（localStorageに保存）。
        </p>
        <div className="flex gap-2">
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
            className="flex-1 bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
          />
          <button onClick={save} className="bg-amber-500 text-slate-900 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors">
            {saved ? '✓ 保存' : '保存'}
          </button>
        </div>
      </div>

      <div className="bg-slate-800/70 border border-slate-700/50 rounded-2xl p-4 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-white mb-1">Vercelデプロイ手順</h3>
        <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
          <li>このプロジェクトをGitHubリポジトリにpush</li>
          <li><span className="text-amber-400/90">vercel.com</span> で新規プロジェクト作成→GitHubと連携</li>
          <li>Environment Variables に <span className="font-mono text-amber-400/90">REACT_APP_ANTHROPIC_API_KEY</span> を追加</li>
          <li>Deployボタンを押すだけ — 専用URLが発行されます</li>
          <li>スマホでそのURLを開き「ホーム画面に追加」→ アプリ化完了</li>
        </ol>
      </div>

      <div className="bg-slate-800/70 border border-red-900/30 rounded-2xl p-4 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-red-400 mb-1">データリセット</h3>
        <p className="text-xs text-slate-500 mb-3">単語帳・学習履歴・目標をすべてリセットします。この操作は取り消せません。</p>
        <button onClick={onReset} className="bg-red-900/50 text-red-400 border border-red-800/50 text-sm px-4 py-2 rounded-lg hover:bg-red-900 transition-colors">
          全データをリセット
        </button>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [lang, setLang] = useLocalStorage('re_lang', 'english');
  const [tab, setTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showTranslation, setShowTranslation] = useState({});
  const [vocabList, setVocabList] = useLocalStorage('re_vocab', DEFAULT_VOCAB);
  const [goals, setGoals] = useLocalStorage('re_goals', DEFAULT_GOALS);
  const [learningHistory, setLearningHistory] = useLocalStorage('re_history', []);
  const bottomRef = useRef(null);
  const { speak, stop, speaking } = useTTS();

  // init greeting on lang change
  useEffect(() => {
    setMessages([{
      id: Date.now(),
      sender: 'tutor',
      text: LANGUAGES[lang].greeting,
      translation: lang === 'thai'
        ? 'ようこそ！不動産専門のタイ語コーチです。今日は何を練習しましょうか？'
        : 'ようこそ！不動産専門の英語コーチです。現在進行中の物件案件はありますか？',
    }]);
    setFeedback(null);
    setShowTranslation({});
    setInput('');
  }, [lang]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    const userMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].slice(-6)
        .map(m => (m.sender === 'user' ? 'Student' : 'Coach') + ': ' + m.text)
        .join('\n');

      const parsed = await getTutorResponse(lang, history, userText);

      setMessages(p => [...p, {
        id: Date.now() + 1,
        sender: 'tutor',
        text: parsed.tutorResponse || '...',
        translation: parsed.japaneseTranslation || '',
        suggestedVocab: parsed.suggestedVocab || '',
      }]);
      setFeedback(parsed.feedback || null);

      const acc = parsed.accuracy || 75;
      const todayStr = today();
      setLearningHistory(p => {
        const existing = p.find(h => h.date === todayStr);
        if (existing) {
          return p.map(h => h.date === todayStr
            ? { ...h, accuracy: Math.round((h.accuracy + acc) / 2), messages: h.messages + 1 }
            : h
          );
        }
        return [...p.slice(-29), { date: todayStr, accuracy: acc, messages: 1 }];
      });
    } catch (e) {
      setMessages(p => [...p, {
        id: Date.now() + 1,
        sender: 'tutor',
        text: '⚠️ ' + (e.message || 'Unknown error'),
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, lang, setLearningHistory]);

  const toggleTranslation = id => setShowTranslation(p => ({ ...p, [id]: !p[id] }));

  const todayStats = learningHistory.find(h => h.date === today());
  const totalMessages = learningHistory.reduce((s, h) => s + h.messages, 0);

  const handleReset = () => {
    if (!window.confirm('本当にすべてのデータをリセットしますか？')) return;
    setVocabList(DEFAULT_VOCAB);
    setGoals(DEFAULT_GOALS);
    setLearningHistory([]);
  };

  const NAV = [
    { id: 'chat',  icon: MessageSquare, label: '会話' },
    { id: 'vocab', icon: BookMarked,    label: '単語帳' },
    { id: 'stats', icon: TrendingUp,    label: '記録' },
    { id: 'settings', icon: Settings,  label: '設定' },
  ];

  return (
    <div className="flex bg-slate-950 text-white overflow-hidden pt-safe" style={{height: "100dvh"}}>
      {/* ── left sidebar (desktop) ── */}
      <div className="hidden md:flex w-16 bg-slate-900/80 border-r border-slate-800/80 flex-col items-center py-4 gap-3 flex-shrink-0 backdrop-blur-sm">
        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center mb-2 shadow-lg shadow-amber-500/20">
          <Building2 size={20} className="text-slate-900" />
        </div>
        {NAV.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all ${
              tab === id ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
            }`}>
            <Icon size={17} />
            <span style={{ fontSize: '9px' }}>{label}</span>
          </button>
        ))}
        <div className="mt-auto flex flex-col gap-2">
          {Object.entries(LANGUAGES).map(([code, l]) => (
            <button key={code} onClick={() => setLang(code)}
              className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                lang === code ? 'bg-slate-700 ring-2 ring-amber-500' : 'hover:bg-slate-800/60 opacity-40 hover:opacity-70'
              }`}>
              {l.flag}
            </button>
          ))}
        </div>
      </div>

      {/* ── main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* header */}
        <div className="bg-slate-900/70 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between flex-shrink-0 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="md:hidden w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <Building2 size={16} className="text-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold text-xs tracking-widest uppercase">Real Estate</span>
                <span className="text-slate-600 text-xs">×</span>
                <span className="text-white font-semibold text-xs">{LANGUAGES[lang].nativeName}</span>
              </div>
              <p className="text-slate-600 text-xs hidden sm:block">不動産ビジネス特化型語学コーチ</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-3 text-center">
              {[['💬', totalMessages, '通算'],['📚', vocabList[lang].length, '単語'],['🎯', (todayStats?.accuracy || '--') + (todayStats ? '%' : ''), '精度']].map(([icon, val, label]) => (
                <div key={label}>
                  <div className="text-base leading-none">{icon}</div>
                  <div className="font-bold text-xs font-mono">{val}</div>
                  <div className="text-slate-600 text-xs">{label}</div>
                </div>
              ))}
            </div>
            {/* mobile lang toggle */}
            <div className="md:hidden flex gap-1">
              {Object.entries(LANGUAGES).map(([code, l]) => (
                <button key={code} onClick={() => setLang(code)}
                  className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all ${
                    lang === code ? 'bg-slate-700 ring-2 ring-amber-500' : 'opacity-40 hover:opacity-70'
                  }`}>
                  {l.flag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* tab content */}
        {tab === 'chat' && (
          <ChatTab
            lang={lang} messages={messages} input={input} setInput={setInput}
            loading={loading} sendMessage={sendMessage} feedback={feedback}
            showTranslation={showTranslation} toggleTranslation={toggleTranslation}
            speak={speak} stop={stop} speaking={speaking} bottomRef={bottomRef}
          />
        )}
        {tab === 'vocab' && (
          <VocabTab lang={lang} vocabList={vocabList} setVocabList={setVocabList} speak={speak} stop={stop} speaking={speaking} />
        )}
        {tab === 'stats' && (
          <StatsTab lang={lang} goals={goals} setGoals={setGoals} history={learningHistory} />
        )}
        {tab === 'settings' && (
          <SettingsTab onReset={handleReset} />
        )}
      </div>

      {/* ── bottom nav (mobile) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 border-t border-slate-800/80 flex backdrop-blur-sm" style={{paddingBottom: "env(safe-area-inset-bottom)"}}>
        {NAV.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-all ${
              tab === id ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}>
            <Icon size={20} />
            <span style={{ fontSize: '10px' }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
