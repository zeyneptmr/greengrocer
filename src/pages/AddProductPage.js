import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Users, Settings, LogOut, BarChart } from "lucide-react";
import adminIcon from '../assets/admin.svg';
import allproducts from "../data/products"; 

const AddProductPage = () => {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        category: "",
        image: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePriceChange = (e) => {
        let priceValue = parseFloat(e.target.value);

        if (priceValue < 0) {
            priceValue = 0;
        }

        setProduct((prev) => ({
            ...prev,
            price: priceValue.toString(),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        allproducts.push({ ...product, id: allproducts.length + 1 }); 
        console.log("Yeni Ürün Eklendi:", product);
    };


    const categories = [...new Set(allproducts.map(product => product.category.toUpperCase()))];

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
                    <h1 className="text-2xl font-semibold text-gray-700">Add New Product</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-500">Admin Panel</span>
                        <img src={adminIcon} alt="Admin" className="rounded-full w-10 h-10" />
                    </div>
                </header>

                {/* Form Section */}
                <div className="p-6 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            
                            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-600 uppercase">Product Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-64 border border-gray-300 rounded-lg text-sm"
                                    required
                                />
                            </div>

                            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-600 uppercase">Price</label>
                                <div className="flex items-center">
                                    <input
                                        id="price"
                                        type="number"
                                        name="price"
                                        value={product.price}
                                        onChange={handlePriceChange}  
                                        className="mt-1 p-2 w-32 border border-gray-300 rounded-l-lg text-sm"
                                        required
                                    />
                                    <span className="bg-gray-200 text-gray-600 rounded-r-lg py-2 px-4 ml-2">TL</span>
                                </div>
                            </div>
                        </div>


                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-600 uppercase">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={product.category}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-64 border border-gray-300 rounded-lg text-sm"
                                    required
                                >
                                    <option value="">Kategori Seç</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                                <label htmlFor="image" className="block text-sm font-medium text-gray-600 uppercase">Product Image URL</label>
                                <input
                                    id="image"
                                    type="text"
                                    name="image"
                                    value={product.image}
                                    onChange={handleChange}
                                    className="mt-1 p-3 w-72 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                        </div>

                      
                        <button type="submit" className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 mt-6 text-sm">
                            Ürünü Ekle
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddProductPage;
