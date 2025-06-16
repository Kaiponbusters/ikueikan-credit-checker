# 育英館大学 単位管理システム 📚

> Next.js 15 + TypeScript による科目検索・履修管理・単位進捗確認Webアプリケーション

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 概要

育英館大学単位管理システムは、学生が効率的に履修計画を立て、単位取得状況を管理できるWebアプリケーションです。科目検索から履修登録、進捗確認まで、学習管理に必要な機能を一つのプラットフォームで提供します。

### 📸 アプリケーション画面

![アプリケーションのホーム画面](ikueikan-homepage.png)
*メイン画面: 科目検索と履修管理*

![単位進捗サマリー](ikueikan-credit-summary.png)
*単位進捗サマリー: カテゴリ別・系別進捗表示*

## ✨ 主要機能

### 🔍 科目検索・管理
- **高度な検索機能**: キーワード、教員名、開講年度による科目検索
- **詳細フィルタ**: カテゴリ、必修/選択、単位数による絞り込み
- **リアルタイム検索**: 入力に応じた即座の結果更新
- **ソート機能**: 科目名、教員名、単位数、開講年度による並び替え

### 📊 履修管理・進捗追跡
- **履修状態管理**: 履修済み、履修予定、履修中の状態別管理
- **総合進捗表示**: 卒業必要単位に対する現在の進捗状況
- **カテゴリ別進捗**: 11のカテゴリ別単位取得状況
- **系別集計**: 8つの学問系（人文科学系、社会科学系等）による分類

### 🎓 卒業要件管理
- **リアルタイム要件チェック**: 卒業要件の自動計算・表示
- **警告システム**: 必修科目未履修や単位不足の警告表示
- **視覚的進捗表示**: プログレスバーによる直感的な進捗確認

### 💾 データ管理
- **ローカルストレージ**: ブラウザでのデータ永続化
- **インポート/エクスポート**: JSONファイルでのデータ移行
- **データ同期**: 複数デバイス間でのデータ共有（予定）

## 🛠️ 技術スタック

### フロントエンド
- **[Next.js 15.3.3](https://nextjs.org/)** - React フレームワーク (App Router)
- **[TypeScript 5.7.2](https://www.typescriptlang.org/)** - 型安全な JavaScript
- **[Tailwind CSS 3.4.17](https://tailwindcss.com/)** - ユーティリティファーストCSS
- **[Lucide React](https://lucide.dev/)** - 美しいアイコンセット

### 開発・品質管理
- **[ESLint](https://eslint.org/)** - コード品質チェック
- **[Prettier](https://prettier.io/)** - コードフォーマッター
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[lint-staged](https://github.com/okonet/lint-staged)** - ステージングファイルの検証

### データ構造
- **シラバスデータ**: 137科目の詳細情報
- **卒業要件**: カテゴリ別・系別必要単位数
- **学習分野**: 8つの専門系統による分類

## 🚀 セットアップ・インストール

### 前提条件
- **Node.js**: 18.0.0 以上
- **npm**: 8.0.0 以上 (または yarn/pnpm)

### インストール手順

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/Kaiponbusters/ikueikan-credit-checker.git
   cd ikueikan-credit-checker
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

4. **アプリケーションへのアクセス**
   ブラウザで [http://localhost:3000](http://localhost:3000) を開く

### その他のコマンド

```bash
# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start

# リンターによるコードチェック
npm run lint

# TypeScript型チェック
npm run type-check
```

## 📖 使用方法

### 1. 科目検索
1. メイン画面で科目名、教員名、または説明文をキーワードに入力
2. 「詳細検索」で追加フィルタを設定（オプション）
3. 「検索」ボタンをクリックして結果を表示

### 2. 履修登録
1. 検索結果から履修したい科目を選択
2. 「履修済み」「履修予定」「履修中」から適切な状態を選択
3. データは自動的にローカルストレージに保存

### 3. 進捗確認
1. 画面右側の「総合進捗」セクションで全体状況を確認
2. 「カテゴリ別進捗」で各分野の進捗を確認
3. 「系別単位数」で専門分野別の履修状況を確認
4. 「注意事項」セクションで不足単位や必修科目を確認

### 4. データ管理
- **エクスポート**: 「エクスポート」ボタンでJSONファイルをダウンロード
- **インポート**: 「インポート」ボタンで保存済みデータを読み込み

## 📁 プロジェクト構造

```
ikueikan-credit-checker/
├── app/                          # Next.js App Router
│   ├── components/              # コンポーネント
│   │   ├── course-search/      # 科目検索機能
│   │   ├── course-list/        # 科目一覧表示
│   │   └── credit-summary/     # 単位進捗サマリー
│   ├── data/                   # データファイル
│   │   ├── syllabus.json      # シラバス情報
│   │   └── graduation-requirements.json # 卒業要件
│   ├── types/                 # TypeScript型定義
│   ├── utils/                 # ユーティリティ関数
│   ├── globals.css           # グローバルスタイル
│   ├── layout.tsx            # ルートレイアウト
│   └── page.tsx              # ホームページ
├── .cursor/                   # Cursor IDE設定
│   └── rules/                # 開発ガイドライン
├── public/                   # 静的ファイル
├── TODO.md                   # αテスト準備計画
└── README.md                 # プロジェクト説明
```

## 📋 αテスト準備中

現在、マルチユーザー対応とサーバーデプロイに向けた機能拡張を進行中です。

### 計画中の機能
- 🔐 **ユーザー認証**: NextAuth.js v5 による安全なログイン
- 🗄️ **データベース**: Prisma + Vercel Postgres によるデータ永続化
- 🚀 **クラウドデプロイ**: Vercel での本番環境構築
- 👥 **マルチユーザー**: 個人別データ管理とプライバシー保護

詳細は [TODO.md](./TODO.md) をご参照ください。

## 🧑‍💻 開発ガイドライン

### コーディング規約
- **TypeScript**: 型安全性を最優先
- **コンポーネント設計**: 機能別ディレクトリ構造
- **パフォーマンス**: useMemo, useCallback の適切な使用
- **アクセシビリティ**: WCAG 2.1 準拠

### 開発経験からの学び
- `graduationRequirements` vs `graduationRequirement` の型整合性
- JSONデータ構造とTypeScript型定義の同期
- ローカルストレージでの状態管理とパフォーマンス最適化

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！

1. プロジェクトをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Request を作成

## 📄 ライセンス

このプロジェクトは [MIT License](https://opensource.org/licenses/MIT) の下で公開されています。

## 📞 お問い合わせ

- **プロジェクト**: [ikueikan-credit-checker](https://github.com/Kaiponbusters/ikueikan-credit-checker)
- **Issue**: [GitHub Issues](https://github.com/Kaiponbusters/ikueikan-credit-checker/issues)

---

**育英館大学 単位管理システム** - 効率的な学習計画をサポートします 🎓
