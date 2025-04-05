import React, { useState, useEffect } from "react";
import { Upload, CheckCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import adminIcon from '../assets/admin.svg';
import ProductStorage from "../helpers/ProductStorage";
import axios from "axios"; // axios import edildi


const AddProductPage = () => {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        category: "",
        image: "",
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Kategorileri API'den çekme
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/products/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error("Kategoriler yüklenirken hata:", error);
                // Hata durumunda yedek olarak local storage'dan kategorileri al
                const localCategories = ProductStorage.getCategories();
                setCategories(localCategories);
            }
        };
        
        fetchCategories();
    }, []);

    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [showNotification]);

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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setProduct(prev => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!product.name || !product.price || !product.category || !product.image) {
            alert("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        try {
            // Ürünü API'ye gönderme
            const productData = {
                name: product.name,
                price: parseFloat(product.price),
                category: product.category,
                image: product.image, // Base64 formatında resim gönderiliyor
            };
            
            await axios.post(`http://localhost:8080/api/products/`, productData);
            
            // Başarı bildirimi gösterme
            setShowNotification(true);
            
            // Formu temizleme
            setProduct({
                name: "",
                price: "",
                category: "",
                image: "",
            });
            setImagePreview(null);
        } catch (error) {
            console.error("Ürün eklenirken hata:", error);
            alert("The product could not be added. Please try again.");
            
            // Hata durumunda yedek olarak local storage'a kaydet
            ProductStorage.addProduct(product);
            setShowNotification(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden relative">

            {showNotification && (
                <div className="absolute top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg flex items-center shadow-md z-50">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                    <span>Product added successfully!</span>
                </div>
            )}

            {/* Sidebar */}
            <Sidebar />

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
                <div className="p-6 space-y-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Product Name Input */}
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

                            {/* Price Input */}
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
                            {/* Category Dropdown */}
                            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center w-full">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-600 uppercase text-center">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={product.category}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-64 border border-gray-300 rounded-lg text-sm"
                                    required
                                >
                                    <option value="">Choose Category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Image Upload */}
                            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                                <label htmlFor="image" className="block text-sm font-medium text-gray-600 uppercase mb-2">Product Image</label>
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <label 
                                    htmlFor="image" 
                                    className="cursor-pointer flex items-center justify-center w-64 h-32 border-2 border-dashed border-gray-300 rounded-lg"
                                >
                                    {imagePreview ? (
                                        <img 
                                            src={imagePreview} 
                                            alt="Önizleme" 
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-500">
                                            <Upload size={32} />
                                            <span className="mt-2">Upload Image</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 mt-6 text-sm"
                            disabled={isLoading}
                        >
                            {isLoading ? "Product is Adding." : " Add Product"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddProductPage;