import React, { useEffect, useState, useRef, useContext } from "react";
import Sidebar from "../components/Sidebar";
import managerIcon from "../assets/manager.svg";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Info, Eye } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { LanguageContext } from "../context/LanguageContext";
import { getImageFromPath } from "../helpers/imageHelper";

const API_BASE_URL = "http://localhost:8080";


const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => {
        const key = item.replace('./', '');
        images[key] = r(item);
    });
    return images;
};


let images = {};
try {
    images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));
    console.log('Images loaded successfully:', Object.keys(images).length);
} catch (err) {
    console.warn('Could not load images from assets folder:', err.message);
    
    images = {
        'placeholder.png': '/placeholder.png'
    };
}

const CustomerOrderPage = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderProducts, setOrderProducts] = useState([]);
    const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

    const { language } = useContext(LanguageContext);
    const { t } = useTranslation('customerordermanagement');
    
    
    const scrollPositionRef = useRef(0);
    const mainContainerRef = useRef(null);


    const statusSteps = [
        t('orderStatus.orderReceived'), 
        t('orderStatus.confirmed'), 
        t('orderStatus.preparing'), 
        t('orderStatus.dispatched')];
    
    
    const filterOptions = [
        { id: "all", label: t('filters.allOrders') },
        { id: "week", label: t('filters.lastWeek') },
        { id: "month", label: t('filters.lastMonth') },
        { id: "threeMonths", label: t('filters.lastThreeMonths') },
        { id: "year", label: t('filters.lastYear') }
    ];


    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/customerorder/orders/all`, { withCredentials: true });
            if (Array.isArray(res.data)) {
                const sortedOrders = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setAllOrders(sortedOrders);
                setDisplayedOrders(sortedOrders);
            }
            setIsLoading(false);
        } catch (err) {
            console.error("Orders could not be fetched:", err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        
    }, []);

    
    useEffect(() => {
        if (showPopup) {
    
            scrollPositionRef.current = window.scrollY || document.documentElement.scrollTop;
            
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${scrollPositionRef.current}px`;
        } else {
    
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
        
            window.scrollTo(0, scrollPositionRef.current);
        }
    }, [showPopup]);

    
    const filterOrders = (filterId) => {
        if (isUpdating) return;
        
        setActiveFilter(filterId);
        
        if (allOrders.length === 0) {
            setDisplayedOrders([]);
            return;
        }
        
        const now = new Date();
        let filteredList = [];
        
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
        

        setDisplayedOrders(filteredList);
    };

    const handleStatusChange = async (orderId, currentStatus) => {
    
        const statusInEnglish = getStatusInEnglish(currentStatus);
        const nextStatusInEnglish = getNextStatusInEnglish(statusInEnglish);
        
        if (!nextStatusInEnglish || isUpdating) return;

        setIsUpdating(true);
        
        try {
            
            const nextStatus = getStatusTranslation(nextStatusInEnglish);
            
            const updatedAllOrders = allOrders.map(order => {
                if (order.orderId === orderId) {
                    return { ...order, latestStatus: nextStatusInEnglish };
                }
                return order;
            });
            
            setAllOrders(updatedAllOrders);
            
            setDisplayedOrders(prev => 
                prev.map(order => {
                    if (order.orderId === orderId) {
                        return { ...order, latestStatus: nextStatusInEnglish };
                    }
                    return order;
                })
            );
            
            
            await axios.post(
                `${API_BASE_URL}/api/customerorder/orders/${orderId}/status`,
                { status: nextStatusInEnglish },
                { withCredentials: true }
            );
            
        } catch (error) {
            console.error("Status could not be updated:", error);
            fetchOrders();
        } finally {
            setIsUpdating(false);
        }
    };


    const getStatusInEnglish = (translatedStatus) => {
        const statusMapping = {
            [t('orderStatus.orderReceived')]: "Order Received",
            [t('orderStatus.confirmed')]: "Confirmed",
            [t('orderStatus.preparing')]: "Preparing",
            [t('orderStatus.dispatched')]: "Dispatched",
            [t('orderStatus.delivered')]: "Delivered"
        };
        return statusMapping[translatedStatus] || translatedStatus;
    };

    const getNextStatusInEnglish = (currentStatus) => {
        const englishStatusSteps = ["Order Received", "Confirmed", "Preparing", "Dispatched"];
        const currentIndex = englishStatusSteps.indexOf(currentStatus);
        if (currentIndex >= 0 && currentIndex < englishStatusSteps.length - 1) {
            return englishStatusSteps[currentIndex + 1];
        }
        return null;
    };

    // Helper function to translate English status to current language
    const getStatusTranslation = (englishStatus) => {
        const statusMapping = {
            "Order Received": t('orderStatus.orderReceived'),
            "Confirmed": t('orderStatus.confirmed'),
            "Preparing": t('orderStatus.preparing'),
            "Dispatched": t('orderStatus.dispatched'),
            "Delivered": t('orderStatus.delivered')
        };
        return statusMapping[englishStatus] || englishStatus;
    };


    const viewOrderDetails = async (order) => {
        setSelectedOrder(order);
        setLoadingOrderDetails(true);
        setShowPopup(true);
        
        try {
    
            const productsResponse = await axios.get(
                `${API_BASE_URL}/api/orderproduct/by-order/${order.orderId}`,
                { withCredentials: true,
                    params: { language }}
            );
            
            if (Array.isArray(productsResponse.data)) {
                setOrderProducts(productsResponse.data);
            } else {
                setOrderProducts([]);
            }
        } catch (err) {
            console.error(`Error fetching products for order ${order.orderId}:`, err);
            setOrderProducts([]);
        } finally {
            setLoadingOrderDetails(false);
        }
    };


    const calculateTotalProducts = (products) => {
        if (!products || !Array.isArray(products) || products.length === 0) return 0;
        return products.reduce((total, product) => {
            return total + (product.totalPerProduct || 0);
        }, 0).toFixed(2);
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar />
            <main ref={mainContainerRef} className="flex-1 flex flex-col overflow-y-auto">
                <header className="bg-white shadow p-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-green-700">{t('title')}</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-orange-500 font-semibold text-lg">{t('managerPanel')}</span>
                        <img src={managerIcon} alt="Manager" className="w-14 h-14 rounded-full"/>
                    </div>
                </header>

                <div className="p-6">
                    {/* Filter buttons */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {filterOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => filterOrders(option.id)}
                                className={`px-4 py-2 rounded-full ${
                                    activeFilter === option.id 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-white text-green-600 border border-green-600'
                                } transition-colors`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[300px]">
                            <div className="text-xl font-bold text-green-600">{t('loadingOrders')}</div>
                        </div>
                    ) : displayedOrders.length === 0 ? (
                        <div className="text-center p-12 bg-gray-200 rounded-xl shadow-lg text-xl font-semibold text-gray-600">
                            <p>{t('noOrdersFound')}</p>
                            <p className="text-sm text-gray-500 mt-2">{t('tryDifferentFilter')}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-2xl rounded-xl overflow-hidden">
                                <thead className="bg-gradient-to-r from-green-500 to-lime-500 text-white">
                                <tr>
                                <th className="px-4 py-4 text-center text-[16px] font-semibold">{t('table.number')}</th>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">{t('table.orderId')}</th>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">{t('table.createdAt')}</th>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">{t('table.userId')}</th>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">{t('table.email')}</th>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">{t('table.shippingAddress')}</th>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">{t('table.totalAmount')}</th>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">{t('table.status')}</th>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">{t('table.process')}</th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                {displayedOrders.map((order, idx) => {
                                    const englishStatus  = order.latestStatus || "Order Received";
                                    const currentStatus = getStatusTranslation(englishStatus);
                                    return (
                                        <tr key={order.orderId} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-lg">
                                                <div className="flex items-center justify-center">
                                                    <span className="mr-2">{idx + 1}</span>
                                                    <button 
                                                        onClick={() => viewOrderDetails(order)}
                                                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                                        title="View Order Details"
                                                    >
                                                        <Eye size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-lg font-semibold text-gray-700">{order.orderId}</td>
                                            <td className="px-6 py-4 text-base text-gray-600">{order.createdAt?.slice(0, 19).replace("T", " ")}</td>
                                            <td className="px-6 py-4 text-lg">{order.userId}</td>
                                            <td className="px-6 py-4 text-lg">{order.userEmail}</td>
                                            <td className="px-6 py-4 text-base">{order.shippingAddress}</td>
                                            <td className="px-6 py-4 text-lg text-orange-600 font-bold">{order.totalAmount}₺</td>
                                            <td className="px-6 py-4 text-lg">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <span
                                                        className="px-4 py-2 bg-green-100 text-green-800 text-lg rounded-full">
                                                        {currentStatus}
                                                    </span>
                                                    
                                                    <div className="w-7 h-7">
                                                        {englishStatus === "Order Received" && (
                                                            <svg className="w-full h-full text-green-600" fill="none"
                                                                 stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8"/>
                                                                <path
                                                                    d="M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                                            </svg>
                                                        )}

                                                        {englishStatus === "Confirmed" && (
                                                            <svg className="w-full h-full text-yellow-500" fill="none"
                                                                 stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path d="M5 13l4 4L19 7"/>
                                                            </svg>
                                                        )}

                                                        {englishStatus === "Preparing" && (
                                                            <svg className="w-full h-full text-purple-600" fill="none"
                                                                 stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path d="M12 6v6l4 2"/>
                                                                <circle cx="12" cy="12" r="10"/>
                                                            </svg>
                                                        )}

                                                        {englishStatus === "Dispatched" && (
                                                            <svg className="w-full h-full text-orange-500" fill="none"
                                                                 stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path
                                                                    d="M3 7V17H5A2 2 0 0 0 9 17H15A2 2 0 0 0 19 17H21V11L17 7H3Z"
                                                                    strokeLinecap="round" strokeLinejoin="round"/>
                                                                <circle cx="7" cy="17" r="2"/>
                                                                <circle cx="17" cy="17" r="2"/>
                                                            </svg>
                                                        )}

                                                        {englishStatus === "Delivered" && (
                                                            <svg className="w-full h-full text-blue-500" fill="none"
                                                                 stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path d="M5 12h14M12 5l7 7-7 7"/>
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 space-y-2">
                                                {statusSteps.map((step, i) => {
                                                    const englishStep = getStatusInEnglish(step);
                                                    const isCurrentStatus = step === currentStatus;
                                                    const isNextPossibleStatus = statusSteps.indexOf(step) === statusSteps.indexOf(currentStatus) + 1;
                                                    const isOrderReceived = englishStep === "Order Received";
                                                    const isDisabled = isOrderReceived || (!isCurrentStatus && !isNextPossibleStatus);
                                                    
                                                    let buttonClass = "w-full py-2 rounded-md text-sm font-medium transition-all duration-300 ";
                                                    
                                                    if (isCurrentStatus) {
                                                        buttonClass += "bg-green-600 text-white";
                                                    } else if (isOrderReceived) {
                                                        buttonClass += "bg-gray-200 text-gray-500 cursor-not-allowed";
                                                    } else if (isNextPossibleStatus) {
                                                        buttonClass += "bg-orange-400 text-white hover:bg-orange-500";
                                                    } else {
                                                        buttonClass += "bg-gray-200 text-gray-500 cursor-not-allowed";
                                                    }
                                                    
                                                    return (
                                                        <button
                                                            key={i}
                                                            className={buttonClass}
                                                            disabled={isDisabled}
                                                            onClick={() => {
                                                                if (!isDisabled && isNextPossibleStatus) {
                                                                    handleStatusChange(order.orderId, currentStatus);
                                                                }
                                                            }}
                                                        >
                                                            {step}
                                                        </button>
                                                    );
                                                })}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Order Details Popup */}
            <AnimatePresence>
                {showPopup && selectedOrder && (
                    <motion.div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPopup(false)}
                    >
                        <motion.div 
                            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto p-6"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                {t('orderDetails.title')} {t('table.number')}{selectedOrder.orderId}
                                </h2>
                                <button 
                                    onClick={() => setShowPopup(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
                            {loadingOrderDetails ? (
                                <div className="flex justify-center items-center p-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Order Information */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-3">{t('orderDetails.orderInfo')}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">{t('table.orderId')}:</span> {selectedOrder.orderId}
                                                </p>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">{t('orderDetails.date')}:</span> {selectedOrder.createdAt?.slice(0, 10)}
                                                </p>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">{t('orderDetails.time')}:</span> {selectedOrder.createdAt?.slice(11, 19)}
                                                </p>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">{t('orderDetails.status')}:</span>{" "}
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                                        {getStatusTranslation(selectedOrder.latestStatus || "Order Received")}
                                                    </span>
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">{t('orderDetails.customerEmail')}:</span> {selectedOrder.userEmail}
                                                </p>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">{t('table.userId')}:</span> {selectedOrder.userId}
                                                </p>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">{t('table.shippingAddress')}:</span> {selectedOrder.shippingAddress}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Products */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-3">{t('orderDetails.products')}</h3>
                                        
                                        {orderProducts && orderProducts.length > 0 ? (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    {orderProducts.map((product, index) => (
                                                        <div key={index} className="flex border rounded p-3 bg-gray-50">
                                                            <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 mr-3 overflow-hidden">
                                                                {product.imagePath ? (
                                                                    <img 
                                                                        src={getImageFromPath(product.imagePath, images)}
                                                                        alt={product.translatedName}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = "/api/placeholder/80/80";
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                        <img
                                                                            src="/api/placeholder/80/80"
                                                                            alt="Product placeholder"
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <h5 className="font-medium text-gray-800">{product.translatedName}</h5>
                                                                <p className="text-sm text-gray-600">
                                                                    {product.quantity} x {product.pricePerProduct?.toFixed(2)}₺
                                                                </p>
                                                                <p className="text-sm font-medium text-green-700 mt-1">
                                                                {t('orderDetails.total')}: {product.totalPerProduct?.toFixed(2)}₺
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            
                                                {/* Order Totals */}
                                                <div className="mt-4 text-right">
                                                    <p className="text-lg font-bold text-green-700">
                                                    {t('orderDetails.productsTotal')}: {calculateTotalProducts(orderProducts)}₺
                                                    </p>
                                                    <p className="text-xl font-bold text-green-800 mt-2">
                                                    {t('orderDetails.grandTotal')}: {selectedOrder.totalAmount?.toFixed(2)}₺
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-center text-gray-500 py-4">{t('orderDetails.noProductsFound')}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            <div className="mt-6 text-right">
                                <button 
                                    onClick={() => setShowPopup(false)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                >
                                    {t('orderDetails.close')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomerOrderPage;