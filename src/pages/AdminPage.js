import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import adminIcon from '../assets/admin.svg';
import Clock from "../components/Clock";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ProductStorage from "../helpers/ProductStorage"; // Update this path to match your project structure

const AdminPage = () => {
    const location = useLocation();
    const pageTitle = location.pathname.includes("manager") ? "Manager Panel" : "Admin Panel";
    const [categoryStats, setCategoryStats] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    
    useEffect(() => {
        // Get products from local storage
        const products = ProductStorage.getProducts();
        setTotalProducts(products.length);
        
        // Calculate category counts
        const categoryMap = {};
        products.forEach(product => {
            const category = product.category.toUpperCase();
            categoryMap[category] = (categoryMap[category] || 0) + 1;
        });
        
        // Convert to array for display
        const categoryArray = Object.entries(categoryMap).map(([name, count]) => ({
            name,
            count
        })).sort((a, b) => b.count - a.count); // Sort by count descending
        
        setCategoryStats(categoryArray);
        
    }, []);

    // Define category colors for visual variety
    const getCategoryColor = (index) => {
        const colors = [
            "bg-blue-200 text-blue-800 border-blue-200",
            "bg-green-200 text-green-800 border-green-200",
            "bg-purple-200 text-purple-800 border-purple-200",
            "bg-orange-200 text-orange-800 border-orange-200",
            "bg-red-200 text-red-800 border-red-200",
            "bg-yellow-200 text-yellow-800 border-yellow-200"
            
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Admin Panel */}
                <div className="h-full">
                    <Sidebar />
                </div>
            
            <main className="flex-1 flex flex-col h-screen overflow-auto bg-gray-100">
                {/* TopBar Component */}
                <Topbar/>
                
                <div className="p-6 pb-24">
                    <div className="grid grid-cols-3 gap-6 mb-6">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-2xl font-bold text-green-700">Today</h3>
                            <p className="text-2xl text-gray-500 font-medium"><Clock/></p>
                        </div>
                        
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-2xl font-bold text-green-700">Total Sales</h3>
                            <p className="text-2xl text-gray-500 font-medium">45,300 TL</p>
                        </div>
                        
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-2xl font-bold text-green-700">Total Number of Products</h3>
                            <p className="text-2xl text-gray-500 font-medium">{totalProducts}</p>
                        </div>
                    </div>
                    
                    {/* Category Statistics Section */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-green-700 mb-4">Products by Category</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoryStats.map((category, index) => (
                                <div 
                                    key={category.name} 
                                    className={`rounded-lg p-4 border ${getCategoryColor(index)} flex justify-between items-center`}
                                >
                                    <div>
                                        <h3 className="font-semibold text-lg">{category.name}</h3>
                                        <p className="text-sm opacity-75">Category</p>
                                    </div>
                                    <div className="text-3xl font-bold">{category.count}</div>
                                </div>
                            ))}
                        </div>
                        
                        {categoryStats.length === 0 && (
                            <div className="text-center py-6 text-gray-500">
                                No product categories found
                            </div>
                        )}
                    </div>
                    
                    {/* Category Distribution Chart Section */}
                    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                        <h2 className="text-2xl font-bold text-green-700 mb-4">Category Distribution</h2>
                        
                        <div className="flex flex-wrap gap-2">
                            {categoryStats.map((category, index) => {
                                const percentage = (category.count / totalProducts) * 100;
                                return (
                                    <div key={category.name} className="w-full mb-3">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-medium">{category.name}</span>
                                            <span className="text-sm text-gray-500">{category.count} products ({percentage.toFixed(1)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div 
                                                className={`h-4 rounded-full ${getCategoryColor(index).split(" ")[0]}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;