import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom"; 
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
import FavoritesPage from "./pages/FavoritesPage";
import SearchResults from "./components/SearchResultPage";
import ProductPage from "./helpers/SearchProduct";
import Cart from "./pages/Cart";
import UserPage from "./pages/UserPage";
import ManagerPage from "./pages/ManagerPage";
import AdminPage from "./pages/AdminPage";
import DisplayProductPage from "./pages/DisplayProductPage";



import AddressPage from "./pages/AddressPage.js";
import PaymentPage from "./pages/PaymentPage.js";

import { FavoritesProvider } from "./helpers/FavoritesContext";
import { CartProvider } from "./helpers/CartContext";
import "./styles/App.css";


function MainContent(){
    const currentPage = useLocation();

    const hiddenPages = ["/admin", "/manager"];

    return (
        <>
            {!hiddenPages.some(path => currentPage.pathname.startsWith(path)) && <Navbar />}
            <div className="content">
                <Routes>
                    <Route path="" element={<Home />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/fruits" element={<FruitsPage />} />
                    <Route path="/vegetables" element={<VegetablesPage />} />
                    <Route path="/bakedgoods" element={<BakedGoodsPage />} />
                    <Route path="/olives" element={<OlivesOilsPage />} />
                    <Route path="/sauces" element={<SaucesPage />} />
                    <Route path="/dairy" element={<DairyPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/search-results" element={<SearchResults />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/user" element={<UserPage />} />
                    <Route path="/manager" element={<ManagerPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin/displayproducts" element={<DisplayProductPage />} />
                    <Route path="/address" element={<AddressPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                </Routes>
            </div>
            {!hiddenPages.some(path => currentPage.pathname.startsWith(path)) && <Footer />}
        </>
    );
}

function App() {
    return (
        <FavoritesProvider>
            <CartProvider>
                <Router>
                    <MainContent />
                </Router>
            </CartProvider>
        </FavoritesProvider>
    );
}

export default App;