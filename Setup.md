# 育英館大学単位管理システム - セットアップ手順

## 1. Next.jsプロジェクトの作成
```bash
npx create-next-app@latest ikueikan-credit-checker --typescript --tailwind --app
cd ikueikan-credit-checker
```

## 2. 必要なパッケージのインストール
```bash
# UI関連
npm install lucide-react

# データ処理関連
npm install zod

# 開発ツール
npm install -D @types/node
```

## 3. プロジェクト構造
```
ikueikan-credit-checker/
├── app/
│   ├── api/
│   │   └── scrape/
│   │       └── route.ts          # シラバススクレイピングAPI
│   ├── components/
│   │   ├── CourseSearch.tsx      # 科目検索コンポーネント
│   │   ├── CourseList.tsx        # 科目一覧コンポーネント
│   │   ├── CreditSummary.tsx     # 単位集計コンポーネント
│   │   ├── RequirementCheck.tsx  # 卒業要件チェックコンポーネント
│   │   └── WarningAlert.tsx      # 必修未履修警告コンポーネント
│   ├── lib/
│   │   ├── types.ts              # 型定義
│   │   ├── data/
│   │   │   ├── courses.json      # 科目データ
│   │   │   └── requirements.json # 卒業要件データ
│   │   ├── utils.ts              # ユーティリティ関数
│   │   └── storage.ts            # ローカルストレージ管理
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── package.json
└── tsconfig.json
```

## 4. 環境設定
.env.localファイルを作成（必要に応じて）：
```
NEXT_PUBLIC_SYLLABUS_URL=https://www.ikueikan.ac.jp/2025/syllabus2025.html
```