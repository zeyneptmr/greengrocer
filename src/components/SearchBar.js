import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SearchBar = ({ products }) => {
    const [query, setQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1); // Seçili indeks
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".search-bar") && !event.target.closest(".suggestions")) {
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setQuery(searchTerm);

        if (searchTerm.length > 0) {
            setShowSuggestions(true);
            const searchTerms = searchTerm.split(" ");
            const filtered = products.filter((product) => {
                const productName = product.name.toLowerCase();
                return searchTerms.every((term) =>
                    productName.split(" ").some((word) => word.startsWith(term))
                );
            });
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
            setShowSuggestions(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (selectedIndex >= 0) {
                handleProductClick(filteredProducts[selectedIndex]);
            } else if (filteredProducts.length > 0) {
                navigate("/search-results", { state: { results: filteredProducts } });
                setShowSuggestions(false);
                setQuery("");
            } else if (query) {
                navigate(`/search-results?query=${query}`);
                setQuery("");
            }
        } else if (e.key === "ArrowDown") {
            // Aşağı tuşuna basıldığında indeksi artır
            setSelectedIndex((prevIndex) =>
                prevIndex < filteredProducts.length - 1 ? prevIndex + 1 : prevIndex
            );
        } else if (e.key === "ArrowUp") {
            // Yukarı tuşuna basıldığında indeksi azalt
            setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
        }
    };

    const handleSearchClick = () => {
        if (filteredProducts.length > 0) {
            navigate("/search-results", { state: { results: filteredProducts } });
            setShowSuggestions(false);
            setQuery("");
        } else if (query) {
            navigate(`/search-results?query=${query}`);
            setQuery("");
        }
    };

    const handleProductClick = (product) => {
        if (product && product.id) {
            navigate(`/product/${product.id}`);
        } else {
            console.error("Invalid product or missing id");
        }
        setQuery("");
        setFilteredProducts([]);
        setShowSuggestions(false);
        setSelectedIndex(-1); // Seçili indeksi sıfırla
    };

    return (
        <div className="flex-grow flex justify-center relative search-bar">
            <div className="flex gap-2 w-full md:w-4/5 lg:w-3/4 xl:w-2/3 relative h-16">
                <input
                    type="text"
                    placeholder="Search product..."
                    className="p-7 rounded-full bg-[#f7f7f7] text-black w-full border border-[#B6D1A7] z-10 text-lg"
                    value={query}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="bg-green-600 text-white p-4 rounded-full z-10"
                    onClick={handleSearchClick}
                >
                    <Search size={24}/>
                </button>

                {/* Öneri Listesi */}
                {showSuggestions && query && filteredProducts.length > 0 && (
                    <ul className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-md shadow-md z-30 suggestions">
                        {filteredProducts.map((product, index) => (
                            <li
                                key={product.id}
                                className={`p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2 ${
                                    index === selectedIndex ? "bg-gray-300" : ""
                                }`}
                                onClick={() => handleProductClick(product)}
                            >
                                <img src={product.image} alt={product.name} className="w-8 h-8 rounded"/>
                                <div>
                                    <p className="text-sm font-medium">{product.name}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Sonuç bulunamazsa mesaj göster */}
                {filteredProducts.length === 0 && query.length > 0 && (
                    <div
                        className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-md shadow-md z-20 p-2 text-center text-red-500">
                        <p>Product not found!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
