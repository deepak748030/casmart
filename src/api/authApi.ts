import type {
    AuthResponse,
    ErrorResponse,
    LoginCredentials,
    SignupCredentials,
    UpdatePasswordData,
    UpdateDetailsData,
    User,
} from '@/types/auth';

// Get API URL from environment variable or fallback to localhost:5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const AUTH_ENDPOINT = `${API_URL}/api/auth`;

/**
 * Custom error class for API errors
 */
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
            credentials: 'include', // Include cookies
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

        // Network or other errors
        throw new ApiError(
            error instanceof Error ? error.message : 'Network error occurred',
            0
        );
    }
}

/**
 * Sign up a new user
 */
export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>(`${AUTH_ENDPOINT}/signup`, {
        method: 'POST',
        body: JSON.stringify(credentials),
    });

    // Store token in localStorage
    if (response.token) {
        localStorage.setItem('authToken', response.token);
    }

    return response;
}

/**
 * Log in an existing user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>(`${AUTH_ENDPOINT}/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
    });

    // Store token in localStorage
    if (response.token) {
        localStorage.setItem('authToken', response.token);
    }

    return response;
}

/**
 * Log out the current user
 */
export async function logout(): Promise<{ success: boolean; message: string }> {
    const response = await apiRequest<{ success: boolean; message: string }>(
        `${AUTH_ENDPOINT}/logout`,
        {
            method: 'POST',
        }
    );

    // Remove token from localStorage
    localStorage.removeItem('authToken');

    return response;
}

/**
 * Get current user profile
 */
export async function getMe(): Promise<{ success: boolean; data: { user: User } }> {
    return apiRequest<{ success: boolean; data: { user: User } }>(
        `${AUTH_ENDPOINT}/me`,
        {
            method: 'GET',
        }
    );
}

/**
 * Update user details
 */
export async function updateDetails(
    data: UpdateDetailsData
): Promise<{ success: boolean; data: { user: User } }> {
    return apiRequest<{ success: boolean; data: { user: User } }>(
        `${AUTH_ENDPOINT}/updatedetails`,
        {
            method: 'PUT',
            body: JSON.stringify(data),
        }
    );
}

/**
 * Update user password
 */
export async function updatePassword(
    data: UpdatePasswordData
): Promise<AuthResponse> {
    return apiRequest<AuthResponse>(`${AUTH_ENDPOINT}/updatepassword`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
}

/**
 * Get stored auth token
 */
export function getAuthToken(): string | null {
    return localStorage.getItem('authToken');
}

/**
 * Remove auth token (client-side logout)
 */
export function clearAuthToken(): void {
    localStorage.removeItem('authToken');
}
