import { useState, useEffect } from "react";
import { useCart } from "../helpers/CartContext";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {useFavorites} from "../helpers/FavoritesContext";
//import { getImageFromPath } from "../utils/imageUtils"; // 👈 bunu ekliyoruz

// Görsel dosyalarını içe aktar
const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => {
        images[item.replace('./', '')] = r(item);
    });
    return images;
};
const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));

// Görsel yolu çözümleyici
const getImageFromPath = (path) => {
    if (!path) return null;
    if (path.startsWith("data:image")) return path;

    const filename = path.split('/').pop();
    const imagePath = Object.keys(images).find(key => key.includes(filename.split('.')[0]));

    if (!imagePath) {
        console.error(`Image not found: ${filename}`);
        return '/placeholder.png';
    }

    return images[imagePath] || '/placeholder.png';
};

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
                // UI'ye başarı mesajı gösterilebilir
            }
            else if (response.status === 404) {
                console.error("Order Total'a yansıtacak veri yok.");
                // UI'ye kullanıcıya özel bir mesaj gösterilebilir
            }
            else if (response.status === 403) {
                console.error("Sepet boş, order total'a yansıtılacak veri yok.");
                // UI'ye kullanıcıya özel bir mesaj gösterilebilir
            } else {
                console.error("OrderTotal güncellenirken bir sorun oluştu.");
                // UI'ye kullanıcıya özel bir mesaj gösterilebilir
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

    // Sepet değişince OrderTotal'ı backend'e gönder
    useEffect(() => {
        const totalProductCount = getTotalProductTypes();
        const totalPrice = calculateTotalPrice();
        const shippingFee = calculateShippingFee();
        updateOrderTotal(totalProductCount, totalPrice, shippingFee);
    }, [cart]);

    // Backend'den veriyi çekme işlemi (500ms delay ile)
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


    const calculateTotalAmount = () => {
        //const totalPrice = Number(calculateTotalPrice());
        //const shippingFee = Number(calculateShippingFee());
        //const totalAmount = totalPrice + shippingFee;
        //return totalAmount.toFixed(2); // Sonuçları iki basamağa yuvarla
    };

    return (
        <div className="p-6 flex flex-col lg:flex-row gap-6">
            {/* Cart Products */}
            <div className="w-full lg:w-3/4 bg-white shadow-md rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">My Cart ({cart.length} Products)</h2>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "Finish Editing" : "Edit Cart"}
                    </button>
                </div>

                {cart.length === 0 ? (
                    <p className="text-gray-600">Your Cart is Empty.</p>
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
                                        src={getImageFromPath(item.image)} // 👈 BURASI GÜNCELLENDİ
                                        alt={item.name}
                                        className="w-20 h-20 object-contain rounded-md"
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold">{item.name}</h3>
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
                            Delete Selected Products
                        </button>
                        <button
                            onClick={clearCart}
                            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
                        >
                            Delete All
                        </button>
                    </div>
                )}
            </div>

            {/* Cart Summary */}
            <div
                className="w-full lg:w-1/3 bg-white shadow-2xl rounded-3xl p-6 mt-6 lg:mt-12 border-l-4 border-b-4 border-green-500 relative z-10 max-h-[450px] overflow-hidden">
                <h3 className="text-2xl text-orange-500 font-semibold mb-6">Cart Summary</h3>
                <div className="flex justify-between text-gray-700 text-lg">
                    <span> </span>
                    <span>{orderTotalData && orderTotalData.totalProductCount} products</span>
                </div>
                <div className="flex justify-between text-gray-700 text-lg mt-4">
                    <span className="font-semibold"> Cart Total:</span>
                    <span className="font-semibold">{orderTotalData &&orderTotalData.totalPrice} TL</span>
                </div>

                {orderTotalData && orderTotalData.shippingFee === 0 && orderTotalData.totalPrice !== 0 ? (
                    <div className="flex justify-between text-green-600 font-semibold text-lg mt-2">
                        <span>Free Delivery</span>
                    </div>
                ) : (
                    <div className="flex justify-between text-gray-700 text-lg mt-2">
                        <span className="font-semibold">Delivery Amount:</span>
                        <span className="font-semibold">
            {orderTotalData && orderTotalData.shippingFee === 0 && orderTotalData.totalPrice === 0
                ? "0 TL"
                : `${orderTotalData && orderTotalData.shippingFee} TL`}
        </span>
                    </div>
                )}

                <div className="flex justify-between text-gray-700 text-lg mt-4">
                    <span className="font-semibold"> Total Amount:</span>
                    <span className="font-semibold">{orderTotalData &&orderTotalData.totalAmount} TL</span>
                </div>

                <button
                    onClick={handleContinueClick}
                    className="w-full mt-6 bg-orange-500 text-white py-3 text-lg rounded-2xl hover:bg-orange-600 transition transform hover:scale-110 shadow-xl"
                >
                    Continue
                </button>
            </div>


        </div>
    );
}