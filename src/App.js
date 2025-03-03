import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import FruitsPage from "./pages/FruitsPage";
import DairyPage from "./pages/DairyPage";
import VegetablesPage from "./pages/VegetablesPage";
import BakedGoodsPage from "./pages/BakedGoodsPage";
import OlivesOilsPage from "./pages/OlivesOilsPage";
import SaucesPage from "./pages/SaucesPage";
import ContactPage from "./pages/ContactPage";
import Cart from "./pages/Cart";
import { CartProvider } from "./pages/CartContext";
import FavoritesPage from "./pages/FavoritesPage";
import { FavoritesProvider } from "./components/FavoritesContext"
import "./App.css";

function App() {
    return (
        <FavoritesProvider>
        <CartProvider> {/* CartProvider  */}
            <Router>
                <div className="App">
                    <Navbar />
                    <div className="content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<AboutUs />} />
                            <Route path="/fruits" element={<FruitsPage />} />
                            <Route path="/vegetables" element={<VegetablesPage />} />
                            <Route path="/bakedgoods" element={<BakedGoodsPage />} />
                            <Route path="/olives" element={<OlivesOilsPage />} />
                            <Route path="/sauces" element={<SaucesPage />} />
                            <Route path="/dairy" element={<DairyPage />} />
                            <Route path="/favorites" element={<FavoritesPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/cart" element={<Cart />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
        </CartProvider>
        </FavoritesProvider>
    );
}

export default App;
