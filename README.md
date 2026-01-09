# Online Retail Analytics - ユースケース№1実装

FastAPI（バックエンド）とNext.js（フロントエンド）を使用したオンライン小売データ分析アプリケーション

## 実装済み機能

### ユースケース№1: 顧客別の売上ランキング
- 顧客IDごと（CustomerID）に売上（Sales = UnitPrice × Quantity）を集計
- 上位10名をリストアップ
- 棒グラフで可視化（PNG画像として保存）
- コンソールにテキスト形式で表示

## プロジェクト構成

```
CLI-tool/
├── backend/                    # FastAPI バックエンド
│   ├── app/
│   │   ├── main.py            # FastAPIアプリケーション
│   │   └── routers/
│   │       └── analytics.py   # データ分析APIエンドポイント
│   ├── output/                # グラフ画像保存ディレクトリ
│   └── requirements.txt       # Python依存関係
├── frontend/                   # Next.js フロントエンド
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # ホーム画面
│   │   │   └── layout.tsx     # ルートレイアウト
│   │   └── lib/
│   │       └── api.ts         # APIクライアント
│   └── package.json           # Node依存関係
├── onlineRetail.xlsx          # インプットデータ
└── README.md
```

## セットアップと起動方法

### クイックスタート（推奨）

プロジェクトルートから以下のスクリプトで一括起動・停止が可能です。

```bash
# 一括起動
./start-servers.sh

# 一括停止
./stop-servers.sh
```

### 手動セットアップ

#### 1. バックエンド（FastAPI）

```bash
# バックエンドディレクトリに移動
cd backend

# Python仮想環境を作成・有効化
python3 -m venv venv
source venv/bin/activate  # Windowsの場合: venv\Scripts\activate

# 依存関係をインストール
pip install -r requirements.txt

# サーバー起動
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

バックエンドが起動したら、以下のURLでアクセスできます:
- API: http://localhost:8000
- APIドキュメント: http://localhost:8000/docs
- ヘルスチェック: http://localhost:8000/health

**停止方法:**
- フォアグラウンド起動の場合: `Ctrl + C`
- バックグラウンド起動の場合: `kill $(lsof -ti:8000)`

#### 2. フロントエンド（Next.js）

```bash
# フロントエンドディレクトリに移動
cd frontend

# 依存関係をインストール
npm install

# 開発サーバー起動
npm run dev
```

フロントエンドが起動したら、ブラウザで以下のURLにアクセス:
- http://localhost:3000

**停止方法:**
- フォアグラウンド起動の場合: `Ctrl + C`
- バックグラウンド起動の場合: `kill $(lsof -ti:3000)`

## 使い方

1. ブラウザで http://localhost:3000 にアクセス
2. ホーム画面で「1. 顧客別の売上ランキング」ボタンをクリック
3. 結果が表示されます:
   - 総レコード数
   - 有効顧客数
   - 売上ランキングTOP10のグラフ
   - ランキング詳細テーブル

## API エンドポイント

### 顧客別売上ランキング取得
```
GET /api/v1/analytics/customer-sales-ranking?top_n=10
```

レスポンス例:
```json
{
  "status": "success",
  "usecase": "顧客別売上ランキング",
  "top_n": 10,
  "ranking": [
    {
      "rank": 1,
      "customer_id": 14646,
      "sales": 280206.02
    },
    ...
  ],
  "graph_url": "/output/customer_sales_ranking_20260108_123456.png",
  "total_records": 541909,
  "valid_customers": 4372
}
```

## 技術スタック

### バックエンド
- FastAPI 0.104.1
- pandas 2.1.3（データ処理）
- matplotlib 3.8.2（グラフ生成）
- openpyxl 3.1.2（Excelファイル読み込み）
- uvicorn 0.24.0（ASGIサーバー）

### フロントエンド
- Next.js 14.0.0（React フレームワーク）
- TypeScript 5.2.2
- Tailwind CSS 3.3.0（スタイリング）
- axios 1.6.0（HTTP クライアント）

## 開発状況

- ✅ ユースケース№1: 顧客別の売上ランキング（完了）
- ⬜ ユースケース№2: 人気商品のトップ10（未実装）
- ⬜ ユースケース№3: 時間帯別の売上傾向（未実装）

## トラブルシューティング

### バックエンドが起動しない
- Python 3.8以上がインストールされているか確認
- `pip install -r requirements.txt`で依存関係を再インストール
- ポート8000が他のプロセスで使用されていないか確認

### フロントエンドが起動しない
- Node.js 18以上がインストールされているか確認
- `npm install`で依存関係を再インストール
- `frontend/.env.local`ファイルが存在するか確認

### データが表示されない
- バックエンドが起動しているか確認（http://localhost:8000/health）
- `onlineRetail.xlsx`ファイルがプロジェクトルートに存在するか確認
- ブラウザのコンソールでエラーメッセージを確認

## 次のステップ

1. ユースケース№2の実装（人気商品のトップ10）
2. ユースケース№3の実装（時間帯別の売上傾向）
3. Docker対応（docker-compose.yml）
4. テストの追加（pytest, Jest）
