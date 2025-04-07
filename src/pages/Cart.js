import { useState } from "react";
import { useCart } from "../helpers/CartContext";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
        calculateTotalPrice,
        getTotalProductTypes,
        removeItem,
        clearCart
    } = useCart();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();


    const toggleSelectItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const deleteSelectedItems = () => {
        selectedItems.forEach((id) => removeItem(id));
        setSelectedItems([]);
    };

    const calculateShippingFee = () => {
        const totalPrice = calculateTotalPrice();
        return totalPrice >= 500 ? 0 : 49;
    };

    const calculateTotalAmount = () => {
        const totalPrice = Number(calculateTotalPrice());
        const shippingFee = Number(calculateShippingFee());
        return (totalPrice + shippingFee).toFixed(2);
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

        //localStorage.setItem('cart', JSON.stringify(groupedCart));
        navigate("/payment");
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
                                            <FaTrash />
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
            <div className="w-full lg:w-1/4 bg-white shadow-lg rounded-lg p-6 mt-6 lg:mt-12 max-h-[400px] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-6">Cart Summary</h3>
                <div className="flex justify-between text-gray-700 text-lg">
                    <span> </span>
                    <span className="font-semibold">{getTotalProductTypes()} products</span>
                </div>
                <div className="flex justify-between text-gray-700 text-lg mt-4">
                    <span>Cart Total:</span>
                    <span className="font-semibold">{calculateTotalPrice()} TL</span>
                </div>

                <div className="flex justify-between text-gray-700 font-semibold text-lg mt-2">
                    <span
                        className={calculateShippingFee() === 0 ? "line-through text-gray-500" : ""}>
                        Delivery Amount:
                    </span>
                    <span
                        className={calculateShippingFee() === 0 ? "line-through text-gray-500" : ""}>
                        49 TL
                    </span>
                </div>

                {calculateShippingFee() !== 0 && (
                    <div className="flex justify-between text-black font-normal text-base mt-2 bg-orange-100 p-2 rounded-md">
                        <span>
                            Add {500 - calculateTotalPrice()} TL worth of products to your cart for free delivery.
                        </span>
                    </div>
                )}

                {calculateShippingFee() === 0 && (
                    <div className="flex justify-between text-green-600 font-semibold text-lg mt-2">
                        <span>Free Delivery</span>
                    </div>
                )}

                <div className="flex justify-between text-gray-700 text-lg mt-4">
                    <span>Total Amount:</span>
                    <span className="font-semibold">{calculateTotalAmount()} TL</span>
                </div>

                <button
                    onClick={handleContinueClick}
                    className="w-full mt-6 bg-orange-500 text-white py-3 text-lg rounded-md hover:bg-orange-600 transition"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
