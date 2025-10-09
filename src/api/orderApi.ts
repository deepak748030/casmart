import type { ApiError } from './authApi';

// Get API URL from environment variable or fallback to localhost:5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ORDER_ENDPOINT = `${API_URL}/api/orders`;

/**
 * Order Types
 */
export interface OrderItem {
    product: string;
    name: string;
    quantity: number;
    image: string;
    price: number;
    discountedPrice?: number;
    variant?: string;
}

export interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface PaymentResult {
    id?: string;
    status?: string;
    update_time?: string;
    email_address?: string;
}

export interface Order {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    } | string;
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    paymentResult?: PaymentResult;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderData {
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    taxPrice?: number;
    shippingPrice?: number;
    totalPrice?: number;
}

export interface OrdersResponse {
    success: boolean;
    count: number;
    total: number;
    data: {
        orders: Order[];
    };
}

export interface SingleOrderResponse {
    success: boolean;
    data: {
        order: Order;
    };
}

export interface UpdateOrderResponse {
    success: boolean;
    data: {
        order: Order;
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
 * Create a new order
 * @route POST /api/orders
 * @access Private (User)
 */
export async function createOrder(orderData: CreateOrderData): Promise<SingleOrderResponse> {
    return apiRequest<SingleOrderResponse>(ORDER_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(orderData),
    });
}

/**
 * Get all orders (Admin only)
 * @route GET /api/orders
 * @access Private/Admin
 */
export async function getAllOrders(queryParams?: {
    page?: number;
    limit?: number;
    status?: string;
    sort?: string;
}): Promise<OrdersResponse> {
    const params = new URLSearchParams();

    if (queryParams) {
        if (queryParams.page) params.append('page', queryParams.page.toString());
        if (queryParams.limit) params.append('limit', queryParams.limit.toString());
        if (queryParams.status) params.append('orderStatus', queryParams.status);
        if (queryParams.sort) params.append('sort', queryParams.sort);
    }

    const url = params.toString() ? `${ORDER_ENDPOINT}?${params}` : ORDER_ENDPOINT;

    return apiRequest<OrdersResponse>(url, {
        method: 'GET',
    });
}

/**
 * Get logged in user's orders
 * @route GET /api/orders/myorders
 * @access Private (User)
 */
export async function getMyOrders(): Promise<OrdersResponse> {
    return apiRequest<OrdersResponse>(`${ORDER_ENDPOINT}/myorders`, {
        method: 'GET',
    });
}

/**
 * Get single order by ID
 * @route GET /api/orders/:id
 * @access Private (User or Admin)
 */
export async function getOrderById(orderId: string): Promise<SingleOrderResponse> {
    return apiRequest<SingleOrderResponse>(`${ORDER_ENDPOINT}/${orderId}`, {
        method: 'GET',
    });
}

/**
 * Update order to paid (Admin only)
 * @route PUT /api/orders/:id/pay
 * @access Private/Admin
 */
export async function updateOrderToPaid(
    orderId: string,
    paymentResult: PaymentResult
): Promise<UpdateOrderResponse> {
    return apiRequest<UpdateOrderResponse>(`${ORDER_ENDPOINT}/${orderId}/pay`, {
        method: 'PUT',
        body: JSON.stringify(paymentResult),
    });
}

/**
 * Update order to delivered (Admin only)
 * @route PUT /api/orders/:id/deliver
 * @access Private/Admin
 */
export async function updateOrderToDelivered(orderId: string): Promise<UpdateOrderResponse> {
    return apiRequest<UpdateOrderResponse>(`${ORDER_ENDPOINT}/${orderId}/deliver`, {
        method: 'PUT',
    });
}

/**
 * Delete order (Admin only - soft delete)
 * @route DELETE /api/orders/:id
 * @access Private/Admin
 */
export async function deleteOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`${ORDER_ENDPOINT}/${orderId}`, {
        method: 'DELETE',
    });
}
