import React, { useState } from "react";
import { ShoppingCart, Search, Heart, User, Home, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Account from "./Account";
import logo from "../assets/logoyazısız.jpeg";

import { useFavorites } from "../helpers/FavoritesContext";

import { useCart } from "../helpers/CartContext";
import products from "../data/products";


const menuItems = [
    { name: "Fruits", subItems: ["Dried Fruit", "Fresh Fruit"] },
    { name: "Vegetables", subItems: ["Dried Vegetables", "Fresh Vegetables"] },
    { name: "Baked Goods", subItems: ["Breads", "Pastries", "Cakes"] },
    { name: "Olives & Oils", subItems: ["Oils", "Butters", "Olives"] },
    { name: "Sauces", subItems: ["Tomato Paste", "Sauces", "Jam", "Vinegar"] },
    { name: "Dairy", subItems: ["Milk & Drinks", "Cheese", "Yoghurt"] },
];

const Navbar = () => {
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const { getTotalProductTypes } = useCart(); // Import product types from CartContext

    const {favorites} = useFavorites();

    const [query, setQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const navigate = useNavigate();
    const [hoveredMenu, setHoveredMenu] = useState(null);

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setQuery(searchTerm);

        if (searchTerm.length > 0) {
            setShowSuggestions(true);
            const searchTerms = searchTerm.split(" ");
            const filtered = products.filter((product) => {
                const productName = product.name.toLowerCase();
                return searchTerms.every((term) => {
                    return productName.split(" ").some((word) => word.startsWith(term));
                });
            });
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && filteredProducts.length > 0) {
            navigate("/search-results", { state: { results: filteredProducts } });
            setShowSuggestions(false); // Enter'a basıldığında öneri listesini gizle
        }
    };

    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`);
        setQuery("");
        setFilteredProducts([]);
        setShowSuggestions(false);
    };

    const handleMenuClick = (menuName) => {
        // Menü öğelerine tıklanınca yönlendirme yapılır
        switch (menuName) {
            case "Fruits":
                navigate("/fruits");
                break;
            case "Vegetables":
                navigate("/vegetables");
                break;
            case "Baked Goods":
                navigate("/bakedgoods");
                break;
            case "Olives & Oils":
                navigate("/olives");
                break;
            case "Sauces":
                navigate("/sauces");
                break;
            case "Dairy":
                navigate("/dairy");
                break;
            default:
                break;
        }
    };

    const handleSubMenuClick = (menuName, subItemName) => {
        // Alt menü öğelerine tıklanınca yönlendirme yapılır
        const formattedSubItem = subItemName.toLowerCase().replace(/ /g, "-");
        navigate(`/${menuName.toLowerCase()}/${formattedSubItem}`);
    };


    return (
        <>
            <nav className="h-20 w-full bg-white text-green-600 flex items-center px-4 relative">
                <div className="h-full flex items-center">
                    <img src={logo} alt="Tap-Taze Logo" className="h-full w-auto"/>
                    <h1 className="text-3xl font-bold text-green-600 ml-3">TapTaze</h1>
                </div>

                <div className="flex-grow flex justify-center relative">
                    <div className="flex gap-2 w-1/2 relative">
                        <input
                            type="text"
                            placeholder="Search product..."
                            className="p-2 rounded bg-[#f7f7f7] text-black w-full border border-[#B6D1A7] z-10"
                            value={query}
                            onChange={handleSearch}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="bg-green-600 text-white p-2 rounded z-10">
                            <Search size={20}/>
                        </button>

                        {/* Öneri Listesi */}
                        {showSuggestions && query && filteredProducts.length > 0 && (
                            <ul className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-md shadow-md z-20">
                                {filteredProducts.map((product) => (
                                    <li
                                        key={product.id}
                                        className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
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
                    </div>
                </div>


                <div className="flex items-center gap-3">
                    <button onClick={() => setIsAccountOpen(true)}
                            className="flex flex-col items-center bg-transparent text-green-600 p-1 rounded transition-transform hover:scale-110">
                        <User size={18}/>
                        <span className="text-xs">Log In</span>
                    </button>
                    <Link to="/favorites">
                        <button className="flex flex-col items-center bg-transparent text-green-600 p-1 rounded transition-transform hover:scale-110 relative">
                            <Heart size={18} />
                            <span className="text-xs">Favorites</span>
                            {favorites.length > 0 && (
                                <span className="absolute top-[-5px] right-[5px] bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {favorites.length}
                                </span>
                            )}
                        </button>
                    </Link>
                    <Link to="/cart">
                        <button
                            className="flex flex-col items-center bg-transparent text-green-600 p-1 rounded transition-transform hover:scale-110 relative">
                            <ShoppingCart size={18}/>
                            <span className="text-xs">Cart</span>
                            {getTotalProductTypes() > 0 && (
                                <span
                                    className="absolute top-[-5px] right-[-5px] bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {getTotalProductTypes()}
                                </span>
                            )}
                        </button>
                    </Link>
                </div>
            </nav>

            <div className="bg-green-500 text-white p-3 relative">
                <div className="flex justify-center">
                    <ul className="flex space-x-6 relative">
                        <li className="cursor-pointer transform transition-all duration-300 hover:scale-125 hover:text-orange-500">
                            <Link to="/">
                                <Home size={25} className="inline-block mr-1"/>
                            </Link>
                        </li>
                        {menuItems.map((menu, index) => (
                            <li
                                key={index}
                                className="relative cursor-pointer transform transition-all duration-300 hover:scale-110 hover:text-orange-500 z-40"
                                onMouseEnter={() => setHoveredMenu(menu.name)}
                                onMouseLeave={() => setHoveredMenu(null)}
                                onClick={() => handleMenuClick(menu.name)} // Menü öğesine tıklayınca yönlendir
                            >
                                <span className="flex items-center">{menu.name} <ChevronDown size={16}
                                                                                             className="ml-1"/></span>
                                {hoveredMenu === menu.name && (
                                    <ul className="absolute left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-md shadow-md py-2 w-48 text-center z-9999">
                                        {menu.subItems.map((subItem, subIndex) => (
                                            <li
                                                key={subIndex}
                                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                                onClick={() => handleSubMenuClick(menu.name, subItem)} // Alt menüye tıklanınca yönlendir
                                            >
                                                {subItem}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <Account isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
        </>
    );
};

export default Navbar;