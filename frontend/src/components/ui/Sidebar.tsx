import React, { useState } from 'react';
import {SidebarProps, NavigationItem} from "../../types/components/sidebar.ts";

import {
    ShoppingCart,
    Package,
    Users,
    Layers,
    ShoppingBag,
    MapPin,
    Home,
    Menu,
    Smartphone,
    Gem,
    Truck,
    Wrench,
    Receipt,
    TrendingUp
} from 'lucide-react';


const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navigationItems: NavigationItem[] = [
        {
            id: 'dashboard',
            label: 'Αρχική',
            icon: <Home className="w-5 h-5" />,
            href: 'dashboard'
        },
        {
            id: 'manage-sales',
            label: 'Πωλήσεις',
            icon: <ShoppingCart className="w-5 h-5" />,
            href: 'manage-sales'
        },
        {
            id: 'manage-products',
            label: 'Προϊόντα',
            icon: <Package className="w-5 h-5" />,
            href: 'manage-products'
        },
        {
            id: 'customers',
            label: 'Πελάτες',
            icon: <Users className="w-5 h-5" />,
            href: 'customers'
        },
        {
            id: 'materials',
            label: 'Υλικά',
            icon: <Layers className="w-5 h-5" />,
            href: 'materials'
        },
        {
            id: 'purchases',
            label: 'Αγορές',
            icon: <ShoppingBag className="w-5 h-5" />,
            href: 'purchases'
        },
        {
            id: 'locations',
            label: 'Τοποθεσίες',
            icon: <MapPin className="w-5 h-5" />,
            href: 'locations'
        },
        {
            id: 'categories',
            label: 'Κατηγορίες',
            icon: <Gem className="w-5 h-5" />,
            href: 'categories'
        },
        {
            id: 'suppliers',
            label: 'Προμηθευτές',
            icon: <Truck className="w-5 h-5" />,
            href: 'suppliers'
        },
        {
            id: 'procedures',
            label: 'Διαδικασίες',
            icon: <Wrench className="w-5 h-5" />,
            href: 'procedures'
        }
        // ,
        // {
        //     id: 'expenses',
        //     label: 'Έξοδα',
        //     icon: <Receipt className="w-5 h-5" />,
        //     href: 'expenses'
        // },
        // {
        //     id: 'profit-losses',
        //     label: 'Κέρδη/Ζημίες',
        //     icon: <TrendingUp className="w-5 h-5" />,
        //     href: 'profit-losses'
        // }
    ];

    const handleNavigation = (page: string) => {
        onNavigate(page);
    };

    return (
        <>
            {/* Mobile overlay */}
            {!isCollapsed && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsCollapsed(true)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed left-0 top-0 h-full bg-white/10 backdrop-blur-md border-r border-white/20 
                transition-all duration-300 z-50
                ${isCollapsed ? 'w-16' : 'w-64'}
                lg:relative lg:translate-x-0
                ${isCollapsed ? 'translate-x-0' : 'translate-x-0'}
            `}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/20">

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {isCollapsed ? <Menu className="w-6 h-7" /> : <Smartphone className="w-6 h-7" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navigationItems.map((item) => {
                        const isActive = currentPage === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.id)}
                                className={`
                                    w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                                    ${isActive
                                    ? 'bg-white/20 text-white shadow-lg'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                }
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <div className="flex-shrink-0">
                                    {item.icon}
                                </div>
                                {!isCollapsed && (
                                    <span className="font-medium">{item.label}</span>
                                )}

                                {/* Active indicator */}
                                {isActive && !isCollapsed && (
                                    <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </nav>

            </div>
        </>
    );
};

export default Sidebar;