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

        const filename = path.split('/').pop(); // Örnek: "apple.jpg"
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
            setFilteredProducts(res.data);  // Filtrelenmiş ürünleri set et
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
                product: { id: product.id }, // Java tarafı nested product objesi bekliyor olabilir
                oldPrice: product.price,
                discountedPrice: discountedPrice,
                discountRate: parseInt(discountRate),
                discountDate: new Date().toISOString()
            });
            console.log("Discounted product added:", res.data);
        } catch (error) {
            console.error("Error adding discounted product:", error);
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
                const discountedPrice = (product.price * (1 - discountRate / 100)).toFixed(2);
            
                await axios.patch(`http://localhost:8080/api/products/${product.id}/update-price`, {
                    price: parseFloat(discountedPrice)
                });
            
        
                await addDiscountedProduct(product, discountedPrice);
            
                return { ...product, discountedPrice: parseFloat(discountedPrice) };
            }));
            

            // Güncellenmiş ürünlerin fiyatlarını filteredProducts'a yansıt
            const updatedProducts = filteredProducts.map(product => {
                // Eğer ürün indirimli ise, güncellenmiş fiyatı ekle
                const updatedProduct = updatedDiscountedProducts.find(updated => updated.id === product.id);
                return updatedProduct ? { ...product, discountedPrice: updatedProduct.discountedPrice } : product;
            });

            // Filtrelenmiş ürünleri, indirimli fiyatlarla güncelle
            setFilteredProducts(updatedProducts);

            setSuccessNotification('Discount applied successfully!');
            setTimeout(() => setSuccessNotification(''), 3000);  // Bildirimi 3 saniye sonra kaybet
            console.log("Discount applied successfully!");
        } catch (error) {
            console.error("Discount application failed:", error);
            setErrorMessage("Discount application failed.");
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

                    <div className="flex space-x-4 mb-4">
                        <input
                            type="number"
                            value={discountRate}
                            onChange={handleDiscountChange}
                            placeholder="Discount Rate %"
                            className="border px-3 py-2 rounded w-48"
                        />
                        <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="p-2 border rounded"
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        <button onClick={handleSelectAll}
                                className="bg-blue-500 text-white p-2 rounded"
                        >
                            {selectAllChecked ? 'Deselect All' : 'Select All'}

                        </button>

                        <button
                            onClick={applyDiscount}
                            className="bg-green-500 text-white p-2 rounded"
                        >
                            Apply Discount
                        </button>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <p>Loading...</p>
                        ) : errorMessage ? (
                            <p className="text-red-500">{errorMessage}</p>
                        ) : (
                            filteredProducts.map((product) => (
                                <div key={product.id} className="flex items-center space-x-4 p-4 border-b">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={() => handleProductSelection(product.id)}
                                    />
                                    <img
                                        src={getImageFromPath(product.imagePath)}
                                        //alt={product.productName}
                                        className="w-16 h-16 object-cover"
                                    />
                                    <div
                                        className="text-gray-700 text-sm font-medium whitespace-normal break-words max-w-[180px]">
                                        {product.productName}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">{product.ProductName}</h3>
                                        <p className="text-gray-500">Stock: {product.stock}</p>
                                        <p className="text-gray-700">Price: ${formatPrice(product.price)}</p>
                                    </div>

                                    {product.discountedPrice && (
                                        <div className="text-green-500 font-semibold">
                                            Discounted Price: ${formatPrice(product.discountedPrice)}
                                        </div>
                                    )}

                                </div>
                            ))
                        )}
                    </div>

                    {/* Success Notification */}
                    {successNotification && (
                        <div
                            className="absolute top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg flex items-center shadow-md">
                            <FaCheckCircle className="h-8 w-8 text-green-600 mr-3"/>
                            {successNotification}
                        </div>
                    )}

                    {/* Error Notification */}
                    {errorNotification && (
                        <div
                            className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg flex items-center shadow-md">
                            <FaTimesCircle className="h-8 w-8 text-red-600 mr-3"/>
                            {errorNotification}
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default DiscountPage;