from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
import os
from datetime import datetime

# 日本語フォント設定
matplotlib.rcParams['font.sans-serif'] = ['Arial Unicode MS', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', 'DejaVu Sans']
matplotlib.rcParams['axes.unicode_minus'] = False

router = APIRouter()

# データファイルのパス
DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "onlineRetail.xlsx")
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "output")

def load_data() -> pd.DataFrame:
    """Excelファイルからデータを読み込む"""
    try:
        df = pd.read_excel(DATA_FILE)
        return df
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"データファイルが見つかりません: {DATA_FILE}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"データ読み込みエラー: {str(e)}")

def calculate_customer_sales_ranking(df: pd.DataFrame, top_n: int = 10) -> tuple[pd.DataFrame, str]:
    """
    顧客別の売上ランキングを計算し、グラフを生成する

    Args:
        df: 入力データフレーム
        top_n: 上位何件を取得するか（デフォルト10）

    Returns:
        tuple: (ランキングデータフレーム, グラフファイルパス)
    """
    # Sales列を計算（UnitPrice * Quantity）
    df['Sales'] = df['UnitPrice'] * df['Quantity']

    # CustomerIDがNaNの行を除外
    df_valid = df[df['CustomerID'].notna()].copy()

    # CustomerIDごとに売上を集計
    customer_sales = df_valid.groupby('CustomerID')['Sales'].sum().reset_index()

    # 売上でソート（降順）し、上位N件を取得
    top_customers = customer_sales.sort_values('Sales', ascending=False).head(top_n)

    # グラフ生成
    plt.figure(figsize=(12, 6))
    plt.bar(range(len(top_customers)), top_customers['Sales'].values, color='steelblue')
    plt.xlabel('顧客ID', fontsize=12)
    plt.ylabel('売上（Sales）', fontsize=12)
    plt.title(f'顧客別売上ランキング Top {top_n}', fontsize=14, fontweight='bold')
    plt.xticks(range(len(top_customers)), [f"ID: {int(cid)}" for cid in top_customers['CustomerID']], rotation=45, ha='right')
    plt.tight_layout()

    # グラフを保存
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    graph_filename = f"customer_sales_ranking_{timestamp}.png"
    graph_path = os.path.join(OUTPUT_DIR, graph_filename)
    plt.savefig(graph_path, dpi=150, bbox_inches='tight')
    plt.close()

    return top_customers, graph_filename

@router.get("/customer-sales-ranking")
async def get_customer_sales_ranking(top_n: int = 10) -> Dict[str, Any]:
    """
    顧客別の売上ランキングを取得

    ユースケース№1: 顧客IDごと（CustomerID）に売上（Sales）を集計し、
    上位10名をリストアップし、棒グラフで可視化する。
    売上（Sales）=UnitPrice*Quantity

    Args:
        top_n: 上位何件を取得するか（デフォルト10）

    Returns:
        ランキングデータとグラフのURL
    """
    # データ読み込み
    df = load_data()

    # 売上ランキング計算とグラフ生成
    ranking_df, graph_filename = calculate_customer_sales_ranking(df, top_n)

    # レスポンス用にデータを整形
    ranking_data = []
    for idx, row in ranking_df.iterrows():
        ranking_data.append({
            "rank": len(ranking_data) + 1,
            "customer_id": int(row['CustomerID']),
            "sales": float(row['Sales'])
        })

    # コンソールにテキスト形式で出力
    print("\n" + "="*50)
    print("顧客別売上ランキング Top {}".format(top_n))
    print("="*50)
    for item in ranking_data:
        print(f"順位 {item['rank']:2d} | 顧客ID: {item['customer_id']:6.0f} | 売上: ¥{item['sales']:,.2f}")
    print("="*50 + "\n")

    return {
        "status": "success",
        "usecase": "顧客別売上ランキング",
        "top_n": top_n,
        "ranking": ranking_data,
        "graph_url": f"/output/{graph_filename}",
        "total_records": len(df),
        "valid_customers": len(ranking_df)
    }

def calculate_popular_products_ranking(df: pd.DataFrame, top_n: int = 10) -> tuple[pd.DataFrame, str]:
    """
    人気商品のランキングを計算し、グラフを生成する

    Args:
        df: 入力データフレーム
        top_n: 上位何件を取得するか（デフォルト10）

    Returns:
        tuple: (ランキングデータフレーム, グラフファイルパス)
    """
    # Descriptionが空でない行を抽出
    df_valid = df[df['Description'].notna() & (df['Description'] != '')].copy()

    # 商品ごと（Description）に販売数量（Quantity）を集計
    product_quantity = df_valid.groupby('Description')['Quantity'].sum().reset_index()

    # 販売数量でソート（降順）し、上位N件を取得
    top_products = product_quantity.sort_values('Quantity', ascending=False).head(top_n)

    # グラフ生成
    plt.figure(figsize=(14, 7))
    plt.bar(range(len(top_products)), top_products['Quantity'].values, color='mediumseagreen')
    plt.xlabel('商品名', fontsize=12)
    plt.ylabel('販売数量（Quantity）', fontsize=12)
    plt.title(f'人気商品ランキング Top {top_n}', fontsize=14, fontweight='bold')

    # 商品名を短縮表示（長い場合は切り詰め）
    labels = [desc[:20] + '...' if len(desc) > 20 else desc for desc in top_products['Description']]
    plt.xticks(range(len(top_products)), labels, rotation=45, ha='right')
    plt.tight_layout()

    # グラフを保存
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    graph_filename = f"popular_products_ranking_{timestamp}.png"
    graph_path = os.path.join(OUTPUT_DIR, graph_filename)
    plt.savefig(graph_path, dpi=150, bbox_inches='tight')
    plt.close()

    return top_products, graph_filename

@router.get("/popular-products-ranking")
async def get_popular_products_ranking(top_n: int = 10) -> Dict[str, Any]:
    """
    人気商品のランキングを取得

    ユースケース№2: 商品ごと（Description）に販売数量（Quantity）を集計し、
    ランキング上位10の商品を特定し、棒グラフで可視化する。

    Args:
        top_n: 上位何件を取得するか（デフォルト10）

    Returns:
        ランキングデータとグラフのURL
    """
    # データ読み込み
    df = load_data()

    # 人気商品ランキング計算とグラフ生成
    ranking_df, graph_filename = calculate_popular_products_ranking(df, top_n)

    # レスポンス用にデータを整形
    ranking_data = []
    for idx, row in ranking_df.iterrows():
        ranking_data.append({
            "rank": len(ranking_data) + 1,
            "product_name": str(row['Description']),
            "quantity": int(row['Quantity'])
        })

    # コンソールにテキスト形式で出力
    print("\n" + "="*70)
    print("人気商品ランキング Top {}".format(top_n))
    print("="*70)
    for item in ranking_data:
        product_name_display = item['product_name'][:40] + '...' if len(item['product_name']) > 40 else item['product_name']
        print(f"順位 {item['rank']:2d} | 商品名: {product_name_display:45s} | 数量: {item['quantity']:,}")
    print("="*70 + "\n")

    return {
        "status": "success",
        "usecase": "人気商品ランキング",
        "top_n": top_n,
        "ranking": ranking_data,
        "graph_url": f"/output/{graph_filename}",
        "total_records": len(df),
        "valid_products": len(ranking_df)
    }
