import React, { useEffect, useState, useContext } from 'react';
import Sidebar from "../components/Sidebar";
import managerIcon from "../assets/manager.svg";
import AdminSearchBar from "../components/AdminSearchBar";
import axios from "axios";
import {FaCheckCircle, FaTimesCircle} from "react-icons/fa";
import { LanguageContext } from "../context/LanguageContext";
import { useTranslation } from 'react-i18next';
import { getImageFromPath } from "../helpers/imageHelper";

const DiscountPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [discountRate, setDiscountRate] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false); 
    const { language } = useContext(LanguageContext);
    const { t } = useTranslation('discount');


    
    const [successNotification, setSuccessNotification] = useState('');
    const [errorNotification, setErrorNotification] = useState('');

    const categories = [
        { key: "fruits", i18nKey: "fruits" },
        { key: "vegetables", i18nKey: "vegetables" },
        { key: "bakedgoods", i18nKey: "bakedGoods" },
        { key: "olivesoils", i18nKey: "olivesOils" },
        { key: "sauces", i18nKey: "sauces" },
        { key: "dairy", i18nKey: "dairy" }
    ];

    const categoryMap = {
        "fruits": "fruits",
        "vegetables": "vegetables", 
        "bakedgoods": "bakedgoods",
        "olivesoils": "olivesoils",
        "sauces": "sauces",
        "dairy": "dairy"
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
        if (price === undefined || price === null || isNaN(price)) {
            return "0.00"; 
        }
        if (typeof price === "number") {
            return price.toFixed(2);
        }
        return parseFloat(price).toFixed(2);
    };


    const fetchAllProducts = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/products?language=${language}`);
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
            console.log(`Fetching products for category: ${category} with language: ${language}`);
            
        
            const res = await axios.get(`http://localhost:8080/api/products?language=${language}`);
            

            const filteredByCategory = res.data.filter(product => 
                product.category && product.category.toLowerCase() === category.toLowerCase()
            );
            
            console.log(`Found ${filteredByCategory.length} products for category ${category}`);
            
            setFilteredProducts(filteredByCategory);
        } catch (error) {
            console.error("Category fetch error:", error);
        }
    };

    useEffect(() => {
        fetchAllProducts();

        setSelectedCategory('');
    }, [language]);

    const handleCategoryChange = (e) => {
        const selectedCategoryKey = e.target.value;
        setSelectedCategory(selectedCategoryKey);
        
        if (selectedCategoryKey) {
        
            console.log("Filtering by category:", selectedCategoryKey);
            fetchProductsByCategory(selectedCategoryKey);
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
        setSelectAllChecked(!selectAllChecked); 
    };

    const handleDiscountChange = (e) => {
    
        const value = e.target.value;


        if (/^\d*$/.test(value) && (value === '' || parseInt(value) <= 99)) {
            setDiscountRate(value);
        }
    };

    const applyDiscount = async () => {
        
        if (!/^\d+$/.test(discountRate)) { 
            setErrorNotification(t("validNumberMessage"));
            setTimeout(() => setErrorNotification(''), 3000); 
            return;
        }

        if (parseInt(discountRate) <= 0) {
            setErrorNotification(t("validNumberMessage"));
            setTimeout(() => setErrorNotification(''), 3000);
            return;
        }

        if (parseInt(discountRate) > 99) {
            setErrorNotification(t("maxRateMessage"));
            setTimeout(() => setErrorNotification(''), 3000);
            return;
        }

        if (selectedProducts.length === 0) {
            setErrorNotification(t("makeSelectionMessage"));
            setTimeout(() => setErrorNotification(''), 3000);  
            return;
        }

        const discountedProducts = filteredProducts.filter(product => selectedProducts.includes(product.id));
        console.log("İndirim uygulanan ürünler:", discountedProducts);

        const tooCheapProduct = discountedProducts.find(product => {
            const discountedPrice = product.price * (1 - discountRate / 100);
            return discountedPrice < 1;
        });

        if (tooCheapProduct) {
            setErrorNotification(t("minPriceMessage"));
            setTimeout(() => setErrorNotification(''), 4000);
            return;
        }

        try {
            const updatedDiscountedProducts = await Promise.all(discountedProducts.map(async (product) => {
            
                const discountedPrice = (product.price * (1 - discountRate / 100)).toFixed(2);
                
            
                await axios.patch(`http://localhost:8080/api/products/${product.id}/update-price`, {
                    price: parseFloat(discountedPrice)
                });
                
            
                const discountInfo = await addDiscountedProduct(product, discountedPrice);
                
            
                return { 
                    ...product, 
                    oldPrice: product.price, 
                    discountedPrice: parseFloat(discountedPrice),
                    discountId: discountInfo.id 
                };
            }));
            
    
            const updatedProducts = filteredProducts.map(product => {
                
                const updatedProduct = updatedDiscountedProducts.find(updated => updated.id === product.id);
                return updatedProduct ? { 
                    ...product, 
                    oldPrice: updatedProduct.oldPrice, 
                    discountedPrice: updatedProduct.discountedPrice,
                    discountId: updatedProduct.discountId
                } : product;
            });

            setFilteredProducts(updatedProducts);

            setSelectedProducts([]);
            setSelectAllChecked(false);
            
            setSuccessNotification(t("successMessage"));
            setTimeout(() => setSuccessNotification(''), 5000);  
            console.log("Discount applied successfully!");
        } catch (error) {
            console.error("Discount application failed:", error);
            setErrorNotification(t("failedMessage") + (error.response?.data?.message || error.message));
            setTimeout(() => setErrorNotification(''), 5000);
        }
    };

    
    const isDiscountRateValid = discountRate !== '' && parseInt(discountRate) > 0;

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
                    <h1 className="text-2xl font-semibold text-gray-700">{t("title")}</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-500">{t("managerPanel")}</span>
                        <img src={managerIcon} alt="Admin" className="rounded-full w-32 h-28"/>
                    </div>
                </header>

                <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
                    <AdminSearchBar
                        products={products}
                        setFilteredProductsList={setFilteredProducts}
                    />
                </div>

                <div className="px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">{t("manageDiscounts")}</h2>

                    <div className="bg-blue-50 border-l-4 border-blue-700 p-4 mb-6">
                        <p className="text-blue-700">
                        {t("discountInfo")}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex flex-col">
                            <label className="mb-1 text-sm text-gray-600">{t("discountRate")}</label>
                            <input
                                type="number"
                                value={discountRate}
                                onChange={handleDiscountChange}
                                placeholder={t('enterRate')}
                                className="border px-3 py-2 rounded w-48"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 text-sm text-gray-600">{t("filterByCategory")}</label>
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="p-2 border rounded"
                            >
                                <option value="">{t("allCategories")}</option>
                                {categories.map((category) => (
                                    <option key={category.key} value={category.key}>
                                       {t(`categories.${category.i18nKey}`)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button onClick={handleSelectAll}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                {selectAllChecked ? t('deselectAll') : t('selectAll')}
                            </button>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={applyDiscount}
                                disabled={!isDiscountRateValid || selectedProducts.length === 0}
                                className={`px-4 py-2 rounded text-white 
                                ${(!isDiscountRateValid || selectedProducts.length === 0) 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-500 hover:bg-green-600'}`}
                            >
                                {t('applyDiscount')}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <div className="grid grid-cols-12 p-4 bg-gray-100 font-medium text-gray-700 border-b">
                            <div className="col-span-1"></div>
                            <div className="col-span-2">{t('image')}</div>
                            <div className="col-span-3">{t('productName')}</div>
                            <div className="col-span-2">{t('stock')}</div>
                            <div className="col-span-2">{t('regularPrice')}</div>
                            <div className="col-span-2">{t('discountedPrice')}</div>
                        </div>

                        <div className="divide-y">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <p>{t('loadingProducts')}</p>
                                </div>
                            ) : errorMessage ? (
                                <div className="p-8 text-center">
                                    <p className="text-red-500">{errorMessage}</p>
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-gray-500">{t('noProductsFound')}</p>
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
                                                src={getImageFromPath(product.imagePath, images)}
                                                alt={product.translatedName}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                        </div>
                                        <div className="col-span-3 font-medium text-gray-800">
                                            {product.translatedName}
                                        </div>
                                        <div className="col-span-2 text-gray-600">
                                            {product.stock} {t('units')}
                                        </div>
                                        <div className="col-span-2 font-medium">
                                            ₺{formatPrice(product.discountedPrice ? product.oldPrice : product.price)}
                                        </div>
                                        <div className="col-span-2">
                                            {product.discountedPrice ? (
                                                <div className="text-green-600 font-bold">
                                                    ₺{formatPrice(product.discountedPrice)}
                                                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                        {Math.round((1 - product.discountedPrice / product.price) * 100)}{t('off')}
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