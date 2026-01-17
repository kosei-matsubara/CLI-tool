'use client';

import { useState } from 'react';
import { analyticsApi, CustomerSalesRankingResponse, PopularProductsRankingResponse, HourlySalesTrendResponse } from '@/lib/api';

type AnalyticsResult = CustomerSalesRankingResponse | PopularProductsRankingResponse | HourlySalesTrendResponse;

export default function Home() {
  const [inputFile, setInputFile] = useState<string>('./onlineRetail.xlsx');
  const [outputDir, setOutputDir] = useState<string>('./output');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalyticsResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCustomerSalesRanking = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyticsApi.getCustomerSalesRanking(10);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || '集計処理でエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handlePopularProductsRanking = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyticsApi.getPopularProductsRanking(10);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || '集計処理でエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleHourlySalesTrend = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyticsApi.getHourlySalesTrend();
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || '集計処理でエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // 型ガード関数
  const isHourlySalesTrend = (result: AnalyticsResult): result is HourlySalesTrendResponse => {
    return 'data' in result && 'peak_hour' in result;
  };

  const isCustomerSalesRanking = (result: AnalyticsResult): result is CustomerSalesRankingResponse => {
    return 'valid_customers' in result;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダー */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Online Retail Analytics
        </h1>
        <p className="text-gray-600">オンライン小売データ分析アプリケーション</p>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto">
        {/* ファイル設定セクション */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">ファイル設定</h2>

          <div className="space-y-4">
            {/* インプットファイル指定 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                インプットファイル
              </label>
              <input
                type="text"
                value={inputFile}
                onChange={(e) => setInputFile(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="./onlineRetail.xlsx"
              />
              <p className="text-xs text-gray-500 mt-1">
                現在: {inputFile}
              </p>
            </div>

            {/* アウトプット先指定 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                アウトプット先
              </label>
              <input
                type="text"
                value={outputDir}
                onChange={(e) => setOutputDir(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="./output"
              />
              <p className="text-xs text-gray-500 mt-1">
                現在: {outputDir}
              </p>
            </div>
          </div>
        </div>

        {/* ユースケース実行セクション */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">データ分析</h2>

          <div className="space-y-3">
            {/* ユースケース№1 */}
            <button
              onClick={handleCustomerSalesRanking}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-md transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  処理中...
                </>
              ) : (
                '1. 顧客別の売上ランキング'
              )}
            </button>

            {/* ユースケース№2 */}
            <button
              onClick={handlePopularProductsRanking}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-md transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  処理中...
                </>
              ) : (
                '2. 人気商品のトップ10'
              )}
            </button>

            {/* ユースケース№3 */}
            <button
              onClick={handleHourlySalesTrend}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-md transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  処理中...
                </>
              ) : (
                '3. 時間帯別の売上傾向'
              )}
            </button>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 結果表示 */}
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {result.usecase} - 結果
            </h2>

            {/* サマリー */}
            {isHourlySalesTrend(result) ? (
              /* 時間帯別売上傾向のサマリー */
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600">総レコード数</p>
                  <p className="text-2xl font-bold text-blue-600">{result.total_records.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600">有効レコード数</p>
                  <p className="text-2xl font-bold text-green-600">{result.valid_records.toLocaleString()}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600">ピーク時間帯</p>
                  <p className="text-2xl font-bold text-orange-600">{result.peak_hour}時</p>
                  <p className="text-xs text-gray-500">¥{result.peak_sales.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600">最低時間帯</p>
                  <p className="text-2xl font-bold text-purple-600">{result.lowest_hour}時</p>
                  <p className="text-xs text-gray-500">¥{result.lowest_sales.toLocaleString()}</p>
                </div>
              </div>
            ) : (
              /* ランキング系のサマリー */
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600">総レコード数</p>
                  <p className="text-2xl font-bold text-blue-600">{result.total_records.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600">
                    {isCustomerSalesRanking(result) ? '有効顧客数' : '有効商品数'}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {isCustomerSalesRanking(result) ? result.valid_customers : (result as PopularProductsRankingResponse).valid_products}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600">表示件数</p>
                  <p className="text-2xl font-bold text-purple-600">Top {result.top_n}</p>
                </div>
              </div>
            )}

            {/* グラフ表示 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">グラフ</h3>
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <img
                  src={`http://localhost:8000${result.graph_url}`}
                  alt={result.usecase}
                  className="w-full"
                />
              </div>
            </div>

            {/* データテーブル */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                {isHourlySalesTrend(result) ? '時間帯別詳細' : 'ランキング詳細'}
              </h3>
              <div className="overflow-x-auto">
                {isHourlySalesTrend(result) ? (
                  /* 時間帯別売上テーブル */
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          時間帯
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          売上（Sales）
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {result.data.map((item, index) => (
                        <tr key={index} className={`hover:bg-gray-50 ${item.hour === result.peak_hour ? 'bg-orange-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.hour}時
                            {item.hour === result.peak_hour && <span className="ml-2 text-orange-600 text-xs">（ピーク）</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-semibold">
                            ¥{item.sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  /* ランキングテーブル */
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          順位
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {isCustomerSalesRanking(result) ? '顧客ID' : '商品名'}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {isCustomerSalesRanking(result) ? '売上（Sales）' : '販売数量（Quantity）'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {result.ranking.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.rank}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {'customer_id' in item ? item.customer_id : item.product_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-semibold">
                            {'sales' in item
                              ? `¥${item.sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              : item.quantity.toLocaleString()
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* フッター */}
      <footer className="text-center mt-12 text-gray-600 text-sm">
        <p>FastAPI + React | Online Retail Analytics Application</p>
      </footer>
    </div>
  );
}
