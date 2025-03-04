import React from "react";
import { Link } from "react-router-dom";
import { Home, Users, Settings, LogOut, BarChart } from "lucide-react";
import adminIcon from '../assets/admin.svg';
import DisplayProducts from "../components/DisplayProducts";
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
            <aside className="w-64 bg-green-600 text-white flex flex-col p-4 flex-shrink-0">
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
                <nav className="flex-1 overflow-y-auto">
                    <ul className="space-y-4">
                        <li>
                            <Link to="/admin" className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                                <Home size={20} />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/displayproducts" className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                                <Users size={20} />
                                <span>Products</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/editproducts" className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                                <BarChart size={20} />
                                <span>Edit Products</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/settings" className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                                <Settings size={20} />
                                <span>Settings</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="mt-auto mb-20 flex justify-center">
                    <Link to="/">
                        <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-transform duration-200 hover:scale-125">
                            <LogOut size={24} className="text-white" />
                        </button>
                    </Link>
                </div>
            </aside>

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
                            <div className="overflow-x-auto whitespace-nowrap">
                                <div className="flex space-x-4 w-max">
                                    <DisplayProducts products={products} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default DisplayProductsPage;
