

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { FaShoppingCart } from 'react-icons/fa';
import girlImg from '../assets/girl.png';

const PaymentPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [savedCards, setSavedCards] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isOrderConfirmed, setIsOrderConfirmed] = useState(false); // Sipariş onay durumunu tutan state
    const [isLowCostWarning, setIsLowCostWarning] = useState(false); // Minimum tutar uyarısı
    const [showPopUp, setShowPopUp] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];
        setAddresses(storedAddresses);

        const storedCards = JSON.parse(localStorage.getItem("savedCards")) || [];
        setSavedCards(storedCards);

        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
        const groupedCart = existingCart.reduce((acc, item) => {
            const existingItem = acc.find(i => i.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity ?? 1; // Eğer quantity yoksa 1 ata
            } else {
                acc.push({ ...item, quantity: item.quantity ?? 1 });
            }
            return acc;
        }, []);
        setCart(groupedCart);
    }, []);  // sadece component mount edildiğinde çalışması için boş array ile useEffect'i tetikleyin.


    const handlePayment = () => {
        const totalCost = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Eğer toplam tutar 50 TL'den az ise uyarıyı göster
        if (totalCost < 50) {
            setIsLowCostWarning(true); // Uyarıyı aktif et
            return;
        }

        if (selectedAddress === null || selectedCard === null) {
            setShowPopUp(true);
            return;
        }

        // Sepet verilerini localStorage'da "orderinfo" adlı bir array'e kaydet
        const orderData = {
            name: addresses[selectedAddress]?.firstName + " " + addresses[selectedAddress]?.lastName,
            address: addresses[selectedAddress],
            cart,
            totalCost: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        };

        const existingOrders = JSON.parse(localStorage.getItem("orderinfo")) || [];
        localStorage.setItem("orderinfo", JSON.stringify([...existingOrders, orderData]));

        // Sepeti localStorage'dan kaldır
        sessionStorage.removeItem("cart");


        // Sepet state'ini sıfırla
        setCart([]);

        localStorage.removeItem("cart");
        // Bu sayfa yeniden yükleyecektir

        // Sipariş başarıyla oluşturuldu
        setIsOrderConfirmed(true);

        // 3 saniye sonra sipariş başarı mesajını gizle
        setTimeout(() => {
            setIsOrderConfirmed(false);
            navigate("/order-confirmation");
        }, 3000);
    };


    const totalCost = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = totalCost > 500 ? 0 : 49;
    const finalCost = totalCost + shippingCost;


    return (
        <div className="max-w-6xl mx-auto p-2 flex gap-6">
            {/* Sol taraf - Adresler */}
            <div className="w-2/3">
                <div className="border p-1 rounded-lg mb-2">
                    <h3 className="font-semibold mb-2 mt-4 ">Teslimat Adresin</h3>
                    {addresses.length > 0 ? (
                        addresses.map((address, index) => (
                            <label key={index}
                                   className="block p-5 border rounded-b-lg mb-5 cursor-pointer bg-white shadow-lg border-green-500 hover:shadow-xl transition-shadow duration-300">
                                <input
                                    type="radio"
                                    name="address"
                                    value={index}
                                    checked={selectedAddress === index}
                                    onChange={() => setSelectedAddress(index)}
                                />
                                <div className="mt-2">
                                    <p className="text-left font-bold mb-2">{address.firstName} {address.lastName}</p>
                                    <p className="text-left mb-1">{address.phone}</p>
                                    <p className="text-left">{address.address}</p>
                                    <p className="text-left">{address.district}/{address.city}</p>
                                </div>
                            </label>
                        ))
                    ) : (
                        <p>Adres bulunamadı. Lütfen bir adres ekleyin.</p>
                    )}
                    <div className="border rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 mt-2"
                         onClick={() => navigate("/address")}>
                        + Yeni Adres Ekle
                    </div>
                </div>

                {/* Ödeme Yöntemi */}
                <div className="border p-6 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2 ">Ödeme Yöntemin</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            className="border rounded-lg p-4 flex justify-center items-center cursor-pointer hover:bg-gray-100"
                            onClick={() => navigate("/credit-card")}>
                            + Yeni Kart Ekle
                        </div>
                        {savedCards.length > 0 ? (
                            savedCards.map((card, index) => (
                                <div
                                    key={index}
                                    className={`border rounded-lg p-4 relative cursor-pointer bg-white shadow-md  shadow-orange-500 hover:shadow-2xl transition-shadow duration-300 ${selectedCard === index ? 'border-green-500' : ''}`}
                                    onClick={() => setSelectedCard(index)}
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <p className="text-lg">{card.holderName}</p>
                                        {selectedCard === index && <FaCheckCircle className="text-green-500"/>}
                                    </div>
                                    <p className="text-lg mb-4">**** **** **** {card.cardNumber.slice(-4)} </p>
                                    <p className="text-sm text-gray-500 ">Son Kullanma
                                        Tarihi: {card.expiryMonth}/{card.expiryYear} </p>
                                </div>
                            ))
                        ) : (
                            <p>Kayıtlı kart bulunamadı. Lütfen bir kart ekleyin.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Sağ taraf - Sepet Özeti */}
            {/* Sağ taraf - Sepet Özeti */}
            <div className="w-1/3 border p-4 rounded-lg bg-white shadow-md max-h-[400px] flex flex-col justify-between">
                <h3 className="font-semibold mb-6">Sepet Özeti</h3>
                <div className="max-h-[300px] overflow-auto mb-4">
                    {cart.map((item, index) => (
                        <div key={index} className="flex items-center mb-2">
                            {/* Ürün Görseli */}
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded mr-2"
                            />
                            <p>{item.name} - {item.quantity} adet - {item.price * item.quantity} TL</p>
                        </div>
                    ))}
                </div>

                <div className="mt-auto"> {/* Bu kısımda mt-auto ile buton her zaman en alta yerleşecek */}
                    <button
                        onClick={handlePayment}
                        className="w-full bg-orange-500 text-white py-5 rounded-3xl text-xl font-bold tracking-wide hover:bg-orange-600 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg hover:shadow-2xl"
                        style={{
                            fontFamily: 'Roboto, sans-serif'
                        }}
                    >
            <span className="mr-2">
                <FaShoppingCart className="h-6 w-6 text-white inline"/>
            </span>
                        <span className="mx-1"></span> {finalCost} TL
                    </button>
                </div>
            </div>


            {/* Sipariş Onayı Kutucuğu */}
            {isOrderConfirmed && (
                <div
                    className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <FaShoppingCart className="text-orange-500 text-4xl mb-4"/>
                        <p className="font-semibold text-xl">Siparişiniz başarıyla oluşturuldu</p>
                    </div>
                </div>
            )}

            {showPopUp && (
                <div
                    className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <p className="font-semibold text-xl text-red-500">Lütfen adres ve ödeme yöntemi seçiniz.</p>
                        <button
                            onClick={() => setShowPopUp(false)}
                            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
                        >
                            Tamam
                        </button>
                    </div>
                </div>
            )}
            {isLowCostWarning && (
                <div
                    className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <p className="font-semibold text-xl text-red-500">En az 50 TL ilk ürün eklemelisiniz.</p>
                        <button
                            onClick={() => setIsLowCostWarning(false)}
                            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
                        >
                            Tamam
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
};

export default PaymentPage;

