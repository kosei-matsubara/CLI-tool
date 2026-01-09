# FastAPI + React Webアプリケーション

## プロジェクト概要
FastAPI（バックエンド）とReact/Next.js（フロントエンド）を使用したフルスタックWebアプリケーションを開発します。


**ユースケース（例）:**
1. **顧客別の売上ランキング**: 顧客IDごと（CustomerID）に売上（Sales）を集計し、上位10名をリストアップし、棒グラフで可視化する。売上（Sales）=UnitPrice*Quantity

2. **人気商品のトップ10**: 商品ごと（Description）に販売数量（Quantity）を集計し、ランキング上位10の商品を特定し、棒グラフで可視化する

3. **時間帯別の売上傾向**: 注文日時（InvoiceDate）から時間だけを抽出し、時間帯ごとの売上（Sales）を折れ線グラフで可視化する。売上（Sales）=UnitPrice*Quantity


**主要な機能：**
1. **データ集計**: 指定された列でデータをグループ化し、合計値や平均値などを計算できること。
2. **可視化**: 集計結果を棒グラフとして画像ファイルに保存できること。
3. **レポート**: 集計結果をコンソールにテキスト形式で表示できること。


**不要な機能：**
1. **状態遷移**: 仮作成や確定など状態遷移は不要である。
2. **権限**: 権限制御は不要である。
3. **認証**: 認証機能は不要である。


**インプットデータ:**
1. **インプットデータ格納先**: ./onlineRetail.xlsx

2. **インプットデータカラム**:
InvoiceNo
StockCode
Description
Quantity
InvoiceDate
UnitPrice
CustomerID
Country


**主要な画面：**
1. **ホーム画面**: ユーザーが操作するメイン画面である。

**画面詳細：**
1. **インプットファイル指定機能**: ホーム画面にインプットファイル指定ボタンを配置する。
2. **アウトプット指定機能**: ホーム画面にアウトプット先の指定ボタンを配置する。
3. **「1.顧客別の売上ランキング」機能**: ホーム画面にユースケース№1の集計ボタンを配置する。
4. **「2.人気商品のトップ10」機能**: ホーム画面にユースケース№2の集計ボタンを配置する。
5. **「3.時間帯別の売上傾向」機能**: ホーム画面にユースケース№3の集計ボタンを配置する。






## 技術スタック

### バックエンド
- **Webフレームワーク**: FastAPI（軽量・高性能・学習コスト低）
- **データベース**: SQLite（開発環境）/ PostgreSQL（本番環境・AWS RDS）
- **ORM**: SQLAlchemy
- **データ検証**: Pydantic
- **認証**: JWT + bcrypt
- **ASGIサーバー**: Uvicorn
- **テスト**: pytest + pytest-asyncio

### フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **スタイリング**: TailwindCSS + Headless UI
- **状態管理**: Zustand + React Query
- **フォーム**: React Hook Form + Zod validation
- **HTTPクライアント**: Axios with interceptors
- **UIコンポーネント**: Radix UI / Shadcn/ui
- **テスト**: Jest + React Testing Library + Playwright

### インフラ・デプロイ
- **コンテナ**: Docker + docker-compose
- **バックエンド**: AWS ECS Fargate + ALB + RDS PostgreSQL
- **フロントエンド**: AWS S3 + CloudFront (Static hosting)
- **監視**: CloudWatch + アラーム設定

## プロジェクト構成
```
CLI-tool/
├── backend/                 # FastAPI バックエンド
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPIアプリケーション
│   │   ├── models.py        # SQLAlchemy モデル (Category)
│   │   ├── schemas.py       # Pydantic スキーマ
│   │   ├── database.py      # データベース設定
│   │   ├── crud.py          # CRUD操作
│   │   ├── auth.py          # 認証・JWT関連
│   │   ├── security.py      # セキュリティ設定
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── auth.py      # 認証エンドポイント
│   │       ├── todos.py     # ToDo CRUD API
│   │       └── categories.py # カテゴリ管理 API
│   ├── tests/               # pytest テスト
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/                # Next.js フロントエンド
│   ├── src/
│   │   ├── app/             # App Router (Next.js 14)
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/          # 再利用可能なUI部品
│   │   │   ├── todos/       # ToDo関連コンポーネント
│   │   │   ├── auth/        # 認証関連コンポーネント
│   │   │   └── layout/      # レイアウト部品
│   │   ├── lib/
│   │   │   ├── api.ts       # API クライアント
│   │   │   ├── auth.ts      # 認証ロジック
│   │   │   └── utils.ts     # ユーティリティ
│   │   ├── stores/          # Zustand store
│   │   ├── types/           # TypeScript型定義
│   │   └── hooks/           # カスタムフック
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml       # 開発環境統合
├── .gitignore
└── README.md
```

