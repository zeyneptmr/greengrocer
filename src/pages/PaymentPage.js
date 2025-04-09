
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaArrowLeft} from "react-icons/fa";
import { FaShoppingCart, FaShoppingBasket } from 'react-icons/fa';
import { useFavorites } from "../helpers/FavoritesContext";
import { useCart } from "../helpers/CartContext"; // yol değişebilir

import axios from "axios";

const PaymentPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [savedCards, setSavedCards] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
    const [isLowCostWarning, setIsLowCostWarning] = useState(false);
    const [showPopUp, setShowPopUp] = useState(false);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [stockInput, setStockInput] = useState(100);
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    //const { refreshAuth } = useFavorites();
    const { clearCarto } = useCart(); // burası önemli

    const importAll = (r) => {
        let images = {};
        r.keys().forEach((item) => {
            images[item.replace('./', '')] = r(item);
        });
        return images;
    };

    const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));

    const formatPrice = (price) => {
        if (typeof price === "number") {
            return price.toFixed(2);
        }
        return parseFloat(price).toFixed(2);
    };

    const getImageFromPath = (path) => {
        if (!path) return null;

        if (path.startsWith("data:image")) {
            return path;  // Base64 görseli döndür
        }

        const filename = path.split('/').pop(); // Örnek: "apple.jpg"

        const imagePath = Object.keys(images).find(key => key.includes(filename.split('.')[0]));

        if (!imagePath) {
            console.error(`Image not found: ${filename}`);
            return '/placeholder.png';  // Placeholder görseli
        }

        return images[imagePath] || '/placeholder.png';
    };

    const [orderTotal, setOrderTotal] = useState({
        totalProductCount: 0,
        totalPrice: 0,
        shippingFee: 0,
        totalAmount: 0,
    });

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/products');
            console.log(response.data);
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            setErrorMessage("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };
    const fetchData = async () => {
        try {
            const [addressRes, cardRes, cartRes] = await Promise.all([
                axios.get("http://localhost:8080/api/addresses", { withCredentials: true }),
                axios.get("http://localhost:8080/api/cards", { withCredentials: true }),
                axios.get("http://localhost:8080/api/cart", { withCredentials: true }),
            ]);

            setAddresses(addressRes.data);
            setSavedCards(cardRes.data);
            setCart(cartRes.data);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    const fetchOrderTotal = async () => {
        try {
            const orderTotalRes = await axios.get("http://localhost:8080/api/ordertotal/getOrderTotal", { withCredentials: true });

            if (orderTotalRes.status === 200) {
                setOrderTotal(orderTotalRes.data);
                console.log("OrderTotal başarıyla alındı.");
            } else if (orderTotalRes.status === 404) {
                console.error("Order Total'a yansıtacak veri yok.");
            } else if (orderTotalRes.status === 403) {
                console.error("Kullanıcı yetkisi yok.");
            } else {
                console.error("OrderTotal alınırken bir sorun oluştu.");
            }
        } catch (error) {
            console.error("OrderTotal alınırken bir hata oluştu:", error.response ? error.response.data : error.message);
        }
    };


// Sayfa ilk yüklendiğinde
    useEffect(() => {
        fetchProducts();
        fetchData();
        fetchOrderTotal();
    }, []);

    const handlePayment = async () => {
        const totalCost = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (totalCost < 50) {
            setIsLowCostWarning(true);
            return;
        }

        if (selectedAddress === null || selectedCard === null) {
            setShowPopUp(true);
            return;
        }

        try {
            const res = await axios.post("http://localhost:8080/api/customerorder/create", {}, {
                withCredentials: true
            });
            console.log("Order Created:", res.data);

            const completeRes = await axios.post("http://localhost:8080/api/customerorder/finalize", {}, {
                withCredentials: true
            });
            console.log("Order Completed:", completeRes.data);

            clearCarto();

            // Verileri çekmeden önce frontend state'ini de sıfırla
            //setCart([]);
            setOrderTotal({
                totalProductCount: 0,
                totalPrice: 0,
                shippingFee: 0,
                totalAmount: 0,
            });

            // Son verileri backend'den yeniden al
            await fetchOrderTotal();
            await fetchData();
            //refreshAuth();

            setIsOrderConfirmed(true);

            setTimeout(() => {
                setIsOrderConfirmed(false);
                navigate("/order-confirmation");
            }, 3000);
        } catch (error) {
            console.error("Order creation failed:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-2 flex flex-col md:flex-row gap-6">
            {/* Addresses */}

            <div className="w-full md:w-2/3">
                <div className="border p-1 rounded-lg mb-2">
                    <h3 className="font-semibold mb-2 mt-4">Delivery Address</h3>
                    {addresses.filter(address => address.isDefault === true).length > 0 ? (
                        addresses.filter(address => address.isDefault === true).map((address, index) => (
                            <label
                                key={index}
                                className="block p-5 border rounded-b-lg mb-5 cursor-pointer bg-white shadow-lg border-green-500 hover:shadow-xl transition-shadow duration-300"
                            >
                                <input
                                    type="radio"
                                    name="address"
                                    value={index}
                                    checked={selectedAddress === index}
                                    onChange={() => setSelectedAddress(index)}
                                />
                                <div className="mt-2">
                                    <p className="text-left font-bold mb-2">
                                        {address.firstName} {address.lastName}
                                    </p>
                                    <p className="text-left mb-1">{address.phone}</p>
                                    <p className="text-left">{address.address}</p>
                                    <p className="text-left">
                                        {address.district}/{address.city}
                                    </p>
                                </div>
                            </label>
                        ))
                    ) : (
                        <p>No default address found. Please add one.</p>
                    )}
                    <div
                        className="border rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 mt-2"
                        onClick={() => navigate("/address")}
                    >
                        + Add New Address
                    </div>
                </div>

                {/* Payment */}
                <div className="border p-6 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">Payment Method</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            className="border rounded-lg p-4 flex justify-center items-center cursor-pointer hover:bg-gray-100"
                            onClick={() => navigate("/credit-card")}
                        >
                            + Add New Card
                        </div>
                        {savedCards.filter(card => card.isDefault === true).length > 0 ? (
                            savedCards.filter(card => card.isDefault === true).map((card, index) => (
                                <div
                                    key={index}
                                    className={`border rounded-lg p-4 relative cursor-pointer bg-white shadow-md shadow-orange-500 hover:shadow-2xl transition-shadow duration-300 ${selectedCard === index ? 'border-green-500' : ''}`}
                                    onClick={() => setSelectedCard(index)}
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <p className="text-lg">{card.holderName}</p>
                                        {selectedCard === index && (
                                            <FaCheckCircle className="text-green-500"/>
                                        )}
                                    </div>
                                    <p className="text-lg mb-4">
                                        **** **** **** {card.cardNumberLast4}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Expiration Date: {card.expiryMonth}/{card.expiryYear}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>No default card found. Please add one.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Cart Summary */}
            <div className="w-full md:w-1/3 border p-6 rounded-lg bg-white shadow-lg flex flex-col justify-between max-h-[600px] transition-transform transform hover:scale-105 ease-in-out duration-300">
                <h3 className="font-semibold text-2xl text-gray-800 mb-4">Cart Summary</h3>
                {/* Product List (Product Images and Quantities) */}
                <div className="max-h-[300px] overflow-auto mb-4">
                    {cart.map((item, index) => (
                        <div key={index} className="flex items-center mb-1 border-b pb-3">
                            {/* Product Image */}
                            <img
                                src={getImageFromPath(item.imagePath)}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg mr-4 shadow-md"
                            />
                            <div>
                                <p className="font-medium text-lg text-gray-700">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                    {item.quantity} piece -{" "}
                                    <span className="font-semibold text-gray-900">
                            {parseFloat(item.price * item.quantity).toFixed(2)} TL
                        </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cart Summary Details */}
                <div className="space-y-1 text-lg text-gray-700 mt-2">
                    <p className="text">{`Product Total: ${orderTotal.totalPrice} TL`}</p>

                    {/* Conditional Rendering for Shipping Fee */}
                    {orderTotal.shippingFee === 0 ? (
                        <p className="text-green-500 font-semibold">Free Delivery</p>
                    ) : (
                        <p className="text">{`Delivery Fee: ${orderTotal.shippingFee} TL`}</p>
                    )}

                    <p className="font-semibold text-xl mt-2">Total Amount: {orderTotal.totalAmount} TL</p>
                </div>

                {/* Confirm Payment Button */}
                <div className="mt-2">
                    <button
                        onClick={handlePayment}
                        className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-5 rounded-3xl text-xl font-semibold tracking-wide hover:from-green-500 hover:to-green-600 transform hover:scale-105 transition-all duration-300 ease-in-out shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
                        style={{
                            fontFamily: "Roboto, sans-serif",
                        }}
                    >
        <span className="mr-2">
            <FaShoppingBasket
                className="h-7 w-7 text-white inline transform hover:scale-110 transition-all duration-200 ease-in-out"/>
        </span>
                        <span className="mx-1 text-lg font-bold">Confirm Cart</span>
                    </button>
                </div>

            </div>

            {/* Back Button */}
            <div
                className="absolute bottom-36 left-12 cursor-pointer text-4xl text-orange-500 hover:text-orange-600 transition-colors duration-300"
                onClick={() => navigate(-1)}
            >
                <FaArrowLeft />
            </div>

            {/* Pop-up and Confirmation Modals */}
            {isOrderConfirmed && (
                <div
                    className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                >
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <FaShoppingBasket className="text-orange-500 text-4xl mb-4" />
                        <p className="font-semibold text-xl">Your order has been created successfully.</p>
                    </div>
                </div>
            )}

            {showPopUp && (
                <div
                    className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                >
                    <div className="bg-white p-6 rounded-lg  shadow-lg max-w-sm w-full text-center border-2 border-green-500 relative">
                        <button
                            onClick={() => setShowPopUp(false)}
                            className="absolute top-2 right-2 text-2xl text-orange-500 hover:text-orange-700"
                        >
                            ×
                        </button>
                        <div className="flex justify-center items-center mb-4">
                <span className="text-4xl text-orange-500">
                   🏡
                </span>
                        </div>
                        <p className="font-semibold text-xl text-gray-800 mb-4">
                            Please choose address and payment method.
                        </p>
                        <button
                            onClick={() => setShowPopUp(false)}
                            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-orange-600 transition-all duration-300"
                        >
                            Okey
                        </button>
                    </div>
                </div>
            )}


            {isLowCostWarning && (
                <div
                    className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                >
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <p className="font-semibold text-xl text-red-500">
                            Minimum Cart Amount is 50 TL!
                        </p>
                        <button
                            onClick={() => setIsLowCostWarning(false)}
                            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
                        >
                            Okey
                        </button>
                    </div>
                </div>
            )}


        </div>

    );
};
export default PaymentPage;
