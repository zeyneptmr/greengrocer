import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import adminIcon from '../assets/admin.svg';
import DisplayProducts from "../components/DisplayProducts";
import Sidebar from "../components/Sidebar";
import AdminSearchBar from "../components/AdminSearchBar";
import { LanguageContext } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";

const DisplayProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categorizedProducts, setCategorizedProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const categoryRefs = useRef({}); // Scroll için referanslar

    const { language } = useContext(LanguageContext);
    const { t } = useTranslation("displayproducts");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                const response = await axios.get(`http://localhost:8080/api/products?language=${language}`);
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                console.error('Error fetching products:', err);
                setProducts([]);
                setFilteredProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [language]);

    useEffect(() => {
        if (products.length > 0) {
            const grouped = categorizeProducts(products);
            setCategorizedProducts(grouped);
        }
    }, [products]);

    const categorizeProducts = (products) => {
        return products.reduce((acc, product) => {
            const category = product.category.toUpperCase();
            if (!acc[category]) acc[category] = [];
            acc[category].push(product);
            return acc;
        }, {});
    };

    const scrollToCategory = (category) => {
        categoryRefs.current[category]?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const getTranslatedCategory = (category) => {
        return t(`categories.${category.toLowerCase()}`, category);
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
                    <h1 className="text-2xl font-semibold text-gray-700 pt-10">{t("allProducts")}</h1>

                    <div className="flex items-center space-x-4">
                        <span className="text-gray-500">{t("adminPanel")}</span>
                        <img src={adminIcon} alt="Admin" className="rounded-full w-32 h-28" />
                    </div>
                </header>

                {/* Admin Search Bar */}
                <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
                    <AdminSearchBar
                        products={products}
                        setFilteredProductsList={setFilteredProducts}
                    />
                </div>

                {/* Category Navigation Bar */}
                <div className="sticky top-0 z-10 bg-gray-50 px-6 py-3 shadow">
                    <div className="flex justify-center space-x-4 flex-wrap">
                        {Object.keys(categorizedProducts).map((category) => (
                            <button
                                key={category}
                                onClick={() => scrollToCategory(category)} // Tıklandığında scrollToCategory çağrılır
                                className="bg-white hover:bg-green-600 text-black font-medium px-6 py-2 rounded-full shadow-sm border border-gray-300 transition duration-300 mb-2 md:mb-0"
                            >
                                {getTranslatedCategory(category)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Section */}
                <div id="search-results" className="overflow-y-auto px-4 md:px-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-green-700 text-lg">{t("loading")}</div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-10">
                            <p className="text-red-500 text-lg">{t("error")}: {error}</p>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        // Display only the categorized products dynamically without repeating headings
                        Object.keys(categorizedProducts).map((category) => (
                            <div key={category} ref={(el) => (categoryRefs.current[category] = el)} className="mt-6">
                                <DisplayProducts products={categorizedProducts[category]}/>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-lg">{t("noProductsFound")}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DisplayProductsPage;
