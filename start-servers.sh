#!/bin/bash

# バックエンド・フロントエンドサーバーを起動するスクリプト

echo "🚀 サーバーを起動しています..."

# プロジェクトルートディレクトリを取得
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# バックエンドが起動中かチェック
if lsof -ti:8000 >/dev/null 2>&1; then
    echo "⚠️  バックエンド（ポート8000）は既に起動しています"
else
    echo "📦 バックエンドを起動中..."
    cd "$PROJECT_DIR/backend"
    source venv/bin/activate
    nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > ../logs/backend.log 2>&1 &
    echo "   ✓ バックエンド起動完了（http://localhost:8000）"
fi

# フロントエンドが起動中かチェック
if lsof -ti:3000 >/dev/null 2>&1; then
    echo "⚠️  フロントエンド（ポート3000）は既に起動しています"
else
    echo "🎨 フロントエンドを起動中..."
    cd "$PROJECT_DIR/frontend"
    nohup npm run dev > ../logs/frontend.log 2>&1 &
    echo "   ✓ フロントエンド起動完了（http://localhost:3000）"
fi

echo ""
echo "✅ 全てのサーバーが起動しました"
echo ""
echo "📍 アクセスURL:"
echo "   - フロントエンド: http://localhost:3000"
echo "   - バックエンドAPI: http://localhost:8000"
echo "   - APIドキュメント: http://localhost:8000/docs"
echo ""
echo "📋 ログファイル:"
echo "   - バックエンド: logs/backend.log"
echo "   - フロントエンド: logs/frontend.log"
echo ""
echo "🛑 停止するには: ./stop-servers.sh"
