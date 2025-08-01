import React, { useState, useEffect } from 'react';
import { dashboardService } from "../../../services/dashboardService.ts";
import { categoryService } from "../../../services/categoryService.ts";
import { LowStockProductItem, Card, LoadingSpinner, Input, ErrorDisplay, Button } from "../"
import { RefreshCw } from "lucide-react";
import { StockUpdateModal} from "../modals/StockUpdateModal.tsx";
import { usePagination} from "../../../hooks/usePagination.ts";
import { useSorting } from "../../../hooks/useSorting.ts";
import { cleanFilterParams } from "../../../utils/apiHelper.ts"
import type { StockAlertDTO, Paginated } from "../../../types/api/dashboardInterface.ts";
import type { CategoryForDropdownDTO } from "../../../types/api/categoryInterface.ts";


interface LowStockProductsListProps {
    onNavigate: (page: string) => void;
}

const LowStockProductsList: React.FC<LowStockProductsListProps> = ({ onNavigate }) => {
    const [data, setData] = useState<Paginated<StockAlertDTO> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryForDropdownDTO[]>([]);

    // Filter states
    const [nameOrCodeFilter, setNameOrCodeFilter] = useState('');
    const [categoryIdFilter, setCategoryIdFilter] = useState('');
    const [materialNameFilter, setMaterialNameFilter] = useState('');
    const [minStockFilter, setMinStockFilter] = useState('');
    const [maxStockFilter, setMaxStockFilter] = useState('');

    // Modal states
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<StockAlertDTO | null>(null);

    // Pagination and sort
    const { currentPage, setCurrentPage, resetPage } = usePagination();
    const { sortBy, sortDirection, handleSort } = useSorting('stock', 'ASC');

    // Load categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoriesData = await categoryService.getCategoriesForDropdown();
                setCategories(categoriesData);
            } catch (err) {
                console.error('Failed to load categories:', err);
            }
        };
        loadCategories();
    }, []);

    // Load data function
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const filterParams = {
                nameOrCode: nameOrCodeFilter.trim() || undefined,
                categoryId: categoryIdFilter ? Number(categoryIdFilter) : undefined,
                materialName: materialNameFilter.trim() || undefined,
                minStock: minStockFilter ? Number(minStockFilter) : undefined,
                maxStock: maxStockFilter ? Number(maxStockFilter) : undefined,
                page: currentPage,
                pageSize: 20,
                sortBy,
                sortDirection,
                isActive: true
            };

            const cleanParams = cleanFilterParams(filterParams);
            const response = await dashboardService.getAllLowStockProducts(cleanParams);
            setData(response);
        } catch (err) {
            setError('Failed to load low stock products');
            console.error('Low stock products error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load data when dependencies change
    useEffect(() => {
        loadData();
    }, [currentPage, sortBy, sortDirection, categoryIdFilter, minStockFilter, maxStockFilter]);

    // Debounced search for text filters
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            resetPage();
            loadData();
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [nameOrCodeFilter, materialNameFilter]);

    const handleClearFilters = () => {
        setNameOrCodeFilter('');
        setCategoryIdFilter('');
        setMaterialNameFilter('');
        setMinStockFilter('');
        setMaxStockFilter('');
        resetPage();
    };

    const handleUpdateStock = (product: StockAlertDTO) => {
        setSelectedProduct(product);
        setShowUpdateModal(true);
    };

    // Loading state
    if (loading) return <LoadingSpinner />;

    // Error state
    if (error) return <ErrorDisplay error={error} onRetry={loadData} />;

    const hasNext = data ? data.currentPage + 1 < data.totalPages : false;
    const hasPrevious = data ? data.currentPage > 0 : false;

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-white/20">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">⚠️ Προϊόντα σε χαμηλό απόθεμα</h1>
                            <p className="text-gray-700 mt-1">Διαχειριστέ τα προϊόντα που είναι σε χαμηλό απόθεμα</p>
                        </div>
                        <Button
                            onClick={() => onNavigate('dashboard')}
                            variant="secondary"
                        >
                            ← Back to Dashboard
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Όνομα/Κωδικός Προϊόντος
                            </label>
                            <Input
                                type="text"
                                value={nameOrCodeFilter}
                                onChange={(e) => setNameOrCodeFilter(e.target.value)}
                                placeholder="Search..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                value={categoryIdFilter}
                                onChange={(e) => setCategoryIdFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Min Stock
                            </label>
                            <Input
                                type="number"
                                value={minStockFilter}
                                onChange={(e) => setMinStockFilter(e.target.value)}
                                placeholder="Min..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Stock
                            </label>
                            <Input
                                type="number"
                                value={maxStockFilter}
                                onChange={(e) => setMaxStockFilter(e.target.value)}
                                placeholder="Max..."
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={handleClearFilters} variant="secondary" size="sm">
                                Clear Filters
                            </Button>
                            <Button
                                onClick={loadData}
                                variant="purple"
                                size="sm"
                                disabled={loading}
                            >
                                Refresh
                                <RefreshCw className={`w-4 h-4 ml-1 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <Card title={`Low Stock Products (${data?.totalElements || 0} total)`} icon="⚠️">
                    {data && data.data && data.data.length > 0 ? (
                        <>
                            {/* Table Header - Desktop */}
                            <div className="hidden md:grid md:grid-cols-5 gap-4 p-3 bg-gray-100 rounded-lg font-semibold text-gray-700 mb-4">
                                <button
                                    onClick={() => handleSort('name')}
                                    className="text-left hover:text-blue-600 transition-colors"
                                >
                                    Product Name {sortBy === 'name' && (sortDirection === 'ASC' ? '↑' : '↓')}
                                </button>
                                <button
                                    onClick={() => handleSort('code')}
                                    className="text-left hover:text-blue-600 transition-colors"
                                >
                                    Code {sortBy === 'code' && (sortDirection === 'ASC' ? '↑' : '↓')}
                                </button>
                                <button
                                    onClick={() => handleSort('stock')}
                                    className="text-left hover:text-blue-600 transition-colors"
                                >
                                    Current Stock {sortBy === 'stock' && (sortDirection === 'ASC' ? '↑' : '↓')}
                                </button>
                                <button
                                    onClick={() => handleSort('minStock')}
                                    className="text-left hover:text-blue-600 transition-colors"
                                >
                                    Min Stock {sortBy === 'minStock' && (sortDirection === 'ASC' ? '↑' : '↓')}
                                </button>
                                <span>Actions</span>
                            </div>

                            {/* Product List */}
                            <div className="space-y-3">
                                {data.data.map((product) => (
                                    <LowStockProductItem
                                        key={product.productId}
                                        product={product}
                                        onUpdateStock={handleUpdateStock}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {data.totalPages > 1 && (
                                <div className="flex justify-between items-center mt-6">
                                    <div className="text-sm text-gray-600">
                                        Showing {data.currentPage * 20 + 1} to {Math.min((data.currentPage + 1) * 20, data.totalElements)} of {data.totalElements} products
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={!hasPrevious}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            Previous
                                        </Button>
                                        <span className="px-3 py-1 bg-gray-100 rounded-md text-sm">
                                            Page {currentPage + 1} of {data.totalPages}
                                        </span>
                                        <Button
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={!hasNext}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">✨</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No low stock products found</h3>
                            <p className="text-gray-600 mb-4">
                                {nameOrCodeFilter || categoryIdFilter || materialNameFilter || minStockFilter || maxStockFilter
                                    ? 'Try adjusting your filters or clearing them to see more products.'
                                    : 'All products are adequately stocked!'}
                            </p>
                            <Button onClick={handleClearFilters} variant="secondary">
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Stock Update Modal */}
                {showUpdateModal && selectedProduct && (
                    <StockUpdateModal
                        isOpen={showUpdateModal}
                        onClose={() => setShowUpdateModal(false)}
                        product={selectedProduct}
                        onStockUpdated={() => {
                            loadData();
                            setShowUpdateModal(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default LowStockProductsList;