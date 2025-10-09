import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface ActivityLog {
    _id: string;
    user?: {
        _id: string;
        name: string;
        email: string;
    };
    action: string;
    method: string;
    endpoint: string;
    statusCode: number;
    ipAddress?: string;
    userAgent?: string;
    requestBody?: any;
    responseTime?: number;
    error?: string;
    createdAt: string;
}

export interface ActivityResponse {
    success: boolean;
    count: number;
    total: number;
    data: {
        activities: ActivityLog[];
    };
}

export interface ActivityQueryParams {
    page?: number;
    limit?: number;
    method?: string;
    statusCode?: number;
    userId?: string;
    startDate?: string;
    endDate?: string;
}

// Get all activity logs (Admin only)
export const getActivityLogs = async (params?: ActivityQueryParams): Promise<ActivityResponse> => {
    const response = await api.get('/api/activities', { params });
    return response.data;
};

// Get activity statistics
export const getActivityStats = async (): Promise<any> => {
    const response = await api.get('/api/activities/stats');
    return response.data;
};
