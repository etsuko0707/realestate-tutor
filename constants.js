export const LANGUAGES = {
  english: {
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    ttsLang: "en-US",
    greeting: "Welcome! I'm your real estate English coach. Are you working on any property deals right now?"
  },
  thai: {
    name: "Thai",
    nativeName: "ภาษาไทย",
    flag: "🇹🇭",
    ttsLang: "th-TH",
    greeting: "ยินดีต้อนรับ! ผมเป็นโค้ชภาษาไทยด้านอสังหาริมทรัพย์ วันนี้เราจะฝึกอะไรกันดีครับ?"
  }
};

export const DEFAULT_VOCAB = {
  english: [
    { id: 1, word: "Yield", reading: "ヤールド", meaning: "利回り・収益率", example: "The rental yield is 8% annually.", category: "投資", starred: false, learnCount: 0 },
    { id: 2, word: "Due Diligence", reading: "デューデリジェンス", meaning: "物件調査・精査", example: "We need to complete due diligence before closing.", category: "取引", starred: false, learnCount: 0 },
    { id: 3, word: "Cap Rate", reading: "キャップレート", meaning: "還元利回り", example: "The cap rate for this area is around 5%.", category: "投資", starred: false, learnCount: 0 },
    { id: 4, word: "Escrow", reading: "エスクロー", meaning: "第三者預かり", example: "The funds are held in escrow until closing.", category: "取引", starred: false, learnCount: 0 },
    { id: 5, word: "Cash Flow", reading: "キャッシュフロー", meaning: "現金収支", example: "Positive cash flow is key to sustainable investment.", category: "投資", starred: false, learnCount: 0 },
    { id: 6, word: "Leverage", reading: "レバレッジ", meaning: "借入投資", example: "Using leverage increases potential returns.", category: "投資", starred: false, learnCount: 0 },
    { id: 7, word: "Vacancy Rate", reading: "ベイカンシーレート", meaning: "空室率", example: "The vacancy rate in this district is only 3%.", category: "管理", starred: false, learnCount: 0 },
    { id: 8, word: "ROI", reading: "アールオーアイ", meaning: "投資利益率", example: "Our ROI on this project exceeded 20%.", category: "投資", starred: false, learnCount: 0 },
    { id: 9, word: "Appraisal", reading: "アプレイザル", meaning: "不動産鑑定・査定", example: "The bank requires an appraisal before lending.", category: "取引", starred: false, learnCount: 0 },
    { id: 10, word: "Appreciation", reading: "アプリシエーション", meaning: "資産価値上昇", example: "Property appreciation in this area is strong.", category: "投資", starred: false, learnCount: 0 },
    { id: 11, word: "Net Operating Income", reading: "ネット・オペレーティング・インカム", meaning: "純営業収益（NOI）", example: "The NOI increased by 15% this quarter.", category: "投資", starred: false, learnCount: 0 },
    { id: 12, word: "Letter of Intent", reading: "レター・オブ・インテント", meaning: "意向書（LOI）", example: "We submitted a letter of intent for the property.", category: "取引", starred: false, learnCount: 0 },
  ],
  thai: [
    { id: 1, word: "อสังหาริมทรัพย์", reading: "アサンハーリマサップ", meaning: "不動産", example: "ธุรกิจอสังหาริมทรัพย์กำลังเติบโต", category: "基本", starred: false, learnCount: 0 },
    { id: 2, word: "ผลตอบแทน", reading: "ポンタップテン", meaning: "利回り・リターン", example: "ผลตอบแทนของโครงการนี้ดีมาก", category: "投資", starred: false, learnCount: 0 },
    { id: 3, word: "สัญญาเช่า", reading: "サンヤーチャオ", meaning: "賃貸契約", example: "สัญญาเช่ามีอายุ 2 ปี", category: "取引", starred: false, learnCount: 0 },
    { id: 4, word: "ค่าเช่า", reading: "カーチャオ", meaning: "賃料・家賃", example: "ค่าเช่าต่อเดือนเท่าไหร่ครับ?", category: "管理", starred: false, learnCount: 0 },
    { id: 5, word: "นักลงทุน", reading: "ナックロンタン", meaning: "投資家", example: "นักลงทุนต่างชาติสนใจตลาดนี้มาก", category: "基本", starred: false, learnCount: 0 },
    { id: 6, word: "ทำเล", reading: "タムレー", meaning: "立地・ロケーション", example: "ทำเลดีมากอยู่ใจกลางเมือง", category: "物件", starred: false, learnCount: 0 },
    { id: 7, word: "กำไร", reading: "ガムライ", meaning: "利益・収益", example: "โครงการนี้ให้กำไรสูง", category: "投資", starred: false, learnCount: 0 },
    { id: 8, word: "ตลาด", reading: "タラート", meaning: "市場・マーケット", example: "ตลาดอสังหาริมทรัพย์กำลังฟื้นตัว", category: "基本", starred: false, learnCount: 0 },
    { id: 9, word: "โฉนดที่ดิน", reading: "チャノートティーディン", meaning: "土地権利書", example: "ต้องตรวจสอบโฉนดที่ดินก่อนซื้อ", category: "取引", starred: false, learnCount: 0 },
    { id: 10, word: "โครงการ", reading: "クロンガーン", meaning: "プロジェクト・開発", example: "โครงการใหม่จะเปิดตัวเดือนหน้า", category: "開発", starred: false, learnCount: 0 },
    { id: 11, word: "เจ้าของ", reading: "チャオコーン", meaning: "オーナー・所有者", example: "เจ้าของที่ดินยินดีเจรจา", category: "基本", starred: false, learnCount: 0 },
    { id: 12, word: "นายหน้า", reading: "ナーイナー", meaning: "不動産仲介業者", example: "นายหน้าช่วยหาผู้เช่าให้", category: "取引", starred: false, learnCount: 0 },
  ]
};

export const DEFAULT_GOALS = {
  english: [
    { id: 1, text: "不動産交渉の基本フレーズ習得", completed: false, progress: 15 },
    { id: 2, text: "投資用語を英語で説明できる", completed: false, progress: 30 },
    { id: 3, text: "物件提案を英語でできる", completed: false, progress: 10 },
  ],
  thai: [
    { id: 1, text: "タイ語で基本的な物件説明", completed: false, progress: 20 },
    { id: 2, text: "賃貸交渉をタイ語でできる", completed: false, progress: 10 },
    { id: 3, text: "タイ人投資家との会話", completed: false, progress: 5 },
  ]
};

export const QUICK_PHRASES = {
  english: ["What's the yield?", "Let's negotiate.", "I'm interested in investing.", "Show me the cash flow."],
  thai: ["ผลตอบแทนเท่าไหร่?", "ขอต่อราคาได้ไหม?", "สนใจลงทุนครับ", "ขอดูกระแสเงินสดได้ไหม?"]
};

export const CATEGORY_COLORS = {
  "投資": "bg-emerald-900/70 text-emerald-300 border-emerald-700",
  "取引": "bg-blue-900/70 text-blue-300 border-blue-700",
  "管理": "bg-purple-900/70 text-purple-300 border-purple-700",
  "基本": "bg-amber-900/70 text-amber-300 border-amber-700",
  "物件": "bg-rose-900/70 text-rose-300 border-rose-700",
  "開発": "bg-indigo-900/70 text-indigo-300 border-indigo-700",
};

export const ALL_CATEGORIES = ["すべて", "投資", "取引", "管理", "基本", "物件", "開発"];
