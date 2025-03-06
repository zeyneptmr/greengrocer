import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddressPage from "./pages/AddressPage";
import FruitsPage from "./pages/FruitsPage";
import VegetablesPage from "./pages/VegetablesPage";
import BakedGoodsPage from "./pages/BakedGoodsPage";
import OlivesOilsPage from "./pages/OlivesOilsPage";
import SaucesPage from "./pages/SaucesPage";
import DairyPage from "./pages/DairyPage";

const categories = [
    { name: "Meyveler", component: FruitsPage, icon: "🍎" },
    { name: "Sebzeler", component: VegetablesPage, icon: "🥕" },
    { name: "Unlu Mamüller", component: BakedGoodsPage, icon: "🍞" },
    { name: "Zeytin & Yağlar", component: OlivesOilsPage, icon: "🫒" },
    { name: "Soslar", component: SaucesPage, icon: "🥫" },
    { name: "Süt Ürünleri", component: DairyPage, icon: "🧀" },
];

const Subscribe = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Kullanıcının adreslerini çek
        fetch("/api/addresses") // Gerçek endpointi buraya ekleyin
            .then(response => response.json())
            .then(data => setAddresses(data))
            .catch(error => console.error("Adresleri çekerken hata oluştu:", error));
    }, []);

    const handleProductSelect = (product) => {
        setSelectedProducts(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) {
                return prev.filter(p => p.id !== product.id);
            }
            return [...prev, product];
        });
    };

    const totalAmount = selectedProducts.reduce((sum, product) => sum + product.price, 0);

    const handleSubscription = () => {
        if (totalAmount < 500) {
            alert("Lütfen en az 500 TL'lik ürün seçin.");
            return;
        }
        if (!selectedAddress) {
            alert("Lütfen bir adres seçin.");
            return;
        }

        const subscriptionData = {
            products: selectedProducts,
            address: selectedAddress,
            totalAmount,
        };

        fetch("/api/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subscriptionData),
        })
            .then(response => response.json())
            .then(data => {
                alert("Abonelik başarıyla oluşturuldu!");
                navigate("/subscriptions");
            })
            .catch(error => console.error("Abonelik oluşturulurken hata oluştu:", error));
    };

    return (
        <div>
            <h1>Abonelik Oluştur</h1>
            <h3>Kategori Seçimi</h3>
            <div>
                {categories.map(category => (
                    <button key={category.name} onClick={() => setSelectedCategory(category)}>
                        {category.icon} {category.name}
                    </button>
                ))}
            </div>
            {selectedCategory && (
                <div>
                    <h3>{selectedCategory.name} Seçimi</h3>
                    <selectedCategory.component onSelect={handleProductSelect} />
                </div>
            )}
            <h3>Adres Seçimi</h3>
            <select onChange={(e) => setSelectedAddress(e.target.value)} value={selectedAddress}>
                <option value="">Adres Seçin</option>
                {addresses.map(address => (
                    <option key={address.id} value={address.id}>{address.details}</option>
                ))}
            </select>
            <h3>Toplam: {totalAmount} TL</h3>
            <button onClick={handleSubscription} disabled={totalAmount < 500 || !selectedAddress}>
                Aboneliği Tamamla
            </button>
        </div>
    );
};

export default Subscribe;
