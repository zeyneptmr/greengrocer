
import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";
import managerIcon from "../assets/manager.svg";
import AdminSearchBar from "../components/AdminSearchBar";
import allproducts from "../data/products";
import { FaCheckCircle } from 'react-icons/fa';
import { FaTimesCircle } from 'react-icons/fa';

const Inventory = () => {
    // LocalStorage'dan ürünleri çekmek
    const getProductsFromStorage = () => {
        try {
            const storedProducts = localStorage.getItem('products');
            return storedProducts ? JSON.parse(storedProducts) : allproducts;
        } catch (error) {
            console.error("Error loading products from localStorage:", error);
            return allproducts;
        }
    };

    // State'ler
    const [products, setProducts] = useState(getProductsFromStorage());
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [stockInput, setStockInput] = useState(100); // Stok girişi için state
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Error message state

    // Ürünleri localStorage'a kaydetmek
    {/* useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);  */}

    // Stok miktarını güncelleme fonksiyonu
    const updateProductStock = (id, newStock) => {
        const updatedProducts = products.map(product =>
            product.id === id ? { ...product, stock: isNaN(newStock) ? 0 : newStock } : product
        );
        setProducts(updatedProducts); // Stok güncellendikten sonra state'i güncelliyoruz
    };

    // Tüm stokları aynı anda güncelleme fonksiyonu
    const updateAllProductStocks = (newStock) => {
        if (isNaN(newStock) || newStock === '') {
            setErrorMessage('Please enter a valid number.');
            setTimeout(() => {
                setErrorMessage(''); // Error mesajını 3 saniye sonra kaldır
            }, 3000);// Set error message
            return; // Exit if the input is invalid
        }
        const updatedProducts = products.map(product => ({
            ...product,
            stock: newStock
        }));
        setProducts(updatedProducts); // Tüm ürünlerin stoklarını güncelliyoruz
    };

    // Stok ekleme fonksiyonu (Kullanıcının girdiği miktar kadar stok ekler)
    const addStockToAllProducts = (addAmount) => {

        const amountToAdd = parseInt(addAmount);
        if (isNaN(amountToAdd)) {
            // Eğer girilen miktar geçersizse (NaN ise), hiçbir şey yapma
            return;
        }
        const updatedProducts = products.map(product => ({
            ...product,
            stock: product.stock + addAmount // Mevcut stok + girilen miktar
        }));
        setProducts(updatedProducts); // Tüm ürünlerin stoklarını arttırıyoruz
    };

    // Tüm stokları kaydetme fonksiyonu
    const saveAllStocks = () => {
        localStorage.setItem('products', JSON.stringify(products)); // Tüm ürünleri güncellenmiş stoklarla kaydet
        setSuccessMessage(true);

        setTimeout(() => {
            setSuccessMessage(false);
        }, 3000);// Kullanıcıya başarı mesajı
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
                    <h1 className="text-2xl font-semibold text-gray-700">Product Inventory</h1>

                    <div className="flex items-center space-x-4">
                        <span className="text-gray-500">Manager Panel</span>
                        <img src={managerIcon} alt="Admin" className="rounded-full w-14 h-18"/>
                    </div>
                </header>

                {/* Admin Search Bar */}
                <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
                    <AdminSearchBar
                        products={products}
                        setFilteredProductsList={setFilteredProducts}
                    />
                </div>

                {/* Display Products and Stock Management */}
                <div className="px-6 py-4 overflow-y-auto flex-1">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="bg-white p-4 rounded shadow-md">
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-32 h-32 object-contain"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                <p className="text-gray-500">Price: ₺{product.price}</p>
                                <div className="flex items-center space-x-2 mt-4">
                                    <span className="text-gray-700">Stock: {product.stock}</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={product.stock}
                                        onChange={(e) => updateProductStock(product.id, parseInt(e.target.value))}
                                        className="w-16 p-1 border border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stock Input and Save Buttons */}
                    <div className="mt-6 text-right">
                        <div className="mb-4">
                            <input
                                type="number"
                                value={stockInput}
                                onChange={(e) => setStockInput(parseInt(e.target.value))} // Stok miktarını güncelle
                                min="0"
                                className="w-32 p-2 border border-gray-300 rounded"
                            />
                        </div>

                        {/* Error Message Box */}
                        {errorMessage && (
                            <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg flex items-center shadow-md">
                                <FaTimesCircle className="h-8 w-8 text-red-600 mr-3" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* Butonlar için düzen */}
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => updateAllProductStocks(stockInput)} // Kullanıcının girdiği değeri kullan
                                className="px-6 py-3 bg-orange-500 text-white rounded-3xl text-lg shadow-md hover:bg-orange-600 transition-transform transform hover:scale-105"
                            >
                                Set All Stocks
                            </button>

                            <button
                                onClick={() => addStockToAllProducts(stockInput)} // Stokları ekle
                                className="px-6 py-3 bg-yellow-500 text-white rounded-3xl text-lg shadow-md hover:bg-yellow-600 transition-transform transform hover:scale-105"
                            >
                                Add Stock to All
                            </button>
                        </div>

                        {/* Save All Stocks butonu */}
                        <button
                            onClick={saveAllStocks}
                            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-3xl text-lg shadow-md hover:bg-green-forest transition-transform transform hover:scale-105"
                        >
                            Save All Stocks
                        </button>
                        {successMessage && (
                            <div className="absolute top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg flex items-center shadow-md">
                                <FaCheckCircle className="h-8 w-8 text-green-600 mr-3" />
                                <span>Stocks saved successfully!</span>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Inventory;

