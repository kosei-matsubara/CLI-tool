#!/bin/bash

# バックエンド・フロントエンドサーバーを停止するスクリプト

echo "🛑 サーバーを停止しています..."

# バックエンド（ポート8000）を停止
if lsof -ti:8000 >/dev/null 2>&1; then
    echo "   バックエンド（ポート8000）を停止中..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    echo "   ✓ バックエンド停止完了"
else
    echo "   ℹ バックエンドは起動していません"
fi

# フロントエンド（ポート3000）を停止
if lsof -ti:3000 >/dev/null 2>&1; then
    echo "   フロントエンド（ポート3000）を停止中..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    echo "   ✓ フロントエンド停止完了"
else
    echo "   ℹ フロントエンドは起動していません"
fi

echo "✅ 全てのサーバーが停止しました"
