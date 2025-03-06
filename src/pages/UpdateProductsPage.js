import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Users, Settings, LogOut, BarChart, Edit, Trash2 } from "lucide-react";
import adminIcon from '../assets/admin.svg';
import Sidebar from "../components/Sidebar";
import ProductStorage from "../helpers/ProductStorage";

const UpdateProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categorizedProducts, setCategorizedProducts] = useState({});

    useEffect(() => {
       
        const allProducts = ProductStorage.getProducts();
        setProducts(allProducts);
        
     
        const grouped = categorizeProducts(allProducts);
        setCategorizedProducts(grouped);
    }, []);

    const categorizeProducts = (products) => {
        return products.reduce((acc, product) => {
         
            const category = product.category.toUpperCase();
            
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {});
    };

    const handleDelete = (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
           
            const updatedProducts = ProductStorage.deleteProduct(productId);
            
           
            setProducts(updatedProducts);
            
           
            const grouped = categorizeProducts(updatedProducts);
            setCategorizedProducts(grouped);
            
            alert("The product was successfully deleted!");
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
                    <h1 className="text-2xl font-semibold text-gray-700">Update Products</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-500">Admin Panel</span>
                        <img src={adminIcon} alt="Admin" className="rounded-full w-10 h-10" />
                    </div>
                </header>

                {/* Products Section */}
                <div className="p-6 space-y-8 overflow-y-auto">
                
                    {Object.entries(categorizedProducts).map(([category, products]) => (
                        <div key={category} className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-lg font-bold mb-4 text-gray-700">{category}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="w-full h-32 flex justify-center items-center">
                                            <img 
                                                src={product.image} 
                                                alt={product.name} 
                                                className="w-auto h-32 object-contains"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h4 className="text-md font-semibold mb-1">{product.name}</h4>
                                            <p className="text-green-600 font-medium">{parseFloat(product.price).toFixed(2)} TL</p>
                                        </div>
                                        <div className="flex border-t border-gray-200">
                                            <Link 
                                                to={`/admin/update-product/${product.id}`}
                                                className="flex-1 py-2 text-center bg-green-500 text-white hover:bg-green-600 flex items-center justify-center"
                                            >
                                                <Edit size={16} className="mr-1" />
                                                EDIT
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(product.id)}
                                                className="flex-1 py-2 text-center bg-red-500 text-white hover:bg-red-600 flex items-center justify-center"
                                            >
                                                <Trash2 size={16} className="mr-1" />
                                                DELETE
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default UpdateProductsPage;