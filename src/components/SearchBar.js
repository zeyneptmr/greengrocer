import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { language } = useContext(LanguageContext);

    const API_BASE_URL = "http://localhost:8080";

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

        if (path.startsWith("data:image")) {
            return path;  // Doğrudan Base64 resmini döndür
        }

        const filename = path.split('/').pop();
        console.log("Filename extracted:", filename);

        const imagePath = Object.keys(images).find(key => key.includes(filename.split('.')[0]));  // Dosya adıyla eşleşen anahtar

        if (!imagePath) {
            console.error(`Resim bulunamadı: ${filename}`);
            return '/placeholder.png';  // Placeholder resim
        }

        console.log("Image path:", imagePath); // Bu noktada imagePath doğru olmalı
        return images[imagePath] || '/placeholder.png';
    };




    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/products?language=${language}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // Transform backend product format to match frontend format
                const transformedProducts = data.map(product => ({
                    id: product.id,
                    name: product.translatedName,
                    price: product.price,
                    stock: product.stock,
                    image: getImageFromPath(product.imagePath),
                    category: product.category
                }));
                setProducts(transformedProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

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

    const handleSearch = async (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setQuery(searchTerm);
        setSelectedIndex(-1); 

        if (searchTerm.length > 0) {
            setShowSuggestions(true);
            setLoading(true);

            try {
            
                const response = await fetch(`${API_BASE_URL}/api/products/search/name?productName=${searchTerm}&language=${language}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // Transform backend product format to match frontend format
                const transformedProducts = data.map(product => ({
                    id: product.id,
                    name: product.translatedName,
                    price: product.price,
                    stock: product.stock,
                    image: getImageFromPath(product.imagePath),
                    category: product.category
                }));

                setFilteredProducts(transformedProducts);
            } catch (error) {
                console.error("Error searching products:", error);
        
                const searchTerms = searchTerm.split(" ");
                const filtered = products.filter((product) => {
                    const productName = product.name.toLowerCase();
                    return searchTerms.every((term) =>
                        productName.split(" ").some((word) => word.startsWith(term))
                    );
                });
                setFilteredProducts(filtered);
            } finally {
                setLoading(false);
            }
        } else {
            setFilteredProducts([]);
            setShowSuggestions(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
    
            if (selectedIndex >= 0 && selectedIndex < filteredProducts.length) {
            
                const selectedProduct = filteredProducts[selectedIndex];
                handleProductClick(selectedProduct);
            } else if (query) {
                
                navigate(`/search-results`, { 
                    state: { 
                        results: filteredProducts,
                        query: query 
                    }
                });
                setShowSuggestions(false);
                setQuery("");
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prevIndex) => {
                const newIndex = prevIndex < filteredProducts.length - 1 ? prevIndex + 1 : 0;
                return newIndex;
            });
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prevIndex) => {
                const newIndex = prevIndex > 0 ? prevIndex - 1 : filteredProducts.length - 1;
                return newIndex;
            });
        }
    };

    const handleSearchClick = () => {
        if (query) {
            navigate("/search-results", { 
                state: { 
                    results: filteredProducts,
                    query: query 
                }
            });
            setShowSuggestions(false);
            setQuery("");
        }
    };

    const handleProductClick = (product) => {
        if (product && product.id) {
            navigate(`/product/${product.id}`);
            setQuery("");
            setFilteredProducts([]);
            setShowSuggestions(false);
            setSelectedIndex(-1);
        } else {
            console.error("Invalid product or missing id");
        }
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

                {/* Suggestion List */}
                {showSuggestions && query && (
                    <ul className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-md shadow-md z-30 suggestions">
                        {loading ? (
                            <li className="p-2 text-center">Loading...</li>
                        ) : filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                                <li
                                    key={product.id}
                                    className={`p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2 ${
                                        index === selectedIndex ? "bg-gray-300" : ""
                                    }`}
                                    onClick={() => handleProductClick(product)}
                                >
                                    <img src={getImageFromPath(product.image)} alt={product.name} className="w-8 h-8 rounded"/>
                                    <div>
                                        <p className="text-sm font-medium">{product.name}</p>
                                        <p className="text-xs text-gray-600">{product.price.toFixed(2)} TL</p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="p-2 text-center text-red-500">Product not found!</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SearchBar;