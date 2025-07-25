// src/components/ui/PageSizeSelector.tsx

import React from 'react';

interface PageSizeSelectorProps {
    currentPageSize: number;
    onPageSizeChange: (newPageSize: number) => void;
    totalElements?: number;
    className?: string;
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
                                                               currentPageSize,
                                                               onPageSizeChange,
                                                               totalElements,
                                                               className = ""
                                                           }) => {
    const pageSizeOptions = [6, 12, 24];

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.target.value, 10);
        onPageSizeChange(newPageSize);
    };

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <span className="text-sm text-gray-600">Αποτελέσματα ανά σελίδα:</span>
            <select
                value={currentPageSize}
                onChange={handlePageSizeChange}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
                {pageSizeOptions.map(size => (
                    <option key={size} value={size}>
                        {size}
                    </option>
                ))}
            </select>
            {totalElements !== undefined && (
                <span className="text-sm text-gray-500">
                    (από συνολικά {totalElements})
                </span>
            )}
        </div>
    );
};

export default PageSizeSelector;