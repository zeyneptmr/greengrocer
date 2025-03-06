import React from "react";
import { Link } from "react-router-dom";
import { Home, Users, Settings, LogOut, BarChart } from "lucide-react";
import adminIcon from '../assets/admin.svg';
import DisplayProducts from "../components/DisplayProducts";
import Sidebar from "../components/Sidebar";
import allproducts from "../data/products";

const categorizeProducts = (products) => {
    return products.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
    }, {});
};

const DisplayProductsPage = () => {
    const categorizedProducts = categorizeProducts(allproducts);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
                    <h1 className="text-2xl font-semibold text-gray-700">All Products</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-500">Admin Panel</span>
                        <img src={adminIcon} alt="Admin" className="rounded-full w-10 h-10" />
                    </div>
                </header>

                {/* Products Section */}
                <div className="p-6 space-y-6 overflow-y-auto">
                    {Object.entries(categorizedProducts).map(([category, products]) => (
                        <div key={category} className="mb-6">
                            <DisplayProducts products={products} />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default DisplayProductsPage;