## 開発環境セットアップ

### バックエンド依存関係
```bash
# backend/requirements.txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
python-multipart==0.0.6
python-dotenv==1.0.0
python-jose[cryptography]==3.3.0  # JWT
passlib[bcrypt]==1.7.4            # パスワードハッシュ化
slowapi==0.1.9                    # レート制限
python-cors==0.6.0                # CORS
bleach==6.1.0                     # XSS対策

# 開発・テスト環境用
pytest==7.4.3
pytest-asyncio==0.21.1
alembic==1.12.1                   # データベースマイグレーション

# PostgreSQL用（本番環境）
psycopg2-binary==2.9.9
```

### フロントエンド依存関係
```json
// frontend/package.json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "tailwindcss": "3.3.0",
    "@headlessui/react": "1.7.17",
    "zustand": "4.4.6",
    "@tanstack/react-query": "5.8.4",
    "react-hook-form": "7.47.0",
    "zod": "3.22.4",
    "axios": "1.6.0",
    "@radix-ui/react-dialog": "1.0.5",
    "@radix-ui/react-dropdown-menu": "2.0.6",
    "lucide-react": "0.292.0"
  },
  "devDependencies": {
    "typescript": "5.2.2",
    "@types/react": "18.2.37",
    "@types/node": "20.8.10",
    "jest": "29.7.0",
    "@testing-library/react": "14.1.2",
    "playwright": "1.40.0"
  }
}
```

### 環境変数設定
```bash
# backend/.env.example
DATABASE_URL=sqlite:///./app.db
# DATABASE_URL=postgresql://user:password@localhost/dbname  # PostgreSQL用
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
DEBUG=True
CORS_ORIGINS=["http://localhost:3000"]  # フロントエンド用

# frontend/.env.local.example
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=CLI-tool App
```

## 開発コマンド

### バックエンド開発
```bash
# 開発サーバー起動
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# テスト実行
pytest
pytest tests/test_auth.py -v  # 特定テストファイル

# データベースマイグレーション
alembic revision --autogenerate -m "description"
alembic upgrade head

# 依存関係インストール
pip install -r requirements.txt
```

### フロントエンド開発
```bash
# 開発サーバー起動
cd frontend
npm run dev

# ビルド
npm run build

# テスト実行
npm test
npm run test:e2e  # Playwright E2Eテスト

# 依存関係インストール
npm install
```

### フルスタック開発（Docker）
```bash
# 開発環境起動（バックエンド + フロントエンド + データベース）
docker-compose up -d

# ログ確認
docker-compose logs -f

# コンテナ停止
docker-compose down
```

## 開発フェーズ

### Phase 1: バックエンド基盤構築
- [ ] FastAPI プロジェクト構造作成
- [ ] データベース接続設定 (SQLAlchemy)
- [ ] 基本的なPydanticスキーマ定義
- [ ] 環境変数設定

<!-- ### Phase 2: データベース・モデル実装
- [ ] User, Todo, Category モデル実装
- [ ] データベースマイグレーション設定
- [ ] CRUD操作の基本実装
- [ ] モデル間リレーション設定 -->

<!-- ### Phase 3: 認証システム実装
- [ ] JWT認証機能実装
- [ ] パスワードハッシュ化
- [ ] ユーザー登録・ログインAPI
- [ ] 認証ミドルウェア実装
- [ ] セキュリティ設定（CORS、レート制限） -->

### Phase 4: ToDo CRUD API実装
- [ ] アプリ CRUD エンドポイント
<!-- - [ ] カテゴリ管理機能 -->
<!-- - [ ] フィルタリング・ソート・ページング -->
<!-- - [ ] 入力検証・エラーハンドリング -->
- [ ] API レスポンス統一

### Phase 5: フロントエンド基盤構築
- [ ] Next.js プロジェクト初期化
- [ ] TailwindCSS + Shadcn/ui セットアップ
- [ ] API クライアント設定 (Axios + React Query)
- [ ] ルーティング設定
- [ ] 状態管理設定 (Zustand)

<!-- ### Phase 6: 認証UI実装
- [ ] ログイン・登録フォーム作成
- [ ] JWT トークン管理実装
- [ ] 認証状態管理・Context実装
- [ ] Protected Route コンポーネント
- [ ] 認証フロー統合テスト -->

