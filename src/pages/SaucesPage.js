import { useState, useEffect, useContext } from "react";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import SlideBar from "../components/SliderBar";
import sauces1 from '../assets/sauces1.jpg';
import sauces2 from '../assets/sauces2.jpg';
import { LanguageContext } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";
import { getImageFromPath } from "../helpers/imageHelper";

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

const SaucesPage = () => {
    const { language } = useContext(LanguageContext);
    const [columns, setColumns] = useState(4);
    const [sortOption, setSortOption] = useState("default");
    const [sauces, setSauces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation('sauces');

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));

    useEffect(() => {
        const fetchSauces = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/api/products?language=${language}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                const sauceProducts = data.filter(product =>
                    product.category.toLowerCase() === "sauces"
                );
                setSauces(sauceProducts);
                setError(null);
            } catch (err) {
                setError('Failed to fetch products: ' + err.message);
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSauces();
    }, [language]);

    useEffect(() => {
        if (sauces.length === 0) return;

        let sortedArray = [...sauces];

        if (sortOption === "price-asc") {
            sortedArray.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-desc") {
            sortedArray.sort((a, b) => b.price - a.price);
        } else if (sortOption === "name-asc") {
            sortedArray.sort((a, b) => a.translatedName.localeCompare(b.translatedName));
        } else if (sortOption === "name-desc") {
            sortedArray.sort((a, b) => b.translatedName.localeCompare(a.translatedName));
        }

        setSauces(sortedArray);
    }, [sortOption]);

    // Pagination hesaplamaları
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sauces.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(sauces.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const slideItems = [
        { image: sauces1, name: "sauces1" },
        { image: sauces2, name: "sauces2" },
    ];

    return (
        <div className="p-4 sm:p-6">
            <SlideBar items={slideItems} />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-orange-500 text-center mt-10 sm:mt-16 md:mt-20">{t("title")}</h2>
            <FilterBar
                columns={columns}
                setColumns={setColumns}
                setSortOption={setSortOption}
            />
            {loading && <p className="text-center py-8">{t("loading")}</p>}
            {error && <p className="text-center text-red-500 py-8">{t("error")} {error}</p>}
            {!loading && !error && (
                <div>
                    <div className={`grid gap-4 
                        ${columns === 4 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"}
                        justify-items-center w-full`}>
                        {currentItems.length > 0 ? (
                            currentItems.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={{
                                        id: product.id,
                                        name: product.translatedName,
                                        price: formatPrice(product.price),
                                        image: getImageFromPath(product.imagePath, images),
                                        stock: product.stock,
                                        category: product.category
                                    }}
                                />
                            ))
                        ) : (
                            <p className="col-span-full text-center py-8">{t("noProducts")}</p>
                        )}
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex justify-center mt-8">
                        <button
                            className="px-5 py-2 mx-2 bg-yellow-500 text-white rounded-full shadow-md hover:bg-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : currentPage)}
                            disabled={currentPage === 1}
                        >
                            {t("prev")}
                        </button>
                        <span className="px-5 py-2 text-gray-700 font-medium">{currentPage} / {totalPages}</span>
                        <button
                            className="px-5 py-2 mx-2 bg-yellow-500 text-white rounded-full shadow-md hover:bg-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : currentPage)}
                            disabled={currentPage === totalPages}
                        >
                            {t("next")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SaucesPage;
