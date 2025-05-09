import React, { useEffect, useState , useContext} from "react";
import { ShoppingCart, CheckCircle, Truck, Package, Clock } from "lucide-react";
import { FaApple } from 'react-icons/fa';
import { generateInvoice } from "../helpers/generateInvoice"; // senin dosya yolu neyse ona göre değiştir
import { FaFileInvoice } from "react-icons/fa";
import { useTranslation, Trans } from "react-i18next";
import { LanguageContext } from "../context/LanguageContext";
import { getImageFromPath } from "../helpers/imageHelper";

import axios from "axios";

const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => {
        images[item.replace('./', '')] = r(item);
    });
    return images;
};
const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));


const statusIcons = {
    "Order Received": <Package className="w-6 h-6" />,
    "Confirmed": <CheckCircle className="w-6 h-6" />,
    "Preparing": <Clock className="w-6 h-6" />,
    "Dispatched": <Truck className="w-6 h-6" />,
};

export default function MyOrdersPage() {
    const { t } = useTranslation("myorders");
    const { language } = useContext(LanguageContext);

    // Filtre seçenekleri
    const filterOptions = [
        { id: "all", label: t("filters.all") },
        { id: "week", label: t("filters.week") },
        { id: "month", label: t("filters.month") },
        { id: "threeMonths", label: t("filters.threeMonths") },
        { id: "year", label: t("filters.year") }
    ];

    const [allOrders, setAllOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [productsByOrderId, setProductsByOrderId] = useState({});
    const [activeFilter, setActiveFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    const handleGeneratePDF = async (orderId) => {
        try {
            const userResponse = await axios.get('http://localhost:8080/api/users/me', {
                withCredentials: true,
            });

            if (userResponse.status !== 200) {
                alert('Kullanıcı bilgileri alınamadı');
                return;
            }

            const userData = userResponse.data;

            const orderResponse = await axios.get(`http://localhost:8080/api/customerorder/order/${orderId}`, {
                withCredentials: true,
            });

            if (orderResponse.status !== 200) {
                alert('Sipariş bilgileri alınamadı');
                return;
            }

            const orderDetails = orderResponse.data;

            const productsResponse = await axios.get(`http://localhost:8080/api/orderproduct/by-order/${orderId}`, {
                withCredentials: true,
                params: { language }
            });

            if (productsResponse.status !== 200) {
                alert('Sipariş ürünleri alınamadı');
                return;
            }

            const products = productsResponse.data;

            const orderData = {
                userName: userData.name,
                userSurname: userData.surname,
                userEmail: userData.email,
                userPhoneNumber: userData.phoneNumber,
                orderId: orderDetails.orderId,
                orderDate: orderDetails.createdAt,
                shippingFee: orderDetails.shippingFee,
                totalPrice: orderDetails.totalPrice,
                address: orderDetails.shippingAddress,
                items: products.map(product => ({
                    name: product.translatedName || product.productName,
                    quantity: product.quantity,
                    price: product.pricePerProduct
                })),
                totalAmount: orderDetails.totalAmount,
                language: language,
            };

            generateInvoice(orderData); // PDF oluşturma fonksiyonunu çağır
        } catch (error) {
            console.error('Hata:', error);
            alert('Fatura oluşturulurken hata oluştu');
        }
    };


    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/api/customerorder/orders/my", { withCredentials: true });
            // Siparişleri tarihe göre sıralayın (en yeni en üstte)
            const sortedOrders = response.data.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            setAllOrders(sortedOrders);
            setDisplayedOrders(sortedOrders);
            setIsLoading(false);
        } catch (error) {
            console.error("Siparişler alınamadı:", error);
            setIsLoading(false);
        }
    };

    const fetchOrderProducts = async (orderId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/orderproduct/by-order/${orderId}`,
                { withCredentials: true, params: { language } });
            setProductsByOrderId(prev => ({ ...prev, [orderId]: response.data }));
        } catch (error) {
            console.error("Sipariş ürünleri alınamadı", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Dil değişince ürün isimlerini güncelle
    useEffect(() => {
        if (displayedOrders.length > 0) {
            displayedOrders.forEach(order => {
                fetchOrderProducts(order.orderId);
            });
        }
    }, [language]);



    // Filtre değiştiğinde siparişleri filtreleme
    const filterOrders = (filterId) => {
        setActiveFilter(filterId);
        
        if (allOrders.length === 0) return;
        
        const now = new Date();
        let filteredList = [];
        
        console.log("Filtering orders with filter:", filterId);
        console.log("All orders count:", allOrders.length);
        
        switch(filterId) {
            case "week":
            
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filteredList = allOrders.filter(order => new Date(order.createdAt) >= oneWeekAgo);
                break;
            case "month":
        
                const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                filteredList = allOrders.filter(order => new Date(order.createdAt) >= oneMonthAgo);
                break;
            case "threeMonths":
            
                const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                filteredList = allOrders.filter(order => new Date(order.createdAt) >= threeMonthsAgo);
                break;
            case "year":
            
                const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                filteredList = allOrders.filter(order => new Date(order.createdAt) >= oneYearAgo);
                break;
            default:
        
                filteredList = [...allOrders];
        }
        
        console.log("Filtered orders count:", filteredList.length);
        setDisplayedOrders(filteredList);
    };

    const getStatusSteps = (currentStatus) => {
        const allSteps = ["Order Received", "Confirmed", "Preparing", "Dispatched"];
        return allSteps.map(status => ({
            name: status,
            active: allSteps.indexOf(status) <= allSteps.indexOf(currentStatus)
        }));
    };


    console.log("Active filter:", activeFilter);
    console.log("All orders:", allOrders.length);
    console.log("Displayed orders:", displayedOrders.length);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 py-10 px-6 lg:px-20">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-orange-600 mb-8 text-center">{t("title")}</h1>
                
                {/* Filtre butonları */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {filterOptions.map(option => (
                        <button
                            key={option.id}
                            onClick={() => filterOrders(option.id)}
                            className={`px-4 py-2 rounded-full ${
                                activeFilter === option.id 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-white text-orange-500 border border-orange-500'
                            } transition-colors`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[300px]">
                        <div className="text-xl font-bold text-orange-500">{t("loading")}</div>
                    </div>
                ) : Array.isArray(displayedOrders) && displayedOrders.length > 0 ? (
                    <div className="flex flex-col gap-12">
                        {displayedOrders.map((order) => (
                            <div key={order.orderId} className="flex flex-col lg:flex-row gap-6">

                                {/* Sipariş Takip İkonları */}
                                <div className="flex flex-col justify-center items-center gap-4">
                                    {getStatusSteps(order.latestStatus).map((step, index) => (
                                        <div key={index} className={`rounded-full p-2 ${step.active ? 'bg-green-500 text-white' : 'bg-orange-300 text-white'}`}>
                                            {statusIcons[step.name]}
                                        </div>
                                    ))}
                                </div>

                                {/* Sipariş Kartı */}
                                <div
                                    className="relative bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row w-full"
                                    onMouseEnter={() => {
                                        if (!productsByOrderId[order.orderId]) {
                                            fetchOrderProducts(order.orderId);
                                        }
                                    }}
                                >
                                    <button
                                        className="absolute top-4 right-4 flex items-center gap-2 bg-orange-500 hover:bg-gradient-to-r hover:from-green-400 hover:to-green-600 text-white text-sm px-4 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
                                        onClick={() => handleGeneratePDF(order.orderId)}
                                    >
                                        <FaFileInvoice className="w-5 h-5"/>
                                    </button>


                                    {/* Ürünler */}
                                    <div className="md:w-1/2 pr-4 relative">
                                        {/* Sipariş No Sol Üst */}
                                        <div className="absolute top-0 left-0 text-xs font-semibold text-orange-500">
                                            {t("orderId")}: {order.orderId}
                                        </div>

                                        <div className="mt-4 max-h-[230px] overflow-y-auto custom-scrollbar pr-2">
                                            {/* Yükleniyor mesajı */}
                                            {!productsByOrderId[order.orderId] ? (
                                                <div
                                                    className="flex justify-center items-center text-green-600 font-semibold gap-2 h-[230px]">
                                                    {/* Elma İkonu */}
                                                    <ShoppingCart className="w-6 h-6 text-green-600"/>
                                                    <span>{t("loadingProducts")}</span>
                                                </div>
                                            ) : (
                                                productsByOrderId[order.orderId].map((product, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center py-2 border-b border-orange-100"
                                                    >
                                                        <img
                                                            src={getImageFromPath(product.imagePath, images)}
                                                            alt={product.translatedName}
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                        <div className="ml-4 flex-1">
                                                            <p className="font-semibold">{product.translatedName}</p>
                                                            <p className="text-sm text-gray-500">{t("piece")}: {product.quantity}</p>
                                                        </div>
                                                        <span
                                                            className="font-semibold">{product.totalPerProduct} ₺</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Sipariş Bilgileri */}
                                    <div
                                        className="md:w-1/2 border-l border-orange-200 pl-4 flex flex-col justify-between">
                                        <div className="flex flex-col gap-2">
                                            {/* Sipariş No */}
                                            <div className="text-sm text-gray-600 inline">{t("orderId")}:</div>
                                            <div className="font-semibold inline ml-2">{order.orderId}</div>

                                            {/* Tarih */}
                                            <div className="text-sm text-gray-600 inline ml-4">{t("date")}:</div>
                                            <div
                                                className="font-medium inline ml-2">{new Date(order.createdAt).toLocaleDateString()}</div>

                                            {/* Saat */}
                                            <div className="text-sm text-gray-600 inline ml-4">{t("time")}:</div>
                                            <div
                                                className="font-medium inline ml-2">{new Date(order.createdAt).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</div>

                                            {/* Toplam Tutar */}
                                            <div className="text-sm text-gray-600 inline ml-4">{t("totalAmount")}:</div>
                                            <div
                                                className="font-bold text-lg text-orange-600 inline ml-2">{order.totalAmount} ₺
                                            </div>

                                            {/* Durum */}
                                            <div className="flex justify-end">
                                                <div
                                                    className={`font-semibold flex items-center gap-2 inline ml-2 ${order.latestStatus === "Dispatched" ? 'text-green-600' : 'text-orange-500'}`}>
                                                    {statusIcons[order.latestStatus]} <span>{t(`status.${order.latestStatus}`)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center min-h-[300px]">
                        <h2 className="text-xl font-bold text-green-600">{t("noOrders")}</h2>
                    </div>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #f97316; /* orange-500 */
                    border-radius: 8px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
            `}</style>
        </div>
    );
}