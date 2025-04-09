import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import axios from "axios";
import adminIcon from '../assets/admin.svg';
import Sidebar from "../components/Sidebar";
import AdminSearchBar from "../components/AdminSearchBar";

const UpdateProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categorizedProducts, setCategorizedProducts] = useState({});
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const importAll = (r) => {
        let images = {};
        r.keys().forEach((item) => {
          images[item.replace('./', '')] = r(item);
        });
        return images;
    };

    const formatPrice = (price) => {
        if (typeof price === "number") {
            return price.toFixed(2); 
        }
        return parseFloat(price).toFixed(2); 
    };

    const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));


    const getImageFromPath = (path) => {
        if (!path) return null;

        if (path.startsWith("data:image")) {
            return path;  // Doğrudan Base64 resmini döndür
        }

        const filename = path.split('/').pop();
        console.log("Filename extracted:", filename);

        const imagePath = Object.keys(images).find(key => key.includes(filename.split('.')[0]));  // Dosya adıyla eşleşen anahtar

        if (!imagePath) {
            console.error(`Resim bulunamadı: ${filename}`);
            return '/placeholder.png';  // Placeholder resim
        }

        console.log("Image path:", imagePath); // Bu noktada imagePath doğru olmalı
        return images[imagePath] || '/placeholder.png';
    };

    

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const grouped = categorizeProducts(filteredProducts.length > 0 ? filteredProducts : products);
        setCategorizedProducts(grouped);
    }, [filteredProducts, products]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/products');
            setProducts(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products. Please try again later.");
            setLoading(false);
        }
    };

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

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`http://localhost:8080/api/products/${productId}`);
                
                // Refetch products or update state
                const updatedProducts = products.filter(product => product.id !== productId);
                setProducts(updatedProducts);
                
                alert("The product was successfully deleted!");
            } catch (err) {
                console.error("Error deleting product:", err);
                alert("Failed to delete product. Please try again.");
            }
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="text-xl font-semibold text-gray-700">Loading products...</div>
        </div>
    );

    if (error) return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="text-xl font-semibold text-red-600">{error}</div>
        </div>
    );

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
                        <img src={adminIcon} alt="Admin" className="rounded-full w-32 h-28" />
                    </div>
                </header>

                {/* Search Bar */}
                <div className="bg-white shadow-md p-4">
                    <AdminSearchBar 
                        products={products} 
                        setFilteredProductsList={setFilteredProducts} 
                    />
                </div>

                {/* Products Section */}
                <div id="search-results" className="p-6 space-y-8 overflow-y-auto">
                    {Object.keys(categorizedProducts).length > 0 ? (
                        Object.entries(categorizedProducts).map(([category, categoryProducts]) => (
                            <div key={category} className="bg-white rounded-lg shadow-md p-4">
                                <h3 className="text-lg font-bold mb-4 text-gray-700">{category}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {categoryProducts.map((product) => (
                                        <div 
                                            id={`product-${product.id}`}
                                            key={product.id} 
                                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-colors duration-500"
                                        >
                                            <div className="w-full h-32 flex justify-center items-center">
                                                <img 
                                                    src={getImageFromPath(product.imagePath)} 
                                                    alt={product.productName} 
                                                    className="w-auto h-32 object-contain"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h4 className="text-md font-semibold mb-1">{product.productName}</h4>
                                                <p className="text-green-600 font-medium">{formatPrice(product.price)} TL</p>
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
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-lg text-gray-600">No products found matching your search criteria.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UpdateProductsPage;





