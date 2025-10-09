import type { User, ErrorResponse } from '@/types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const USERS_ENDPOINT = `${API_URL}/api/users`;

export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public errors?: Array<{ msg: string; param: string; location: string }>
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

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
            const errorData = data as ErrorResponse;
            throw new ApiError(
                errorData.message || 'An error occurred',
                response.status,
                errorData.errors
            );
        }

        return data as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            error instanceof Error ? error.message : 'Network error occurred',
            0
        );
    }
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface UsersResponse {
    success: boolean;
    count: number;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    data: {
        users: User[];
    };
}

export interface UserResponse {
    success: boolean;
    data: {
        user: User;
    };
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    role?: 'user' | 'admin' | 'vendor';
    phoneNumber?: string;
    isEmailVerified?: boolean;
}

/**
 * Get all users with pagination
 */
export async function getUsers(params?: PaginationParams): Promise<UsersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `${USERS_ENDPOINT}${queryParams.toString() ? `?${queryParams}` : ''}`;
    return apiRequest<UsersResponse>(url, { method: 'GET' });
}

/**
 * Get single user by ID
 */
export async function getUser(userId: string): Promise<UserResponse> {
    return apiRequest<UserResponse>(`${USERS_ENDPOINT}/${userId}`, {
        method: 'GET',
    });
}

/**
 * Create new user (admin only)
 */
export async function createUser(userData: {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin' | 'vendor';
}): Promise<UserResponse> {
    return apiRequest<UserResponse>(USERS_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(userData),
    });
}

/**
 * Update user (admin only)
 */
export async function updateUser(
    userId: string,
    data: UpdateUserData
): Promise<UserResponse> {
    return apiRequest<UserResponse>(`${USERS_ENDPOINT}/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

/**
 * Delete user (admin only)
 */
export async function deleteUser(userId: string): Promise<{
    success: boolean;
    message: string;
}> {
    return apiRequest<{ success: boolean; message: string }>(
        `${USERS_ENDPOINT}/${userId}`,
        {
            method: 'DELETE',
        }
    );
}
