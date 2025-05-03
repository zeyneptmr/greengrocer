import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import noResultsImage from '../assets/noresult.png';
import { LanguageContext } from "../context/LanguageContext";

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

const API_BASE_URL = "http://localhost:8080";

const SearchResults = () => {
    const location = useLocation();
    const { language } = useContext(LanguageContext); // ✅ Dili alıyoruz
    const [results, setResults] = useState([]);

    const queryFromState = location.state?.query;
    const queryFromURL = new URLSearchParams(window.location.search).get("query");
    const query = queryFromState || queryFromURL || "unknown search";

    const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));

    const getImageFromPath = (path) => {
        if (!path) return null;

        if (path.startsWith("data:image")) {
            return path;
        }
        const filename = path.split('/').pop();
        const imagePath = Object.keys(images).find(key => key.includes(filename.split('.')[0]));
        if (!imagePath) {
            console.error(`Resim bulunamadı: ${filename}`);
            return '/placeholder.png';
        }
        return images[imagePath] || '/placeholder.png';
    };

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/products/search/name?productName=${query}&language=${language}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                const formattedResults = data.map(product => ({
                    id: product.id,
                    name: product.translatedName,
                    price: product.price,
                    stock: product.stock,
                    image: product.imagePath,
                    category: product.category
                }));

                setResults(formattedResults);

            } catch (error) {
                console.error("Arama sonuçları alınırken hata:", error);
                setResults([]);
            }
        };

        if (query) {
            fetchSearchResults();
        }

    }, [query, language]);

    const noResultsTitle = language === "tr"
        ? `"${query}" için sonuç bulunamadı :(`
        : `No results found for "${query}" :(`;

    if (results.length === 0) {
        return (
            <div className="text-center p-6">
                <h2 className="text-4xl mt-4">{noResultsTitle}</h2>
                <p className="mt-4 text-lg">
                    {language === "tr"
                        ? <>
                            Lütfen kelimeyi doğru yazdığınızdan emin olun.<br/>
                            Farklı bir kelimeyle aramayı deneyin.
                        </>
                        : <>
                            Please make sure the word is spelled correctly.<br/>
                            Try searching with a different keyword.
                        </>
                    }
                </p>
                <img
                    src={noResultsImage}
                    alt={language === "tr" ? "Sonuç bulunamadı" : "Product not found"}
                    className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/10 mx-auto object-cover"
                />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
                {language === "tr" ? "Arama Sonuçları" : "Search Results"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
                {results.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={{
                            id: product.id,
                            name: product.name,
                            price: formatPrice(product.price),
                            image: getImageFromPath(product.image),
                            stock: product.stock,
                            category: product.category
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
