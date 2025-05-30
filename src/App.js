import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { LanguageProvider } from './context/LanguageContext';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import FruitsPage from "./pages/FruitsPage";
import DairyPage from "./pages/DairyPage";
import VegetablesPage from "./pages/VegetablesPage";
import BakedGoodsPage from "./pages/BakedGoodsPage";
import OlivesOilsPage from "./pages/OlivesOilsPage";
import SaucesPage from "./pages/SaucesPage";
import ContactPage from "./pages/ContactPage";
import FavoritesPage from "./pages/FavoritesPage";
import SearchResults from "./components/SearchResultPage";
import ProductPage from "./helpers/ProductPage";
import Cart from "./pages/Cart";

import ManagerPage from "./pages/ManagerPage";
import AdminPage from "./pages/AdminPage";
import DisplayProductPage from "./pages/DisplayProductPage";
import UpdateProductsPage from "./pages/UpdateProductsPage";
import AddressPage from "./pages/AddressPage";
import PaymentPage from "./pages/PaymentPage.js";
import UserAccountPage from "./pages/UserAccount";
import ChangePasswordPage from "./pages/ChangePassword";
import CreditCardPage from "./pages/CreditCard";
import CustomerInfoPage from "./pages/CustomerInfo";
import DeleteAccount from "./pages/DeleteAccount";
import AddProductPage from "./pages/AddProductPage";
import EditSingleProduct from "./pages/EditSingleProduct";
import { FavoritesProvider } from "./helpers/FavoritesContext";
import { CartProvider } from "./helpers/CartContext";
import InventoryPage from "./pages/InventoryPage";
import CustomerOrderPage from "./pages/CustomerOrderPage";
import CustomerFeedbackPage from "./pages/CustomerFeedbackPage";
import CardList from "./pages/CreditCard";
import ResetPassword from "./components/ResetPassword";
import DiscountPage from "./pages/DiscountPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import "./styles/App.css";
import './i18n';


function MainContent(){
    const currentPage = useLocation();

    const hiddenPages = ["/admin", "/manager"];

    return (
        <>
            {!hiddenPages.some(path => currentPage.pathname.startsWith(path)) && <Navbar />}
            <div className="content">
                <Routes>
                    <Route path="/*" element={<Home />} />
                    <Route path="/about" element={<AboutUs/>}/>
                    <Route path="/faq" element={<FAQ/>}/>
                    <Route path="/fruits" element={<FruitsPage/>}/>
                    <Route path="/vegetables" element={<VegetablesPage/>}/>
                    <Route path="/bakedgoods" element={<BakedGoodsPage/>}/>
                    <Route path="/olives" element={<OlivesOilsPage/>}/>
                    <Route path="/sauces" element={<SaucesPage/>}/>
                    <Route path="/dairy" element={<DairyPage/>}/>
                    <Route path="/favorites" element={<FavoritesPage/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/search-results" element={<SearchResults/>}/>
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/contact" element={<ContactPage/>}/>
                    <Route path="/user" element={<Home/>}/>
                    <Route path="/manager" element={<ManagerPage/>}/>
                    <Route path="/admin" element={<AdminPage/>}/>
                    <Route path="/admin/displayproducts" element={<DisplayProductPage/>}/>
                    <Route path="/admin/addproducts" element={<AddProductPage />} />
                    <Route path="/admin/updateproducts" element={<UpdateProductsPage />} />
                    <Route path="/admin/update-product/:id" element={<EditSingleProduct />} />
                    <Route path="/address" element={<AddressPage/>}/>
                    <Route path="/payment" element={<PaymentPage/>}/>
                    <Route path="/account" element={<UserAccountPage/>}/>
                    <Route path="/change-password" element={<ChangePasswordPage/>}/>
                    <Route path="/customer-info" element={<CustomerInfoPage/>}/>
                    <Route path="/credit-card" element={<CreditCardPage/>}/>
                    <Route path="delete-account" element={<DeleteAccount/>}/>
                    <Route path="/my-orders" element={<MyOrdersPage/>}/>
                    <Route path="/manager/inventory" element={<InventoryPage/>}/>
                    <Route path="/manager/customer-order" element={<CustomerOrderPage/>}/>
                    <Route path="/manager/customer-feedback" element={<CustomerFeedbackPage/>}/>
                    <Route path="/manager/discounts" element={<DiscountPage/>}/>
                    <Route path="/cards" element={<CardList />} />
                </Routes>
            </div>
            {!hiddenPages.some(path => currentPage.pathname.startsWith(path)) && <Footer/>}
        </>
    );
}

function App() {
    return (
        <LanguageProvider>
        <FavoritesProvider>
            <CartProvider>
                <Router>
                    <div className="App">
                        <MainContent/>
                    </div>
                </Router>
            </CartProvider>
        </FavoritesProvider>
        </LanguageProvider>

    );
}

export default App;