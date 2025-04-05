import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

const AdminSearchBar = ({ products, setFilteredProductsList }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef(null);

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
            return path; 
        }

        const filename = path.split('/').pop();
        console.log("Filename extracted:", filename);

        const imagePath = Object.keys(images).find(key => key.includes(filename.split('.')[0]));  

        if (!imagePath) {
            console.error(`Resim bulunamadı: ${filename}`);
            return '/placeholder.png';  
        }

        console.log("Image path:", imagePath); 
        return images[imagePath] || '/placeholder.png';
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
            const searchTerms = query.toLowerCase().split(" ");
            const filtered = products.filter((product) => {
        
                const productName = product.productName.toLowerCase();
                const productCategory = product.category.toLowerCase();

                return searchTerms.some((term) =>
                    productName.includes(term) ||
                    productCategory.includes(term)
                );
            });

            setSuggestions(filtered.slice(0, 5));
            setFilteredProductsList(filtered);
        } else {
            setSuggestions([]);
            setFilteredProductsList(products);
        }
    }, [query, products, setFilteredProductsList]);

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
            } else {
                setShowSuggestions(false);

                const searchResult = document.getElementById("search-results");
                if (searchResult) {
                    searchResult.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prevIndex) =>
                prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
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

        const searchResult = document.getElementById("search-results");
        if (searchResult) {
            searchResult.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full max-w-3xl relative mx-auto" ref={searchRef}>
            <div className="flex gap-2 w-full relative">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search products by name or category..."
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
                        </button>
                    )}
                </div>
                <button
                    className="bg-green-600 hover:bg-green-700 text-white p-2 px-4 rounded-lg transition-colors"
                    onClick={handleSearchButtonClick}
                >
                    Search
                </button>
            </div>

            {/* Suggestions dropdown */}
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
                                alt={product.productName}
                                className="w-8 h-8 rounded object-cover"
                            />
                            <div className="flex-grow">
                                <p className="text-sm font-medium">{product.productName}</p>
                                <p className="text-xs text-gray-500">{product.category}</p>
                            </div>
                            <span className="text-xs text-green-600">₺{formatPrice(product.price)}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* No results message */}
            {showSuggestions && query && suggestions.length === 0 && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-md z-30 p-2 text-center text-red-500 mt-1">
                    <p>No products found</p>
                </div>
            )}
        </div>
    );
};

export default AdminSearchBar;