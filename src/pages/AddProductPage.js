import React, { useState, useEffect, useContext } from "react";
import { Upload, CheckCircle } from "lucide-react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import adminIcon from '../assets/admin.svg';
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../context/LanguageContext";


const API_URL = "http://localhost:8080";

const AddProductPage = () => {
    const [product, setProduct] = useState({
        productName: "",
        price: "",
        category: "",
        imagePath: "",
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { t } = useTranslation("addproduct");
    const { language } = useContext(LanguageContext);


    useEffect(() => {
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


    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/products`);
            const products = response.data;
            
            
            const uniqueCategories = [...new Set(products.map(product => product.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const getTranslatedCategory = (category) => {
        const key = category?.toLowerCase().replace(/\s+/g, "_");
        return t(`categories.${key}`, category);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProduct((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "productName" && {
                productKey: value.trim().toLowerCase().replace(/\s+/g, "_")
            })
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post("http://localhost:8080/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const savedPath = response.data.filePath;  

            setProduct(prev => ({
                ...prev,
                imagePath: savedPath  
            }));

            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

        } catch (error) {
            console.error("Upload failed:", error);
            alert("Image upload failed!");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        
        if (!product.productName || !product.price || !product.category || !product.imagePath) {
            alert(t("fillAllFields"));
            setIsLoading(false);
            return;
        }

        try {

            const productToSave = {
                productName: product.productName,
                productKey: product.productKey,
                price: parseFloat(product.price),
                category: product.category,
                imagePath: product.imagePath,
                stock: 100
            };



            await axios.post(`${API_URL}/api/products`, productToSave);

    
            setShowNotification(true);

        
            setProduct({
                productName: "",
                price: "",
                category: "",
                imagePath: "",
            });
            setImagePreview(null);
        } catch (error) {
            console.error("Error adding product:", error);
            alert(t("addFailed"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden relative">

            {showNotification && (
                <div className="absolute top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg flex items-center shadow-md z-50">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                    <span>{t("addedSuccess")}</span>
                </div>
            )}

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
                    <h1 className="text-2xl font-semibold text-gray-700 pt-10">{t("addProduct")}</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-500">{t("adminPanel")}</span>
                        <img src={adminIcon} alt="Admin" className="rounded-full w-32 h-28" />
                    </div>
                </header>

                {/* Form Section */}
                <div className="p-6 space-y-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Product Name Input */}
                            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-600 uppercase">{t("productName")}</label>
                                <input
                                    id="productName"
                                    type="text"
                                    name="productName"
                                    value={product.productName}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-64 border border-gray-300 rounded-lg text-sm"
                                    required
                                />
                            </div>

                            {/* Price Input */}
                            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-600 uppercase">{t("price")}</label>
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
                                <label htmlFor="category" className="block text-sm font-medium text-gray-600 uppercase text-center">{t("category")}</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={product.category}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-64 border border-gray-300 rounded-lg text-sm"
                                    required
                                >
                                    <option value="">{t("chooseCategory")}</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {getTranslatedCategory(category)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Image Upload */}
                            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                                <label htmlFor="image" className="block text-sm font-medium text-gray-600 uppercase mb-2">{t("productImage")}</label>
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
                                            alt="Preview" 
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-500">
                                            <Upload size={32} />
                                            <span className="mt-2">{t("uploadImage")}</span>
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
                            {isLoading ? t("addingProduct") : t("addProductButton")}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddProductPage;