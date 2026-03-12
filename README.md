# 🏢 Real Estate Language Tutor

不動産ビジネス特化型の英語・タイ語学習アプリです。

## 機能一覧

- 💬 **AIリアルタイム会話** — 不動産文脈に特化したClaude AIコーチ
- 📚 **単語帳** — 不動産専門用語プリセット＋自由追加、フラッシュカードクイズ
- 🔊 **音声読み上げ** — 英語・タイ語TTS（Web Speech API）
- 💾 **データ永続保存** — 単語帳・学習履歴をlocalStorageに自動保存
- 📊 **学習グラフ** — 精度・会話数の日別推移チャート
- 📱 **PWA対応** — スマホのホーム画面に追加してアプリ化

---

## Vercelへのデプロイ手順

### 1. GitHubにpush

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create realestate-tutor --public --push
```

### 2. Vercelでデプロイ

1. [vercel.com](https://vercel.com) にアクセス → GitHubでログイン
2. "Add New Project" → 作成したリポジトリを選択
3. **Environment Variables** に以下を追加：
   - Key: `REACT_APP_ANTHROPIC_API_KEY`
   - Value: `sk-ant-あなたのAPIキー`
4. "Deploy" ボタンを押す → 数分でデプロイ完了

### 3. スマホにインストール（PWA）

1. iPhoneの場合: Safariで専用URLを開く → 共有ボタン → 「ホーム画面に追加」
2. Androidの場合: Chromeで開く → メニュー → 「ホーム画面に追加」

---

## ローカル開発

```bash
npm install
cp .env.example .env
# .envにAPIキーを記入
npm start
```

---

## 技術スタック

- React 18
- Tailwind CSS
- Recharts（グラフ）
- Web Speech API（音声読み上げ）
- Anthropic Claude API
- Vercel（ホスティング）
