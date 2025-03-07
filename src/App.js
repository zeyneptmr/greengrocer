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
import ProductPage from "./helpers/ProductPage";
import Cart from "./pages/Cart";
import UserPage from "./pages/UserPage";
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
import AddProductPage from "./pages/AddProductPage";
import EditSingleProduct from "./pages/EditSingleProduct";
import { FavoritesProvider } from "./helpers/FavoritesContext";
import { CartProvider } from "./helpers/CartContext";
import InventoryPage from "./pages/InventoryPage";
import CustomerOrderPage from "./pages/CustomerOrderPage";
import DeliveryPage from "./pages/DeliveryPage";
import CustomerFeedbackPage from "./pages/CustomerFeedbackPage";
import CardList from "./pages/CreditCard";
import "./styles/App.css";


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
                    <Route path="/fruits" element={<FruitsPage/>}/>
                    <Route path="/vegetables" element={<VegetablesPage/>}/>
                    <Route path="/bakedgoods" element={<BakedGoodsPage/>}/>
                    <Route path="/olives" element={<OlivesOilsPage/>}/>
                    <Route path="/sauces" element={<SaucesPage/>}/>
                    <Route path="/dairy" element={<DairyPage/>}/>
                    <Route path="/favorites" element={<FavoritesPage/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/search-results" element={<SearchResults/>}/>
                    <Route path="/product/:id" element={<ProductPage />} /> {/* Dinamik ürün yolu */}
                    <Route path="/contact" element={<ContactPage/>}/>
                    <Route path="/user/home" element={<Home/>}/>
                    <Route path="/user" element={<UserPage />} /> {/* Düzeltildi, sadece bir kez tanımlandı */}
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
                    <Route path="/manager/inventory" element={<InventoryPage/>}/>
                    <Route path="/manager/customer-order" element={<CustomerOrderPage/>}/>
                    <Route path="/manager/delivery" element={<DeliveryPage/>}/>
                    <Route path="/manager/customer-feedback" element={<CustomerFeedbackPage/>}/>
                    <Route path="/cards" element={<CardList />} />
                </Routes>
            </div>
            {!hiddenPages.some(path => currentPage.pathname.startsWith(path)) && <Footer/>}
        </>
    );
}

function App() {
    return (
        <FavoritesProvider>
            <CartProvider>
                <Router>
                    <div className="App">
                        <MainContent/>
                    </div>
                </Router>
            </CartProvider>
        </FavoritesProvider>

    );
}

export default App;