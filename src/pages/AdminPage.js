import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Clock from "../components/Clock";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = 'http://localhost:8080';

const AdminPage = () => {
    const location = useLocation();
    const pageTitle = location.pathname.includes("manager") ? "Manager Panel" : "Admin Panel";
    const [categoryStats, setCategoryStats] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalSales, setTotalSales] = useState("0 TL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { t, i18n } = useTranslation('admin');
    
   
useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            
        
            const productsResponse = await axios.get(`${API_BASE_URL}/api/products`);
            const products = productsResponse.data;
            
            setTotalProducts(products.length);
            
    
            const categoryMap = {};
            products.forEach(product => {
                const category = product.category.toUpperCase();
                categoryMap[category] = (categoryMap[category] || 0) + 1;
            });
            
            const categoryArray = Object.entries(categoryMap).map(([name, count]) => ({
                name,
                count
            })).sort((a, b) => b.count - a.count);
            
            setCategoryStats(categoryArray);
            
        
            const salesResponse = await axios.get(`${API_BASE_URL}/api/customerorder/total-sales`);
            const totalSalesAmount = salesResponse.data;

        
            const formattedSales = totalSalesAmount.toFixed(2) + '₺';

            setTotalSales(formattedSales);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load data. Please try again later.");
            setLoading(false);
        }
    };
    
    fetchData();
}, []);

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

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-100">
                <div className="h-full">
                    <Sidebar />
                </div>
                <main className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-xl text-green-700">{t("loading_data")}</div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-100">
                <div className="h-full">
                    <Sidebar />
                </div>
                <main className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-xl text-red-600">{error}</div>
                    <button 
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => window.location.reload()}
                    >
                        {t("retry")}
                    </button>
                </main>
            </div>
        );
    }

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-lg md:text-xl font-bold text-green-700">{t("today")}</h3>
                            <p className="text-base md:text-xl text-gray-500 font-medium"><Clock/></p>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-lg md:text-xl font-bold text-green-700">{t("total_sales")}</h3>
                            <p className="text-base md:text-xl text-gray-500 font-medium">{totalSales}</p>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-lg md:text-xl font-bold text-green-700">{t("total_products")}</h3>
                            <p className="text-base md:text-xl text-gray-500 font-medium">{totalProducts}</p>
                        </div>
                    </div>

                    {/* Category Statistics Section */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-green-700 mb-4">{t("products_by_category")}</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">


                            {categoryStats.map((category, index) => (
                                <div
                                    key={category.name}
                                    className={`rounded-lg p-4 border ${getCategoryColor(index)} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2`}
                                >

                                    <div className="w-full">
                                        <h3 className="font-semibold text-lg">{t(`categories.${category.name.toLowerCase()}`, category.name)}</h3>
                                        <p className="text-sm opacity-75">{t("category")}</p>
                                    </div>
                                    <div className="text-3xl font-bold">{category.count}</div>
                                </div>
                            ))}
                        </div>

                        {categoryStats.length === 0 && (
                            <div className="text-center py-6 text-gray-500">
                                {t("no_product_categories")}
                            </div>
                        )}
                    </div>


                    {/* Category Distribution Chart Section */}
                    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                        <h2 className="text-2xl font-bold text-green-700 mb-4">{t("category_distribution")}</h2>

                        <div className="flex flex-wrap gap-2">
                            {categoryStats.map((category, index) => {
                                const percentage = (category.count / totalProducts) * 100;
                                return (
                                    <div key={category.name} className="w-full mb-3">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-medium">{t(`categories.${category.name.toLowerCase()}`, category.name)}</span>
                                            <span
                                                className="text-sm text-gray-500">{t("products", { count: category.count })} ({percentage.toFixed(1)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                                            <div
                                                className={`h-3 sm:h-4 rounded-full ${getCategoryColor(index).split(" ")[0]}`}
                                                style={{width: `${percentage}%`}}
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