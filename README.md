# シンプル宿泊予約システム

Next.jsで構築された簡易的な宿泊予約システムです。

## 機能

- 宿泊日の選択
- 部屋タイプの選択
- 予約情報の入力
- 予約確認

## 利用技術

- Next.js
- React
- TypeScript
- CSS Modules

## 使い方

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、アプリケーションが表示されます。

### ビルド

```bash
npm run build
```

### 本番モードでの起動

```bash
npm start
```

## プロジェクト構成

- `pages/` - アプリケーションのページコンポーネント
- `styles/` - CSSスタイルシート
- `public/` - 静的アセット

## 今後の拡張予定

- ユーザー認証機能
- 管理者画面
- 決済処理の統合
- 予約履歴の表示
- メール通知システムの実装 