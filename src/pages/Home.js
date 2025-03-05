import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import ProductCard from "../components/ProductCard";
import SlideBar from "../components/SliderBar";
import { allproducts } from "../data/products";
import { getDiscountedProducts } from "../components/discount";
import { useFavorites } from "../helpers/FavoritesContext";
import { useCart } from "../helpers/CartContext";
import banner1 from '../assets/banner1.png';
import home2 from '../assets/home2.jpg';

const banners = [banner1];
// Function to shuffle the array
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export default function HomePage() {
    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [dailySelectedProducts, setDailySelectedProducts] = useState([]);
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [modalContent, setModalContent] = useState(""); // Modal content
    const [modalTitle, setModalTitle] = useState(""); // Modal title
    const [index, setIndex] = useState(0);
    const { favorites } = useFavorites();
    const { cart } = useCart();

    useEffect(() => {
        setDiscountedProducts(getDiscountedProducts());
    }, []);

    useEffect(() => {
        const nonDiscountedProducts = allproducts.filter(
            (product) => !getDiscountedProducts().some((discounted) => discounted.id === product.id)
        );
        setDailySelectedProducts(shuffleArray(nonDiscountedProducts).slice(0, 15));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % banners.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Handle opening the modal with specific content and title
    const openModal = (title, content) => {
        setModalTitle(title);
        setModalContent(content);
        setShowModal(true);
    };

    // Handle closing the modal
    const closeModal = () => {
        setShowModal(false);
        setModalContent("");
        setModalTitle("");
    };

    const slideItems = [
        { image: banner1, name: "banner1" },
        { image: home2, name: "home2" },

    ];
    return (
        <div className="p-6">
            <SlideBar items={slideItems}/>
            {/* Discounted Products */}
            <div className="p-6">
                <h2 className="text-3xl font-bold mt-6">Today's Discounted Products</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    {discountedProducts.map((product) => (
                        <ProductCard key={product.id} product={product}/>
                    ))}
                </div>
            </div>

            {/* Products Section - Scrollable */}
            <h2 className="text-3xl font-bold mt-6">Chosen for You</h2>
            <div className="mt-4">
                <div className="flex space-x-4 overflow-x-auto pb-4">
                    {dailySelectedProducts.map((product, index) => (
                        <div key={index} className="flex-shrink-0">
                            <ProductCard product={product}/>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coupons Section */}
            <h2 className="text-2xl font-bold mt-6">Coupons and Promotions</h2>
            <div className="mt-4">
                <div className="flex space-x-4 overflow-x-auto pb-4">
                    <Card className="p-4 flex flex-col justify-between items-center cursor-pointer">
                        <p className="text-center">50₺ üzeri alışverişe %10 indirim!</p>
                        <Button
                            className="bg-green-500 text-white mt-4"
                            onClick={() => openModal("50₺ üzeri alışverişe %10 indirim!", "Bu kampanyaya 50₺ üzeri alışverişlerde %10 indirim uygulanacaktır.")}
                        >
                            Detaylar
                        </Button>
                    </Card>
                    <Card className="p-4 flex flex-col justify-between items-center cursor-pointer">
                        <p className="text-center">Ücretsiz kargo fırsatı!</p>
                        <Button
                            className="bg-green-500 text-white mt-4"
                            onClick={() => openModal("Ücretsiz Kargo Fırsatı", "Bu kampanya kapsamında, tüm siparişlerde ücretsiz kargo fırsatı sunulmaktadır.")}
                        >
                            Detaylar
                        </Button>
                    </Card>
                    <Card className="p-4 flex flex-col justify-between items-center cursor-pointer">
                        <p className="text-center">Üç al, bir bedava!</p>
                        <Button
                            className="bg-green-500 text-white mt-4"
                            onClick={() => openModal("Üç al, bir bedava!", "Bu kampanya kapsamında, üç ürün almanız durumunda bir ürün bedava verilecektir.")}
                        >
                            Detaylar
                        </Button>
                    </Card>
                    <Card className="p-4 flex flex-col justify-between items-center cursor-pointer">
                        <p className="text-center">Yeni Ürünlere %20 İndirim!</p>
                        <Button
                            className="bg-green-500 text-white mt-4"
                            onClick={() => openModal("Yeni Ürünlere %20 İndirim!", "Yeni gelen ürünlerde %20 indirim fırsatı sunulmaktadır.")}
                        >
                            Detaylar
                        </Button>
                    </Card>
                    {/* New campaign */}
                    <Card className="p-4 flex flex-col justify-between items-center cursor-pointer">
                        <p className="text-center">Yaz İndirimi: %30!</p>
                        <Button
                            className="bg-green-500 text-white mt-4"
                            onClick={() => openModal("Yaz İndirimi: %30!", "Yaz koleksiyonunda %30 indirim fırsatı!")}
                        >
                            Detaylar
                        </Button>
                    </Card>
                    {/* New campaign */}
                    <Card className="p-4 flex flex-col justify-between items-center cursor-pointer">
                        <p className="text-center">Sevdiğiniz Ürünlerde %15 İndirim!</p>
                        <Button
                            className="bg-green-500 text-white mt-4"
                            onClick={() => openModal("Sevdiğiniz Ürünlerde %15 İndirim!", "Sevdiğiniz ürünlerde %15 indirim fırsatını kaçırmayın!")}
                        >
                            Detaylar
                        </Button>
                    </Card>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-1/3 relative">
                        <button
                            className="absolute top-2 right-2 text-2xl font-bold text-gray-600"
                            onClick={closeModal}
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-bold text-green-600">{modalTitle}</h2>
                        <p className="mt-4">{modalContent}</p>
                        <button
                            className="mt-4 bg-green-500 text-white p-2 rounded-md"
                            onClick={closeModal}
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

