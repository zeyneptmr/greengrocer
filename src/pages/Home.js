import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import SlideBar from "../components/SliderBar";
import TodaysDiscountedProducts from "../components/TodaysDiscountedProducts";
import { useFavorites } from "../helpers/FavoritesContext";
import { useCart } from "../helpers/CartContext";
import banner1 from '../assets/banner1.png';
import home2 from '../assets/home2.jpg';
import home3 from '../assets/home3.jpg';
import home4 from '../assets/home4.jpg';
import home6 from '../assets/home6.jpg';
import home9 from '../assets/home9.jpg';
import home11 from '../assets/home11.jpg';
import home7 from '../assets/home7.jpg';
import home8 from '../assets/home8.jpg';
import home12 from '../assets/home12.jpeg';
import home13 from '../assets/home13.jpeg';
import home14 from '../assets/home14.jpeg';
import home15 from '../assets/home15.jpeg';
import home16 from '../assets/home16.jpeg';
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
import axios from "axios";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";
import { getImageFromPath } from "../helpers/imageHelper";

const banners = [banner1];


export default function HomePage() {
    const [showModal, setShowModal] = useState(false); 
    const [modalContent, setModalContent] = useState(""); 
    const [modalTitle, setModalTitle] = useState(""); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [randomProducts, setRandomProducts] = useState([]);
    const [index, setIndex] = useState(0);
    const [hasDiscountedProducts, setHasDiscountedProducts] = useState(false); 
    const { favorites } = useFavorites();
    const { language } = useContext(LanguageContext);

    const { t } = useTranslation("home");

    const importAll = (r) => {
        let images = {};
        r.keys().forEach((item) => {
          images[item.replace('./', '')] = r(item);
        });
        return images;
      };

    const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));


    const categories = [
        { name: t("categories.vegetables"), image: vegetablesImg, path: "/vegetables" },
        { name: t("categories.fruits"), image: fruitsImg, path: "/fruits" },
        { name: t("categories.bakedGoods"), image: bakedGoodsImg, path: "/bakedgoods" },
        { name: t("categories.olivesOils"), image: olivesOilsImg, path: "/olives" },
        { name: t("categories.sauces"), image: saucesImg, path: "/sauces" },
        { name: t("categories.dairy"), image: dairyImg, path: "/dairy" }
    ];
    
    const formatPrice = (price) => {
        if (typeof price === "number") {
            return price.toFixed(2); 
        }
        return parseFloat(price).toFixed(2); 
    };

    
    const handleDiscountedProductsLoaded = (hasProducts) => {
        console.log('HomePage: İndirimli ürünler durumu değişti:', hasProducts);
        setHasDiscountedProducts(hasProducts);
    };

    useEffect(() => {
        const fetchRandomProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/products/random?language=${language}`);
                setRandomProducts(response.data);
            } catch (error) {
                console.error("Error fetching random products", error);
            }
        };

        fetchRandomProducts(); 
    }, [language]);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % banners.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            document.documentElement.style.overflow = "hidden"; 
            document.body.style.overflow = "hidden"; 
        } else {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        }
        return () => {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        };
    }, [isModalOpen]);



    const openModal = (title, content) => {
        setModalTitle(title);
        setModalContent(content);
        setShowModal(true);
    };

    
    const closeModal = () => {
        setShowModal(false);
        setModalContent("");
        setModalTitle("");
    };

    const slideItems = [
        { image: home15, name: "home15" },
        { image: home16, name: "home16" },
        { image: home12, name: "home12" },
        { image: home14, name: "home14" },
        { image: home11, name: "home11" },
        { image: home13, name: "home13" },

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
                                        t("promo1"),
                                        t("promo2"),
                                        t("promo3"),
                                        t("promo4")
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
                            {[
                                t("fastDelivery"),
                                t("freshness"),
                                t("safeProducts"),
                                t("securePayment")
                            ][index]}
                        </motion.p>
                    </motion.div>
                ))}
            </div>

            {/* Discounted Products */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    {hasDiscountedProducts ? (
                        <>
                            <h2 className="text-3xl font-bold mt-6">{t("todaysDiscountedProducts")}</h2>
                            <TodaysDiscountedProducts onProductsLoaded={handleDiscountedProductsLoaded} />
                        </>
                    ) : (
                        <div style={{ display: 'none' }}>
                            <TodaysDiscountedProducts onProductsLoaded={handleDiscountedProductsLoaded} />
                        </div>
                    )}
                </div>
            </section>

            {/* Products Section - Scrollable */}
            <h2 className="text-3xl font-bold mt-12">{t("chosenForYou")}</h2>
            <div className="mt-4">
                <div className="flex space-x-4 overflow-x-auto pb-4">
                    {randomProducts.map((product, index) => (
                        <div key={index} className="flex-shrink-0">
                            <ProductCard
                            key={product.id}
                            product={{
                                id: product.id,
                                name: product.translatedName || product.productName,
                                price: formatPrice(product.price),
                                image: getImageFromPath(product.imagePath, images),
                                stock: product.stock,
                                category: product.category
                            }}
                        />
                        </div>
                    ))}
                </div>
            </div>

            <br/>

            <h2 className="text-3xl font-bold mt-6">{t("exploreMore")}</h2>
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
                        {t("chefsRecommendation")}
                    </h2>
                    <p className="text-orange-500 text-lg mt-2 leading-relaxed">
                        {t("chefsText")}
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
            {t("clickToSee")}
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