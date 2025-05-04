import { useState, useEffect, useRef, useContext } from "react";
import { Search } from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";

const AdminSearchBar = ({ products, setFilteredProductsList }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef(null);

    const { language } = useContext(LanguageContext);

    const importAll = (r) => {
        let images = {};
        r.keys().forEach((item) => {
            images[item.replace('./', '')] = r(item);
        });
        return images;
    };

    const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));

    const getImageFromPath = (path) => {
        if (!path) return null;
        if (path.startsWith("data:image")) return path;
        const filename = path.split('/').pop();
        const imagePath = Object.keys(images).find(key => key.includes(filename.split('.')[0]));
        return imagePath ? images[imagePath] : '/placeholder.png';
    };

    const formatPrice = (price) => {
        if (typeof price === "number") return price.toFixed(2);
        return parseFloat(price).toFixed(2);
    };

    const categoryKeywords = {
        vegetables: ["se", "seb", "sebz", "sebze", "sebzele", "sebzeler"],
        fruits: ["m", "me", "mey", "meyv", "meyve", "meyvel", "meyvele", "meyveler"],
        olivesoils: ["y", "ya", "yağ", "yağl", "yağla", "yağlar"],
        dairy: ["sü", "süt", "süt ü", "süt ür", "süt ürü", "süt ürün", "süt ürünl", "süt ürünle", "süt ürünler", "süt ürünleri"],
        bakedgoods: ["u", "un", "unl", "unlu", "unlu m", "unlu ma", "unlu mam", "unlu mamü", "unlu mamül", "unlu mamüll", "unlu mamülle", "unlu mamüller"],
        sauces: ["so", "sos", "sosl", "sosla", "soslar"]
    };

    const categoryDisplay = {
        vegetables: { tr: "Sebzeler", en: "Vegetables" },
        fruits: { tr: "Meyveler", en: "Fruits" },
        olivesoils: { tr: "Yağlar", en: "Olive Oils" },
        dairy: { tr: "Süt Ürünleri", en: "Dairy Products" },
        bakedgoods: { tr: "Unlu Mamüller", en: "Baked Goods" },
        sauces: { tr: "Soslar", en: "Sauces" }
    };

    const mapInputToCategory = (input) => {
        const cleanedInput = input.toLowerCase().trim();
        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            if (keywords.some(keyword => cleanedInput.startsWith(keyword) || cleanedInput === keyword)) {
                return category;
            }
        }
        return null;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (query) {
            const searchTerm = query.toLowerCase().trim();
            const matchedCategory = mapInputToCategory(searchTerm);

            const filtered = products.filter((product) => {
                const productName = (product.translatedName || "").toLowerCase();
                const productCategory = (product.category || "").toLowerCase();

                if (matchedCategory) {
                    return productCategory === matchedCategory;
                } else {
                    return productName.includes(searchTerm) || productCategory.includes(searchTerm);
                }
            });

            setSuggestions(filtered.slice(0, 5));
            setFilteredProductsList(filtered);
        } else {
            setSuggestions([]);
            setFilteredProductsList(products);
        }
    }, [query, products, setFilteredProductsList, language]);

    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        setQuery(searchTerm);
        setShowSuggestions(searchTerm.length > 0);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                handleProductClick(suggestions[selectedIndex]);
            } else if (suggestions.length > 0) {
                // Enter’a basınca seçim yoksa ilk ürünü seç
                handleProductClick(suggestions[0]);
            } else {
                setShowSuggestions(false);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prevIndex => prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prevIndex => prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1);
        }
    };

    const handleProductClick = (product) => {
        const element = document.getElementById(`product-${product.id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            element.classList.add('bg-green-100');
            setTimeout(() => {
                element.classList.remove('bg-green-100');
            }, 2000);
        }
        setShowSuggestions(false);
    };

    const clearSearch = () => {
        setQuery("");
        setFilteredProductsList(products);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSearchButtonClick = () => {
        setShowSuggestions(false);
    };

    // Dil bazlı metinler
    const placeholderText = language === "tr"
        ? "Ürün adı veya kategoriye göre ara..."
        : "Search products by name or category...";
    const searchButtonText = language === "tr" ? "Ara" : "Search";
    const noResultsText = language === "tr" ? "Ürün bulunamadı" : "No products found";

    return (
        <div className="w-full max-w-3xl relative mx-auto" ref={searchRef}>
            <div className="flex gap-2 w-full relative">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder={placeholderText}
                        className="p-3 pl-10 rounded-lg bg-white border border-gray-300 text-black w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={query}
                        onChange={handleSearch}
                        onKeyDown={handleKeyDown}
                    />
                    <Search
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                    {query && (
                        <button
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={clearSearch}
                        >
                            ✕
                        </button>
                    )}
                </div>
                <button
                    className="bg-green-600 hover:bg-green-700 text-white p-2 px-4 rounded-lg transition-colors"
                    onClick={handleSearchButtonClick}
                >
                    {searchButtonText}
                </button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-md z-30 mt-1">
                    {suggestions.map((product, index) => (
                        <li
                            key={product.id}
                            className={`p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${
                                index === selectedIndex ? "bg-gray-200" : ""
                            }`}
                            onClick={() => handleProductClick(product)}
                        >
                            <img
                                src={getImageFromPath(product.imagePath)}
                                alt={product.translatedName}
                                className="w-8 h-8 rounded object-cover"
                            />
                            <div className="flex-grow">
                                <p className="text-sm font-medium">{product.translatedName}</p>
                                <p className="text-xs text-gray-500">
                                    {categoryDisplay[product.category]
                                        ? (language === "tr"
                                            ? categoryDisplay[product.category].tr
                                            : categoryDisplay[product.category].en)
                                        : product.category}
                                </p>
                            </div>
                            <span className="text-xs text-green-600">₺{formatPrice(product.price)}</span>
                        </li>
                    ))}
                </ul>
            )}

            {showSuggestions && query && suggestions.length === 0 && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-md z-30 p-2 text-center text-red-500 mt-1">
                    <p>{noResultsText}</p>
                </div>
            )}
        </div>
    );
};

export default AdminSearchBar;
