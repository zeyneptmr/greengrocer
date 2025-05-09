import { useState, useEffect, useContext } from "react";
import { useCart } from "../helpers/CartContext";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import cartImg from "../assets/sadCart.jpeg";
import { Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";
import {useFavorites} from "../helpers/FavoritesContext";
import { getImageFromPath } from "../helpers/imageHelper";


const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => {
        images[item.replace('./', '')] = r(item);
    });
    return images;
};
const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));

export default function Cart() {
    const {
        cart,
        increaseQuantity,
        decreaseQuantity,
        getTotalProductTypes,
        removeItem,
        clearCart
    } = useCart();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();
    const [orderTotalData, setOrderTotalData]= useState({
        totalProductCount: 0,
        totalPrice: 0,
        shippingFee: 0,
        totalAmount: 0,
    });

    const { language } = useContext(LanguageContext);
    const { t } = useTranslation("cart");

    const calculateTotalPrice = () => {
        const total = cart.reduce((acc, item) => {
            return acc + (item.price * item.quantity);
        }, 0);
        return Number(total.toFixed(2));
    };

    const calculateShippingFee = () => {
        const totalPrice = calculateTotalPrice();
        return totalPrice === 0 || totalPrice >= 500 ? 0 : 49;
    };

    const updateOrderTotal = async (totalProductCount, totalPrice, shippingFee) => {
        try {
            const totalAmount = Number(totalPrice + shippingFee).toFixed(2);

            const response = await axios.post(
                "http://localhost:8080/api/ordertotal/update",
                {
                    totalProductCount,
                    totalPrice: totalPrice.toFixed(2),
                    shippingFee: shippingFee.toFixed(2),
                    totalAmount,
                },
                { withCredentials: true }
            );

            if (response.status === 200) {
                console.log("OrderTotal başarıyla güncellendi.");
                
            }
            else if (response.status === 404) {
                console.error("Order Total'a yansıtacak veri yok.");
                
            }
            else if (response.status === 403) {
                console.error("Sepet boş, order total'a yansıtılacak veri yok.");
                
            } else {
                console.error("OrderTotal güncellenirken bir sorun oluştu.");
            
            }
        } catch (error) {
            console.error("OrderTotal güncellenirken bir hata oluştu:", error);
        }
    };

    const fetchOrderTotal = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/ordertotal/getOrderTotal", {
                withCredentials: true,
            });
            if (response.status === 200 && response.data) {
                setOrderTotalData(response.data);
            } else {
                console.warn("OrderTotal verisi alınamadı.");
            }
        } catch (error) {
            console.error("OrderTotal getirme hatası:", error);
        }
    };

    
    useEffect(() => {
        const totalProductCount = getTotalProductTypes();
        const totalPrice = calculateTotalPrice();
        const shippingFee = calculateShippingFee();
        updateOrderTotal(totalProductCount, totalPrice, shippingFee);
    }, [cart]);

    
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchOrderTotal();
        }, 200);
        return () => clearTimeout(timeout);
    }, [cart]);


    const toggleSelectItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const deleteSelectedItems = () => {
        selectedItems.forEach((id) => removeItem(id));
        setSelectedItems([]);
    };

    const handleContinueClick = () => {
        const groupedCart = cart.reduce((acc, item) => {
            const existingItem = acc.find(i => i.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                acc.push({ ...item });
            }
            return acc;
        }, []);

        navigate("/payment");
    };

    return (
        <div className="p-6 flex flex-col lg:flex-row gap-6">
            {/* Cart Products */}
            <div className="w-full lg:w-3/4 bg-white shadow-md rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t('myCart')} ({cart.length} {t('products')})</h2>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? t('finishEditing') : t('editCart')}
                    </button>
                </div>

                {cart.length === 0 ? (
                     <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                     <img src={cartImg} alt="No favorites" className="w-60 sm:w-70 mb-6" />
                     <p className="text-gray-700 text-lg sm:text-xl font-semibold mb-4 px-4">
                         {t('emptyCartMessage')}
                     </p>
                     <Link to="/products">
                         <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                             {t('discoverProducts')}
                         </button>
                     </Link>
                 </div>

                ) : (
                    <ul className="space-y-4">
                        {cart.map((item) => (
                            <li key={item.id} className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center space-x-4">
                                    {isEditing && (
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => toggleSelectItem(item.id)}
                                            className="w-5 h-5"
                                        />
                                    )}
                                    <img
                                        src={getImageFromPath(item.image, images)}
                                        alt={item.translatedName}
                                        className="w-20 h-20 object-contain rounded-md"
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold">{item.translatedName}</h3>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center space-y-2">
                                    <span className="text-lg font-bold">
                                        {(parseFloat(item.price) * item.quantity).toFixed(2)} TL
                                    </span>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => decreaseQuantity(item.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md"
                                        >
                                            -
                                        </button>
                                        <span className="text-lg font-semibold">{item.quantity}</span>
                                        <button
                                            onClick={() => increaseQuantity(item.id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="bg-gray-500 text-white px-3 py-2 rounded-md"
                                        >
                                            <FaTrash/>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {isEditing && cart.length > 0 && (
                    <div className="mt-4 flex justify-between">
                        <button
                            onClick={deleteSelectedItems}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            disabled={selectedItems.length === 0}
                        >
                            {t('deleteSelected')}
                        </button>
                        <button
                            onClick={clearCart}
                            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
                        >
                            {t('deleteAll')}
                        </button>
                    </div>
                )}
            </div>

            {/* Cart Summary */}
            <div
                className="w-full lg:w-1/3 bg-white shadow-2xl rounded-3xl p-6 mt-6 lg:mt-12 border-l-4 border-b-4 border-green-500 relative z-10 max-h-[450px] overflow-hidden">
                <h3 className="text-2xl text-orange-500 font-semibold mb-6">{t('cartSummary')}</h3>

                <div className="flex justify-between text-gray-700 text-lg">
                    <span> </span>
                    <span>{t('productsCount', { count: orderTotalData.totalProductCount || 0 })}</span>
                </div>

                <div className="flex justify-between text-gray-700 text-lg mt-4">
                    <span className="font-semibold"> {t('cartTotal')}</span>
                    <span className="font-semibold">{orderTotalData &&orderTotalData.totalPrice} TL</span>
                </div>

                {orderTotalData && orderTotalData.shippingFee === 0 && orderTotalData.totalPrice !== 0 ? (
                    <div className="flex justify-between text-green-600 font-semibold text-lg mt-2">
                        <span>{t('freeDelivery')}</span>
                    </div>
                ) : (
                    <div className="flex justify-between text-gray-700 text-lg mt-2">
                        <span className="font-semibold">{t('deliveryAmount')}</span>
                        <span className="font-semibold">
            {orderTotalData && orderTotalData.shippingFee === 0 && orderTotalData.totalPrice === 0
                ? "0 TL"
                : `${orderTotalData && orderTotalData.shippingFee} TL`}
        </span>
                    </div>
                )}

                {orderTotalData && orderTotalData.totalPrice < 500 && (
                    <div className="mt-4 bg-orange-100 text-orange-700 font-bold text-lg py-4 px-6 rounded-lg shadow-md">
                        {t('addMoreForFreeDelivery', { amount: (500 - orderTotalData.totalPrice).toFixed(2) })}
                    </div>
                )}


                <div className="flex justify-between text-gray-700 text-lg mt-4">
                    <span className="font-semibold"> {t('totalAmount')}</span>
                    <span className="font-semibold">{orderTotalData &&orderTotalData.totalAmount} TL</span>
                </div>

                <button
                    onClick={handleContinueClick}
                    className="w-full mt-6 bg-orange-500 text-white py-3 text-lg rounded-2xl hover:bg-orange-600 transition transform hover:scale-110 shadow-xl"
                >
                    {t('continue')}
                </button>
            </div>


        </div>
    );
}