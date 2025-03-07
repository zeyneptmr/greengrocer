import React, { useState, useEffect } from "react";
import adminIcon from '../assets/admin.svg';
import DisplayProducts from "../components/DisplayProducts";
import Sidebar from "../components/Sidebar";
import AdminSearchBar from "../components/AdminSearchBar";
import allproducts from "../data/products";

const DisplayProductsPage = () => {
    
    const getProductsFromStorage = () => {
        try {
            const storedProducts = localStorage.getItem('products');
            return storedProducts ? JSON.parse(storedProducts) : allproducts;
        } catch (error) {
            console.error("Error loading products from localStorage:", error);
            return allproducts;
        }
    };

    const [products, setProducts] = useState(getProductsFromStorage());
    const [filteredProducts, setFilteredProducts] = useState(products);
   
    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

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

                {/* Admin Search Bar */}
                <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
                    <AdminSearchBar 
                        products={products} 
                        setFilteredProductsList={setFilteredProducts} 
                    />
                </div>

                {/* Products Section */}
                <div id="search-results" className="overflow-y-auto">
                    {filteredProducts.length > 0 ? (
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