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
import promo1 from '../assets/promo1.svg';
import promo2 from '../assets/promo2.svg';
import promo3 from '../assets/promo3.svg';
import { Link } from "react-router-dom";
import vegetablesImg from "../assets/vegetables1.svg";
import fruitsImg from "../assets/fruits1.svg";
import bakedGoodsImg from "../assets/bakedgoods1.svg";
import olivesOilsImg from "../assets/olivesoils1.svg";
import saucesImg from "../assets/sauces1.svg";
import dairyImg from "../assets/dairy1.svg";

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
const categories = [
    { name: "Vegetables", image: vegetablesImg, path: "/vegetables" },
    { name: "Fruits", image: fruitsImg, path: "/fruits" },
    { name: "Baked Goods", image: bakedGoodsImg, path: "/bakedgoods" },
    { name: "Olives & Oils", image: olivesOilsImg, path: "/olives" },
    { name: "Sauces", image: saucesImg, path: "/sauces" },
    { name: "Dairy", image: dairyImg, path: "/dairy" }
];

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
            {/* Promosyon Panoları */}
            <div className="flex justify-center gap-6 my-8">
                <motion.div whileHover={{scale: 1.05}}
                            className="relative bg-white p-4 shadow-lg rounded-lg hover:shadow-green-500/50 transition-shadow">
                    <img src={promo1} alt="Promo 1" className="w-32 h-32 mx-auto"/>
                </motion.div>
                <motion.div whileHover={{scale: 1.05}}
                            className="relative bg-white p-4 shadow-lg rounded-lg hover:shadow-green-500/50 transition-shadow">
                    <img src={promo2} alt="Promo 2" className="w-32 h-32 mx-auto"/>
                </motion.div>
                <motion.div whileHover={{scale: 1.05}}
                            className="relative bg-white p-4 shadow-lg rounded-lg hover:shadow-green-500/50 transition-shadow">
                    <img src={promo3} alt="Promo 3" className="w-32 h-32 mx-auto"/>
                </motion.div>
            </div>

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
            <h2 className="text-3xl font-bold mt-6">Daha Fazlasını Keşfedin</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
                {categories.map((category, index) => (
                    <Link to={category.path} key={index} className="flex flex-col items-center cursor-pointer">
                        <img src={category.image} alt={category.name}
                             className="w-24 h-24 rounded-lg shadow-lg transition-transform hover:scale-110"/>
                        <p className="mt-2 text-lg font-semibold">{category.name}</p>
                    </Link>
                ))}
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

