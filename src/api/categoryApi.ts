const API_URL = `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5000/api';

export interface Category {
    _id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryResponse {
    success: boolean;
    data: {
        category: Category;
    };
}

export interface CategoriesResponse {
    success: boolean;
    count: number;
    data: {
        categories: Category[];
    };
}

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    const result: CategoriesResponse = await response.json();
    // Always construct image URL for each category
    const categories = result.data.categories.map(cat => ({
        ...cat,
        imageUrl: `${API_URL}/categories/${cat._id}/image`
    }));
    return categories;
};

// Get single category
export const getCategory = async (id: string): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch category');
    }
    const result: CategoryResponse = await response.json();
    const category = result.data.category;
    // Always construct image URL
    category.imageUrl = `${API_URL}/categories/${category._id}/image`;
    return category;
};

// Create category (admin only)
export const createCategory = async (
    name: string,
    description: string,
    image: File | null,
    token: string
): Promise<Category> => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image) {
        formData.append('image', image);
    }

    const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create category');
    }

    const result: CategoryResponse = await response.json();
    return result.data.category;
};

// Update category (admin only)
export const updateCategory = async (
    id: string,
    name: string,
    description: string,
    image: File | null,
    token: string
): Promise<Category> => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image) {
        formData.append('image', image);
    }

    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update category');
    }

    const result: CategoryResponse = await response.json();
    return result.data.category;
};

// Delete category (admin only, soft delete)
export const deleteCategory = async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete category');
    }
};
