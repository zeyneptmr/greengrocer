
import React, { useEffect, useState, useContext } from 'react';
import Sidebar from "../components/Sidebar";
import managerIcon from "../assets/manager.svg";
import AdminSearchBar from "../components/AdminSearchBar";
import { FaCheckCircle } from 'react-icons/fa';
import { FaTimesCircle } from 'react-icons/fa';
import { LanguageContext } from "../context/LanguageContext";
import { getImageFromPath } from "../helpers/imageHelper";

import axios from "axios";
import { useTranslation } from 'react-i18next';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [stockInput, setStockInput] = useState(100);
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const { language } = useContext(LanguageContext);
    const { t } = useTranslation('inventory');

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);


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

    useEffect(() => {
        setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
    }, [filteredProducts]);

    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/products?language=${language}`);
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setErrorMessage("Failed to load products.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [language]);


    const updateProductStock = (id, newStock) => {
        const updated = products.map(product =>
            product.id === id ? { ...product, stock: isNaN(newStock) ? 0 : newStock } : product
        );
        setProducts(updated);
        setFilteredProducts(updated);
    };


    
    const updateAllProductStocks = (newStock) => {
        if (isNaN(newStock) || newStock === '') {
            setErrorMessage(t("invalidNumber"));
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        const updated = products.map(product => ({
            ...product,
            stock: newStock
        }));

        setProducts(updated);
        setFilteredProducts(updated);
    };

    
    const addStockToAllProducts = (addAmount) => {
        const amountToAdd = parseInt(addAmount);
        if (isNaN(amountToAdd)) return;

        const updated = products.map(product => ({
            ...product,
            stock: product.stock + amountToAdd
        }));

        setProducts(updated);
        setFilteredProducts(updated);
    };


    const saveAllStocks = async () => {
        try {
            await Promise.all(products.map(product => {
                console.log(`Sending stock update for product ${product.id} with stock: ${product.stock}`);
                return axios.patch(`http://localhost:8080/api/products/${product.id}/stock`, {
                    stock: product.stock
                });
            }));
            setSuccessMessage(true);
            setTimeout(() => setSuccessMessage(false), 3000);
        } catch (err) {
            console.error("Error saving stocks:", err);
            setErrorMessage(t("errorMessage"));
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };


    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-md p-4 flex justify-between items-center">
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

                <div className="px-6 py-4 overflow-y-auto flex-1">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">{t("manageProducts")}</h2>

                    {loading ? (
                        <p className="text-center text-gray-500">{t("loadingProducts")}</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {productsToDisplay.map(product => (
                                <div key={product.id} className="bg-white p-4 rounded shadow-md">
                                    <div className="flex justify-center mb-4">
                                        <img
                                            src={getImageFromPath(product.imagePath, images)}
                                            alt={product.translatedName}
                                            className="w-32 h-32 object-contain"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold">{product.translatedName}</h3>
                                    <p className="text-gray-500">{t("price")}{formatPrice(product.price)}</p>
                                    <div className="flex items-center space-x-2 mt-4">
                                        <span className="text-gray-700">{t("stock")}</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={product.stock}
                                            onChange={(e) =>
                                                updateProductStock(product.id, parseInt(e.target.value))
                                            }
                                            className="w-16 p-1 border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                    <div className="flex justify-center mt-8">
                        <button
                            className="px-5 py-2 mx-2 bg-yellow-500 text-white rounded-full shadow-md hover:bg-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : currentPage)}
                            disabled={currentPage === 1}
                        >
                            &lt; {t("previous")}
                        </button>
                        <span className="px-5 py-2 text-gray-700 font-medium">{currentPage} / {totalPages}</span>
                        <button
                            className="px-5 py-2 mx-2 bg-yellow-500 text-white rounded-full shadow-md hover:bg-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : currentPage)}
                            disabled={currentPage === totalPages}
                        >
                            {t("next")} &gt;
                        </button>
                    </div>

                    {/* Input & buttons */}
                    <div className="mt-6 text-right">
                        <div className="mb-4">
                            <input
                                type="number"
                                value={stockInput}
                                onChange={(e) => setStockInput(parseInt(e.target.value))}
                                min="0"
                                className="w-32 p-2 border border-gray-300 rounded"
                            />
                        </div>

                        {errorMessage && (
                            <div
                                className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg flex items-center shadow-md">
                                <FaTimesCircle className="h-8 w-8 text-red-600 mr-3"/>
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => updateAllProductStocks(stockInput)}
                                className="px-6 py-3 bg-orange-500 text-white rounded-3xl text-lg shadow-md hover:bg-orange-600 transition-transform transform hover:scale-105"
                            >
                                {t("setAllStocks")}
                            </button>

                            <button
                                onClick={() => addStockToAllProducts(stockInput)}
                                className="px-6 py-3 bg-yellow-500 text-white rounded-3xl text-lg shadow-md hover:bg-yellow-600 transition-transform transform hover:scale-105"
                            >
                                {t("addStockToAll")}
                            </button>
                        </div>

                        <button
                            onClick={saveAllStocks}
                            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-3xl text-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105"
                        >
                            {t("saveAllStocks")}
                        </button>

                        {successMessage && (
                            <div
                                className="absolute top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg flex items-center shadow-md">
                                <FaCheckCircle className="h-8 w-8 text-green-600 mr-3"/>
                                <span>{t("successMessage")}</span>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Inventory;
