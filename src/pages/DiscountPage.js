import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";
import managerIcon from "../assets/manager.svg";
import AdminSearchBar from "../components/AdminSearchBar";
import axios from "axios";
import {FaCheckCircle, FaTimesCircle} from "react-icons/fa";

const DiscountPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [discountRate, setDiscountRate] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false); // "Select All" butonu durumu


    // Bildirimler için state
    const [successNotification, setSuccessNotification] = useState('');
    const [errorNotification, setErrorNotification] = useState('');

    const categories = ["Fruits", "Vegetables", "Baked Goods", "Olives & Oils", "Sauces", "Dairy"];

    const categoryMap = {
        "Fruits": "fruits",
        "Vegetables": "vegetables",
        "Baked Goods": "bakedgoods",
        "Olives & Oils": "olivesoils",
        "Sauces": "sauces",
        "Dairy": "dairy"
    };

    const importAll = (r) => {
        let images = {};
        r.keys().forEach((item) => {
            images[item.replace('./', '')] = r(item);
        });
        return images;
    };

    const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));

    const formatPrice = (price) => {
        if (typeof price === "number") {
            return price.toFixed(2);
        }
        return parseFloat(price).toFixed(2);
    };

    const getImageFromPath = (path) => {
        if (!path) return null;

        if (path.startsWith("data:image")) {
            return path;  // Base64 görseli döndür
        }

        const filename = path.split('/').pop(); 
        const imagePath = Object.keys(images).find(key => key.includes(filename.split('.')[0]));

        if (!imagePath) {
            console.error(`Image not found: ${filename}`);
            return '/placeholder.png';  // Placeholder görseli
        }

        return images[imagePath] || '/placeholder.png';
    };

    const fetchAllProducts = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/products');
            setProducts(res.data);
            setFilteredProducts(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            setErrorMessage("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    const fetchProductsByCategory = async (category) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/products/search/category`, {
                params: { category }
            });
            setFilteredProducts(res.data);  
        } catch (error) {
            console.error("Category fetch error:", error);
        }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const handleCategoryChange = (e) => {
        const selectedLabel = e.target.value;
        setSelectedCategory(selectedLabel);
        const apiCategory = categoryMap[selectedLabel];
        if (apiCategory) {
            fetchProductsByCategory(apiCategory);
        } else {
            fetchAllProducts();
        }
    };

    const addDiscountedProduct = async (product, discountedPrice) => {
        try {
        
            const res = await axios.post('http://localhost:8080/api/discountedProducts', {
                product: { id: product.id },
                oldPrice: product.price,
                discountedPrice: parseFloat(discountedPrice),
                discountRate: parseInt(discountRate),
                discountDate: new Date().toISOString(),
                active: true
            });
            console.log("Discounted product added:", res.data);
            return res.data;
        } catch (error) {
            console.error("Error adding discounted product:", error);
            throw error;
        }
    };
    
    const handleProductSelection = (productId) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSelectAll = () => {
        if (selectAllChecked) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(filteredProducts.map(product => product.id));
        }
        setSelectAllChecked(!selectAllChecked); // Toggle "Select All" state
    };

    const handleDiscountChange = (e) => {
        // Sadece sayıları kabul et, ve yüzdeyi 99 ile sınırla
        const value = e.target.value;

        // Sadece rakamları kabul et ve nokta, virgül, +, - gibi karakterlere izin verme
        if (/^\d*$/.test(value) && (value === '' || parseInt(value) <= 99)) {
            setDiscountRate(value);
        }
    };

    const applyDiscount = async () => {
        // Eğer discountRate içinde sayı dışı bir karakter varsa
        if (!/^\d+$/.test(discountRate)) { // Sadece tam sayılara izin verir
            setErrorNotification('Please enter valid number of rate!');
            setTimeout(() => setErrorNotification(''), 3000);  // Bildirimi 3 saniye sonra kaybet
            return;
        }

        if (parseInt(discountRate) > 99) {
            setErrorNotification('Discount rate cannot be more than 99%.');
            setTimeout(() => setErrorNotification(''), 3000);
            return;
        }

        if (selectedProducts.length === 0) {
            setErrorNotification('Please make a selection');
            setTimeout(() => setErrorNotification(''), 3000);  // Bildirimi 3 saniye sonra kaybet
            return;
        }

        const discountedProducts = filteredProducts.filter(product => selectedProducts.includes(product.id));
        console.log("İndirim uygulanan ürünler:", discountedProducts);

        try {
            const updatedDiscountedProducts = await Promise.all(discountedProducts.map(async (product) => {
                // İndirimli fiyatı hesapla
                const discountedPrice = (product.price * (1 - discountRate / 100)).toFixed(2);
                
                // Ürün fiyatını güncelle
                await axios.patch(`http://localhost:8080/api/products/${product.id}/update-price`, {
                    price: parseFloat(discountedPrice)
                });
                
            
                const discountInfo = await addDiscountedProduct(product, discountedPrice);
                
                
                return { 
                    ...product, 
                    discountedPrice: parseFloat(discountedPrice),
                    discountId: discountInfo.id 
                };
            }));
            
            // Güncellenmiş ürünlerin fiyatlarını filteredProducts'a yansıt
            const updatedProducts = filteredProducts.map(product => {
                // Eğer ürün indirimli ise, güncellenmiş fiyatı ekle
                const updatedProduct = updatedDiscountedProducts.find(updated => updated.id === product.id);
                return updatedProduct ? { 
                    ...product, 
                    discountedPrice: updatedProduct.discountedPrice,
                    discountId: updatedProduct.discountId
                } : product;
            });

    
            setFilteredProducts(updatedProducts);


            setSelectedProducts([]);
            setSelectAllChecked(false);
            
            
            setSuccessNotification('Discount applied successfully! Prices will automatically revert after 24 hours.');
            setTimeout(() => setSuccessNotification(''), 5000);  
            console.log("Discount applied successfully!");
        } catch (error) {
            console.error("Discount application failed:", error);
            setErrorNotification("Discount application failed: " + (error.response?.data?.message || error.message));
            setTimeout(() => setErrorNotification(''), 5000);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
                    <h1 className="text-2xl font-semibold text-gray-700">Discount & Campaign</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-500">Manager Panel</span>
                        <img src={managerIcon} alt="Admin" className="rounded-full w-14 h-18"/>
                    </div>
                </header>

                <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
                    <AdminSearchBar
                        products={products}
                        setFilteredProductsList={setFilteredProducts}
                    />
                </div>

                <div className="px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Discounts</h2>
                    
                    <div className="bg-blue-50 border-l-4 border-blue-700 p-4 mb-6">
                        <p className="text-blue-700">
                            All discounts applied here will automatically expire after 24 hours. 
                            Products will return to their original prices automatically.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex flex-col">
                            <label className="mb-1 text-sm text-gray-600">Discount Rate (%)</label>
                            <input
                                type="number"
                                value={discountRate}
                                onChange={handleDiscountChange}
                                placeholder="Enter rate (1-99)"
                                className="border px-3 py-2 rounded w-48"
                            />
                        </div>
                        
                        <div className="flex flex-col">
                            <label className="mb-1 text-sm text-gray-600">Filter by Category</label>
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="p-2 border rounded"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="flex items-end">
                            <button onClick={handleSelectAll}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                {selectAllChecked ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={applyDiscount}
                                disabled={!discountRate || selectedProducts.length === 0}
                                className={`px-4 py-2 rounded text-white 
                                ${(!discountRate || selectedProducts.length === 0) 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-500 hover:bg-green-600'}`}
                            >
                                Apply Discount
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <div className="grid grid-cols-12 p-4 bg-gray-100 font-medium text-gray-700 border-b">
                            <div className="col-span-1"></div>
                            <div className="col-span-2">Image</div>
                            <div className="col-span-3">Product Name</div>
                            <div className="col-span-2">Stock</div>
                            <div className="col-span-2">Regular Price</div>
                            <div className="col-span-2">Discounted Price</div>
                        </div>

                        <div className="divide-y">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <p>Loading products...</p>
                                </div>
                            ) : errorMessage ? (
                                <div className="p-8 text-center">
                                    <p className="text-red-500">{errorMessage}</p>
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-gray-500">No products found.</p>
                                </div>
                            ) : (
                                filteredProducts.map((product) => (
                                    <div key={product.id} className="grid grid-cols-12 items-center p-4 hover:bg-gray-50">
                                        <div className="col-span-1">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product.id)}
                                                onChange={() => handleProductSelection(product.id)}
                                                className="h-5 w-5 rounded border-gray-300"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <img
                                                src={getImageFromPath(product.imagePath)}
                                                alt={product.productName}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                        </div>
                                        <div className="col-span-3 font-medium text-gray-800">
                                            {product.productName}
                                        </div>
                                        <div className="col-span-2 text-gray-600">
                                            {product.stock} units
                                        </div>
                                        <div className="col-span-2 font-medium">
                                            ${formatPrice(product.discountedPrice ? product.oldPrice : product.price)}
                                        </div>
                                        <div className="col-span-2">
                                            {product.discountedPrice ? (
                                                <div className="text-green-600 font-bold">
                                                    ${formatPrice(product.discountedPrice)}
                                                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                        {Math.round((1 - product.discountedPrice / product.price) * 100)}% off
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">—</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Success Notification */}
                    {successNotification && (
                        <div
                            className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg flex items-center shadow-md max-w-md z-50">
                            <FaCheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0"/>
                            <span>{successNotification}</span>
                        </div>
                    )}

                    {/* Error Notification */}
                    {errorNotification && (
                        <div
                            className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg flex items-center shadow-md max-w-md z-50">
                            <FaTimesCircle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0"/>
                            <span>{errorNotification}</span>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DiscountPage;