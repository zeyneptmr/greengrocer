
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
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
                        <Route path="/contact" element={<ContactPage />} />
                    </Routes>
                </div>

                <Footer />
            </div>
        </Router>
    );
}

export default App;