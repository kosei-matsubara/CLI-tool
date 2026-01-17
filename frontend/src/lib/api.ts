import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CustomerSalesRanking {
  rank: number;
  customer_id: number;
  sales: number;
}

export interface CustomerSalesRankingResponse {
  status: string;
  usecase: string;
  top_n: number;
  ranking: CustomerSalesRanking[];
  graph_url: string;
  total_records: number;
  valid_customers: number;
}

export interface PopularProductsRanking {
  rank: number;
  product_name: string;
  quantity: number;
}

export interface PopularProductsRankingResponse {
  status: string;
  usecase: string;
  top_n: number;
  ranking: PopularProductsRanking[];
  graph_url: string;
  total_records: number;
  valid_products: number;
}

export interface HourlySalesData {
  hour: number;
  sales: number;
}

export interface HourlySalesTrendResponse {
  status: string;
  usecase: string;
  data: HourlySalesData[];
  graph_url: string;
  total_records: number;
  valid_records: number;
  peak_hour: number;
  peak_sales: number;
  lowest_hour: number;
  lowest_sales: number;
}

export const analyticsApi = {
  getCustomerSalesRanking: async (topN: number = 10): Promise<CustomerSalesRankingResponse> => {
    const response = await apiClient.get<CustomerSalesRankingResponse>(
      `/api/v1/analytics/customer-sales-ranking?top_n=${topN}`
    );
    return response.data;
  },

  getPopularProductsRanking: async (topN: number = 10): Promise<PopularProductsRankingResponse> => {
    const response = await apiClient.get<PopularProductsRankingResponse>(
      `/api/v1/analytics/popular-products-ranking?top_n=${topN}`
    );
    return response.data;
  },

  getHourlySalesTrend: async (): Promise<HourlySalesTrendResponse> => {
    const response = await apiClient.get<HourlySalesTrendResponse>(
      `/api/v1/analytics/hourly-sales-trend`
    );
    return response.data;
  },
};

export default apiClient;
