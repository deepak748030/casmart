export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'vendor';
    avatar?: {
        public_id: string;
        url: string;
    };
    isEmailVerified: boolean;
    phoneNumber?: string;
    dateOfBirth?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    data: {
        user: User;
    };
}

export interface ErrorResponse {
    success: false;
    message: string;
    errors?: Array<{
        msg: string;
        param: string;
        location: string;
    }>;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    name: string;
    email: string;
    password: string;
}

export interface UpdatePasswordData {
    currentPassword: string;
    newPassword: string;
}

export interface UpdateDetailsData {
    name?: string;
    email?: string;
    phoneNumber?: string;
}
