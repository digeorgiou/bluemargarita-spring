import { authService } from './authService';
import {
    CategoryReadOnlyDTO,
    CategoryInsertDTO,
    CategoryUpdateDTO,
    CategoryForDropdownDTO,
    CategoryDetailedViewDTO,
    Paginated
} from "../types/api/categoryInterface.ts";

const API_BASE_URL = '/api/categories';

class CategoryService {

    private getAuthHeaders(): HeadersInit {
        const headers = authService.getAuthHeaders();
        console.log('Auth headers being sent:', headers);
        return headers;
    }

    private handleAuthError(response: Response): void {
        console.error('AUTH ERROR DETAILS:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            headers: Object.fromEntries(response.headers.entries())
        });
        if (response.status === 401) {
            console.error('Authentication failed - token may be expired or invalid');
            throw new Error(`401 Unauthorized: ${response.statusText} - Check console for details`);
        }
    }

    // =============================================================================
    // CORE CRUD OPERATIONS - FOR CATEGORY MANAGEMENT PAGE
    // =============================================================================

    async createCategory(categoryData: CategoryInsertDTO): Promise<CategoryReadOnlyDTO> {
        try {
            const response = await fetch(`${API_BASE_URL}`, {
                method: 'POST',
                headers: {
                    ...this.getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoryData)
            });

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error('Validation errors');
                }
                if (response.status === 401) {
                    this.handleAuthError(response);
                    throw new Error('Authentication failed - please log in again');
                }
                if (response.status === 409) {
                    throw new Error('Category with name already exists');
                }
                throw new Error(`Failed to create category: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Create category error:', error);
            throw error;
        }
    }

    async updateCategory(categoryData: CategoryUpdateDTO): Promise<CategoryReadOnlyDTO> {
        try {
            const response = await fetch(`${API_BASE_URL}/${categoryData.categoryId}`, {
                method: 'PUT',
                headers: {
                    ...this.getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoryData)
            });

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error('Validation errors');
                }
                if (response.status === 401) {
                    this.handleAuthError(response);
                    throw new Error('Authentication failed - please log in again');
                }
                if (response.status === 404) {
                    throw new Error('Category not found');
                }
                if (response.status === 409) {
                    throw new Error('Category with name already exists');
                }
                throw new Error(`Failed to update category: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Update category error:', error);
            throw error;
        }
    }

    async deleteCategory(categoryId: number): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/${categoryId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.handleAuthError(response);
                    throw new Error('Authentication failed - please log in again');
                }
                if (response.status === 403) {
                    throw new Error('Access denied - requires ADMIN role');
                }
                if (response.status === 404) {
                    throw new Error('Category not found');
                }
                throw new Error(`Failed to delete category: ${response.status}`);
            }
        } catch (error) {
            console.error('Delete category error:', error);
            throw error;
        }
    }

    async getCategoryById(categoryId: number): Promise<CategoryReadOnlyDTO> {
        try {
            const response = await fetch(`${API_BASE_URL}/${categoryId}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.handleAuthError(response);
                    throw new Error('Authentication failed - please log in again');
                }
                if (response.status === 404) {
                    throw new Error('Category not found');
                }
                throw new Error(`Failed to get category: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get category by ID error:', error);
            throw error;
        }
    }

    // =============================================================================
    // CATEGORY VIEWING AND DETAILS - FOR CATEGORY MANAGEMENT PAGE
    // =============================================================================

    async getCategoriesFilteredPaginated(filters: {
        name?: string;
        isActive?: boolean;
        page?: number;
        pageSize?: number;
        sortBy?: string;
        sortDirection?: string;
    }): Promise<Paginated<CategoryReadOnlyDTO>> {
        try {
            const queryParams = new URLSearchParams();

            if (filters.name) queryParams.append('name', filters.name);
            if (filters.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
            if (filters.page !== undefined) queryParams.append('page', filters.page.toString());
            if (filters.pageSize !== undefined) queryParams.append('pageSize', filters.pageSize.toString());
            if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
            if (filters.sortDirection) queryParams.append('sortDirection', filters.sortDirection);

            const response = await fetch(`${API_BASE_URL}?${queryParams}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.handleAuthError(response);
                    throw new Error('Authentication failed - please log in again');
                }
                throw new Error(`Failed to get categories: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get categories filtered paginated error:', error);
            throw error;
        }
    }

    async getCategoryDetailedView(categoryId: number): Promise<CategoryDetailedViewDTO> {
        try {
            const response = await fetch(`${API_BASE_URL}/${categoryId}/details`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.handleAuthError(response);
                    throw new Error('Authentication failed - please log in again');
                }
                if (response.status === 404) {
                    throw new Error('Category not found');
                }
                throw new Error(`Failed to get category detailed view: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get category detailed view error:', error);
            throw error;
        }
    }

    // =============================================================================
    // DROPDOWN AND SELECTION ENDPOINTS - FOR PRODUCT FORMS
    // =============================================================================

    async getCategoriesForDropdown(): Promise<CategoryForDropdownDTO[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/dropdown`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.handleAuthError(response);
                    throw new Error('Authentication failed - please log in again');
                }
                throw new Error(`Failed to get categories dropdown: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Categories dropdown error:', error);
            throw error;
        }
    }
}

// Export a singleton instance
export const categoryService = new CategoryService();