import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Product {
    _id: string;
    title: string;
    description: string;
    amount: number;
    discountedAmount?: number;
    discountPercent?: number;
    averageRating: number;
    numOfReviews: number;
    sizes: string[];
    totalStocks: number;
    inStock: boolean;
    SKU: string;
    category: {
        _id: string;
        name: string;
    };
    imageUrl?: string;
    imageUrls?: string[];
    variants?: Array<{
        type: string;
        value: string;
        priceAdjustment: number;
        stock: number;
    }>;
    specifications?: Array<{
        name: string;
        value: string;
    }>;
    keyFeatures?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ProductsResponse {
    success: boolean;
    count: number;
    total: number;
    data: {
        products: Product[];
    };
}

export interface ProductResponse {
    success: boolean;
    data: {
        product: Product;
    };
}

export interface ProductQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    keyword?: string;
    category?: string;
    categoryName?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sort?: string;
}

// Get all products with filters and pagination
export const getAllProducts = async (params?: ProductQueryParams): Promise<ProductsResponse> => {
    const response = await api.get('/api/products', { params });
    return response.data;
};

// Get single product by ID
export const getProductById = async (id: string): Promise<ProductResponse> => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
};

// Get product image URL
export const getProductImageUrl = (productId: string, imageIndex: number = 0): string => {
    return `${API_URL}/api/products/${productId}/images/${imageIndex}`;
};

// Admin: Create product (with FormData for file upload)
export const createProduct = async (formData: FormData): Promise<ProductResponse> => {
    const response = await api.post('/api/products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Admin: Update product (with FormData for file upload)
export const updateProduct = async (id: string, formData: FormData): Promise<ProductResponse> => {
    const response = await api.put(`/api/products/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Admin: Delete product (soft delete)
export const deleteProduct = async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
};
