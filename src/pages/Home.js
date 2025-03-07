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
import promo4 from '../assets/promo4.svg';
import { Link } from "react-router-dom";
import ChefRecommendationModal from "../components/ChefRecomendation";
import chefImage from "../assets/chef.jpg";
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
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    useEffect(() => {
        if (isModalOpen) {
            document.documentElement.style.overflow = "hidden"; // HTML banned
            document.body.style.overflow = "hidden"; // Body banned
        } else {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        }
        return () => {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        };
    }, [isModalOpen]);


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
    const [hovered, setHovered] = useState(null);
    return (
        <div className="p-6">
            <SlideBar items={slideItems}/>

            <div className="flex justify-center gap-6 my-8">
                {['Promo 1', 'Promo 2', 'Promo 3', 'Promo 4'].map((promo, index) => (
                    <motion.div
                        whileHover={{scale: 1.05}}
                        className="relative bg-white p-4 shadow-lg rounded-lg hover:shadow-green-500/50 transition-shadow w-40 h-40 flex justify-center items-center"
                        onHoverStart={() => setHovered(index)}
                        onHoverEnd={() => setHovered(null)}
                        key={promo}
                    >
                        {hovered === index ? (
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.5}}
                                className="absolute inset-0 bg-white flex justify-center items-center p-4 rounded-lg"
                            >
                                <p className="text-center text-lg font-semibold leading-6 text-black">
                                    {[
                                        'Fast delivery within the same day with suitable conditions',
                                        'Wide range of completely organic and high quality products!',
                                        'Carefully cultivated and safely selected for you',
                                        'Safe shopping without worrying'
                                    ][index]}
                                </p>
                            </motion.div>
                        ) : (
                            <motion.img
                                src={[promo1, promo2, promo3, promo4][index]}
                                alt={promo}
                                className="w-24 h-24"
                                initial={{opacity: 1}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.5}}
                            />
                        )}
                        <motion.p
                            className="absolute bottom-[-2rem] text-center text-l font-semibold text-gray-700"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.5}}
                        >
                            {['Fast Delivery', 'Freshness', 'Safe Products', 'Secure Payment'][index]}
                        </motion.p>
                    </motion.div>
                ))}
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

            <br/>

            <h2 className="text-3xl font-bold mt-6">Explore More</h2>
            <br/>
            <br/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4 justify-items-center">
                {categories.map((category, index) => (
                    <Link to={category.path} key={index} className="flex flex-col items-center cursor-pointer">
                        <img src={category.image} alt={category.name}
                             className="w-32 h-32 rounded-lg shadow-lg transition-transform hover:scale-110"/>
                        <p className="mt-3 text-xl font-semibold">{category.name}</p>
                    </Link>
                ))}
            </div>
            <br/>
            <br/>

            <div className="p-6 flex items-center justify-between relative w-full max-w-4xl mx-auto">
                {/* Text Section (Left) */}
                <div className="text-left flex-1 pr-10">
                    <h2 className="text-3xl font-bold text-green-600 flex items-center gap-2">
                        🍽️ Chef's Recommendation
                    </h2>
                    <p className="text-orange-500 text-lg mt-2 leading-relaxed">
                        Not sure what to eat? Let the chef decide for you!
                        Select your preferences and get a unique recipe recommendation
                        based on what you feel like eating today!
                    </p>
                </div>

                {/* Image Section (Right) */}
                <button onClick={() => setIsModalOpen(true)} className="relative group">
                    <div className="bg-green-100 p-3 rounded-lg shadow-lg">
                        <img
                            src={chefImage}
                            alt="Chef's Recommendation"
                            className="rounded-lg cursor-pointer w-72 h-auto transition-transform group-hover:scale-105"
                        />
                    </div>
                    <span
                        className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-sm px-4 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            Click to see the chef's special!
        </span>
                </button>

                {isModalOpen && (
                    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="overflow-y-auto max-h-[80vh] bg-white rounded-lg shadow-lg">
                            <ChefRecommendationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
                        </div>
                    </div>
                )}
            </div>

            {/* Coupons Section */}
            <h2 className="text-2xl font-bold mt-6">Coupons and Promotions</h2>
            <div className="mt-4">
                <div className="flex space-x-4 overflow-x-auto pb-4">
                    <Card className="p-4 flex flex-col justify-between items-center cursor-pointer">
                        <p className="text-center">25 ₺ discount on purchases over 500 ₺!</p>
                        <Button
                            className="bg-green-500 text-white mt-4"
                            onClick={() => openModal("25 ₺ discount on purchases over 500 ₺!", "In this campaign, 25₺ discount will be applied to purchases over 500₺..")}
                        >
                            Details
                        </Button>
                    </Card>
                    <Card className="p-4 flex flex-col justify-between items-center cursor-pointer">
                        <p className="text-center">Free Delivery Opportunity!</p>
                        <Button
                            className="bg-green-500 text-white mt-4"
                            onClick={() => openModal("Free Delivery Opportunity", "Free delivery is offered for purchases of 500₺ and above..")}
                        >
                            Details
                        </Button>
                    </Card>
                    <Card className="p-4 flex flex-col justify-between items-center cursor-pointer">
                        <p className="text-center">Buy Three pay for Two!</p>
                        <Button
                            className="bg-green-500 text-white mt-4"
                            onClick={() => openModal("Buy Three pay for Two!", "Within the scope of this campaign, if you buy three products from the Sauce category, one product will be given free.")}
                        >
                            Details
                        </Button>
                    </Card>
                    <Card className="p-4 flex flex-col justify-between items-center cursor-pointer">
                        <p className="text-center">20% Discount on New Products!</p>
                        <Button
                            className="bg-green-500 text-white mt-4"
                            onClick={() => openModal("20% Discount on New Products!", "20% discount on new products.")}
                        >
                            Details
                        </Button>
                    </Card>
                    {/* New campaign */}
                    <Card className="p-4 flex flex-col justify-between items-center cursor-pointer">
                        <p className="text-center">Ramadan Discount: 25%!</p>
                        <Button
                            className="bg-green-500 text-white mt-4"
                            onClick={() => openModal("Ramadan Discount: 25%", "25% discount on Ramadan collection!")}
                        >
                            Details
                        </Button>
                    </Card>
                    {/* New campaign */}
                    <Card className="p-4 flex flex-col justify-between items-center cursor-pointer">
                        <p className="text-center">15% Discount on Your Favorite Products!</p>
                        <Button
                            className="bg-green-500 text-white mt-4"
                            onClick={() => openModal("15% Discount on Your Favorite Products!", "Don't miss the 15% discount opportunity on your favorite products!")}
                        >
                            Details
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
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

