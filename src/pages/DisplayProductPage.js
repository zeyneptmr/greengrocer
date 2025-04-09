import React, { useState, useEffect } from "react";
import axios from "axios";
import adminIcon from '../assets/admin.svg';
import DisplayProducts from "../components/DisplayProducts";
import Sidebar from "../components/Sidebar";
import AdminSearchBar from "../components/AdminSearchBar";

const DisplayProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                const response = await axios.get('http://localhost:8080/api/products');
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                console.error('Error fetching products:', err);
                setProducts([]);
                setFilteredProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
                    <h1 className="text-2xl font-semibold text-gray-700 pt-10">All Products</h1> {/* Padding-top'u arttırdım */}

                    <div className="flex items-center space-x-4">
                        <span className="text-gray-500">Admin Panel</span>
                        <img src={adminIcon} alt="Admin" className="rounded-full w-10 h-10" />
                    </div>
                </header>

                {/* Admin Search Bar */}
                <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
                    <AdminSearchBar
                        products={products}
                        setFilteredProductsList={setFilteredProducts}
                    />
                </div>

                {/* Products Section */}
                <div id="search-results" className="overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-green-700 text-lg">Products are loading...</div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-10">
                            <p className="text-red-500 text-lg">Error: {error}</p>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <DisplayProducts products={filteredProducts} />
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-lg">No products found matching your search criteria</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DisplayProductsPage;