### Phase 7: アプリUI実装
- [ ] ホーム画面
<!-- - [ ] ToDo 作成・編集フォーム   -->
<!-- - [ ] カテゴリ管理UI -->
<!-- - [ ] フィルタリング・ソート機能 -->
<!-- - [ ] レスポンシブデザイン対応 -->
<!-- - [ ] ダークモード対応（オプション） -->

### Phase 8: フロントエンド・バックエンド統合
- [ ] API エンドポイント接続
<!-- - [ ] エラーハンドリング統一 -->
- [ ] ローディング状態管理
<!-- - [ ] Toast通知システム実装 -->
<!-- - [ ] フォーム検証統合 -->

<!-- ### Phase 9: テスト実装
- [ ] pytest設定・API統合テスト
- [ ] Jest + React Testing Library
- [ ] Playwright E2Eテスト基本設定
- [ ] CI/CD パイプライン準備 -->

### Phase 10: Docker化・AWS準備
- [ ] Dockerfile作成（バックエンド・フロントエンド）
- [ ] docker-compose.yml設定
- [ ] AWS ECS Task Definition
- [ ] S3 + CloudFront設定（フロントエンド）
- [ ] 環境変数・シークレット管理

## 開発時の注意点

### セキュリティ
- **認証**: JWT + bcrypt、適切なトークン有効期限設定
- **認可**: ユーザー毎のリソース分離、適切な権限チェック
- **入力検証**: Pydantic + Zod、SQLインジェクション・XSS対策
- **CORS設定**: 本番環境では特定ドメインのみ許可
- **レート制限**: 認証エンドポイントに適用
- **HTTPS強制**: 本番環境必須、セキュリティヘッダー設定

### パフォーマンス
- **データベース**: 適切なインデックス設定、N+1問題回避
- **ページネーション**: 大量データ対応
- **非同期処理**: FastAPI + React Query活用
- **キャッシュ**: React Query自動キャッシュ、Redis検討（将来）
- **画像最適化**: Next.js Image component使用

### 開発効率
- **型安全性**: TypeScript全面採用、Pydantic型生成
- **ホットリロード**: uvicorn --reload + Next.js dev server
- **コードフォーマット**: Black (Python) + Prettier (TypeScript)
- **リンター**: flake8 + ESLint設定
- **テスト駆動**: pytest + Jest、高いカバレッジ維持

### AWS展開設計
- **インフラ**: ECS Fargate + ALB + RDS PostgreSQL
- **フロントエンド**: S3 + CloudFront静的ホスティング
- **監視**: CloudWatch + アラーム設定
- **秘匿情報**: AWS Secrets Manager + Parameter Store
- **CI/CD**: GitHub Actions + ECR + ECS自動デプロイ

## 実装例

### FastAPI メインアプリケーション
```python
# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from .routers import auth, todos, categories
from .database import engine
from . import models

# データベーステーブル作成
models.Base.metadata.create_all(bind=engine)

# FastAPI アプリケーション初期化
app = FastAPI(
    title="ToDo List API",
    description="FastAPI + React ToDoリストアプリケーション",
    version="1.0.0"
)

# レート制限設定
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 開発環境
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# ルーター登録
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(todos.router, prefix="/api/v1/todos", tags=["Todos"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["Categories"])

@app.get("/")
async def root():
    return {"message": "ToDo List API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

### React メインレイアウト
```tsx
// frontend/src/app/layout.tsx
'use client'
import { Inter } from 'next/font/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/lib/auth'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              {children}
            </div>
            <Toaster />
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

### Docker Compose 設定
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/todoapp
      - JWT_SECRET_KEY=your-jwt-secret-key
    depends_on:
      - db
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    volumes:
      - ./frontend:/app
      - /app/node_modules

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=todoapp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 参考資料
- [FastAPI公式ドキュメント](https://fastapi.tiangolo.com/)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [React Query公式ドキュメント](https://tanstack.com/query/latest)
- [Zustand公式ドキュメント](https://zustand-demo.pmnd.rs/)
- [TailwindCSS公式ドキュメント](https://tailwindcss.com/docs)
- [SQLAlchemy公式ドキュメント](https://docs.sqlalchemy.org/)
- [AWS ECS Fargate](https://aws.amazon.com/fargate/)

## 次のステップ・拡張機能
1. **リアルタイム機能**: WebSocket + Server-Sent Events
2. **通知システム**: プッシュ通知、メール通知
3. **ファイル添付**: S3統合、画像アップロード
4. **検索機能**: Elasticsearch統合
5. **チーム機能**: 共有ToDo、権限管理
6. **モバイルアプリ**: React Native、PWA対応
7. **AI機能**: ChatGPT統合、自動分類