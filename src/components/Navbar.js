import React, { useState } from "react";
import { ShoppingCart, Search, Heart, User, Home } from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import Account from "./Account";
import logo from "../assets/logoyazısız.jpeg";
import { useCart } from "../pages/CartContext";
import products from "../data/products"; // import useCart hook

const Navbar = () => {
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const { getTotalProductTypes } = useCart(); // Import product types from CartContext
    const [query, setQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setQuery(searchTerm);

        if (searchTerm.length > 0) {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().startsWith(searchTerm)
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    };

    const handleSelectProduct = (product) => {
        setQuery("");
        setFilteredProducts([]);
        navigate(product.path);
    };

    return (
        <>
            <nav className="h-20 w-full bg-white text-green-600 flex items-center px-4">
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
                        />
                        <button className="bg-green-600 text-white p-2 rounded z-10">
                            <Search size={20}/>
                        </button>

                        {/* Öneri Listesi */}
                        {filteredProducts.length > 0 && (
                            <ul className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-md shadow-md z-20">
                                {filteredProducts.map((product) => (
                                    <li
                                        key={product.id}
                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                        onClick={() => handleSelectProduct(product)}
                                    >
                                        {product.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>


                <div className="flex items-center gap-3 ml-1">
                    <button onClick={() => setIsAccountOpen(true)}
                            className="flex flex-col items-center bg-transparent text-green-600 p-1 rounded transition-transform hover:scale-110">
                        <User size={18}/>
                        <span className="text-xs">Log In</span>
                    </button>

                    <Link to="/favorites">
                        <button
                            className="flex flex-col items-center bg-transparent text-green-600 p-1 rounded transition-transform hover:scale-110">
                            <Heart size={18}/>
                            <span className="text-xs">Favorites</span>
                        </button>
                    </Link>

                    <Link to="/cart">
                        <button
                            className="flex flex-col items-center bg-transparent text-green-600 p-1 rounded transition-transform hover:scale-110 relative">
                            <ShoppingCart size={18}/>
                            <span className="text-xs">Cart</span>

                            {/* badge that shows different type of products */}
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

            <div className="bg-green-500 text-white p-3">
                <div className="flex justify-center">
                    <ul className="flex space-x-6">
                        {/* Home Icon */}
                        <li className="cursor-pointer transform transition-all duration-300 hover:scale-125 hover:text-orange-500">
                            <Link to="/">
                                <Home size={25} className="inline-block mr-1"/>
                            </Link>
                        </li>
                        <li className="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:text-orange-500">
                            <Link to="/fruits"> Fruits </Link>
                        </li>
                        <li className="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:text-orange-500">
                            <Link to="/vegetables"> Vegetables </Link>
                        </li>
                        <li className="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:text-orange-500">
                            <Link to="/bakedgoods"> Baked Goods </Link>
                        </li>
                        <li className="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:text-orange-500">
                            <Link to="/olives"> Olives & Oils </Link>
                        </li>
                        <li className="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:text-orange-500">
                            <Link to="/sauces"> Sauces </Link>
                        </li>
                        <li className="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:text-orange-500">
                            <Link to="/dairy"> Dairy </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <Account isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
        </>
    );
};

export default Navbar;