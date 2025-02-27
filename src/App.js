
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import FruitsPage from "./pages/FruitsPage";
import VegetablesPage from "./pages/VegetablesPage";
import BakedGoodsPage from "./pages/BakedGoodsPage";
import OlivesPage from "./pages/OlivesPage";
import SaucesPage from "./pages/SaucesPage";
import DesignerClothesPage from "./pages/DesignerClothesPage";
import ContactPage from "./pages/ContactPage";
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/fruits" element={<FruitsPage />} />
                        <Route path="/vegetables" element={<VegetablesPage />} />
                        <Route path="/bakedgoods" element={<BakedGoodsPage />} />
                        <Route path="/olives" element={<OlivesPage />} />
                        <Route path="/sauces" element={<SaucesPage />} />
                        <Route path="/designerclothes" element={<DesignerClothesPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                    </Routes>
                </div>

                <Footer />
            </div>
        </Router>
    );
}

export default App;