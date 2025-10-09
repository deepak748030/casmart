// Get API URL from environment variable or fallback to localhost:5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ANALYTICS_ENDPOINT = `${API_URL}/api/analytics`;

/**
 * Analytics Types
 */
export interface SalesDataPoint {
    date: string;
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
}

export interface SalesDataResponse {
    success: boolean;
    count: number;
    data: {
        salesData: SalesDataPoint[];
    };
}

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('authToken');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(endpoint, {
            ...options,
            headers,
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'An error occurred');
        }

        return data as T;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Network error occurred');
    }
}

/**
 * Get sales data for charts
 * @route GET /api/analytics/sales-data
 * @access Private/Admin
 */
export async function getSalesData(params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'month' | 'year';
}): Promise<SalesDataResponse> {
    const queryParams = new URLSearchParams();

    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.groupBy) queryParams.append('groupBy', params.groupBy);

    const url = queryParams.toString()
        ? `${ANALYTICS_ENDPOINT}/sales-data?${queryParams}`
        : `${ANALYTICS_ENDPOINT}/sales-data`;

    return apiRequest<SalesDataResponse>(url, {
        method: 'GET',
    });
}
