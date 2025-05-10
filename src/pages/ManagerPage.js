import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Clock from "../components/Clock";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";
import { useTranslation } from 'react-i18next';
import { getImageFromPath } from "../helpers/imageHelper";

const API_BASE_URL = 'http://localhost:8080';

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

const ManagerPage = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const { language } = useContext(LanguageContext);
    const { t } = useTranslation('manager');
    const [ordersData, setOrdersData] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [totalSales, setTotalSales] = useState("0 TL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [calendarData, setCalendarData] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [dateOrders, setDateOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
    const [salesChartData, setSalesChartData] = useState({
        labels: [],
        datasets: [
            {
                label: t("total_sales"),
                data: [],
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
            },
        ],
    });

    // Get month names based on current language
    const getMonthNames = () => {
        return [
            t("january"), t("february"), t("march"), t("april"),
            t("may"), t("june"), t("july"), t("august"),
            t("september"), t("october"), t("november"), t("december")
        ];
    };

    const months = getMonthNames();

    // Update month names when language changes
    useEffect(() => {
        // Update months array when language changes
        const updatedMonths = getMonthNames();
        
        // Update chart data with translated label
        setSalesChartData(prevData => ({
            ...prevData,
            datasets: [{
                ...prevData.datasets[0],
                label: t("total_sales") + "(₺)"
            }]
        }));
    }, [language, t]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const salesResponse = await axios.get(`${API_BASE_URL}/api/customerorder/total-sales`);
                const totalSalesAmount = salesResponse.data;

                const formattedSales = totalSalesAmount.toFixed(2) + '₺';
                setTotalSales(formattedSales);

                const userResponse = await axios.get(`${API_BASE_URL}/api/users/count/users`);
                setUserCount(userResponse.data);

                const orderResponse = await axios.get(`${API_BASE_URL}/api/customerorder/orders/all`, { withCredentials: true });
                if (Array.isArray(orderResponse.data)) {
                    setOrderCount(orderResponse.data.length);
                }

                const monthlySalesResponse = await axios.get(`${API_BASE_URL}/api/customerorder/monthly-sales`, {
                    params: { year: selectedYear },
                    withCredentials: true
                });

                const monthMap = {
                    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
                };

                const monthEntries = Object.entries(monthlySalesResponse.data)
                    .map(([key, value]) => ({
                        month: key,
                        value,
                        index: monthMap[key] ?? 99 // Bilinmeyen varsa sona atsın
                    }))
                    .sort((a, b) => a.index - b.index); // Sıralama: Ocaktan Aralığa

                const translatedLabels = monthEntries.map(item => months[item.index] || item.month);
                const salesValues = monthEntries.map(item => item.value);

                setSalesChartData({
                    labels: translatedLabels,
                    datasets: [
                        {
                            label: t("total_sales") + "(₺)",
                            data: salesValues,
                            borderColor: "#4CAF50",
                            backgroundColor: "rgba(76, 175, 80, 0.2)",
                        },
                    ],
                });

                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(t("loading_error"));
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedYear, language, t]);

    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/customerorder/orders-by-date`, {
                    params: {
                        year: selectedYear,
                        month: selectedMonth + 1 
                    },
                    withCredentials: true
                });
                
                setCalendarData(response.data);
                
                const monthOrdersList = Object.entries(response.data).map(([date, count]) => ({
                    date: new Date(date),
                    orders: count
                })).filter(item => item.orders > 0);
                
                setOrdersData(monthOrdersList);
            } catch (err) {
                console.error("Error fetching calendar data:", err);
            }
        };
        
        if (selectedMonth !== null) {
            fetchCalendarData();
        }
    }, [selectedYear, selectedMonth]);

    const fetchOrdersForDate = async (dateStr) => {
        setLoadingOrders(true);
        try {
            const ordersResponse = await axios.get(`${API_BASE_URL}/api/customerorder/orders/all`, { 
                withCredentials: true 
            });
            
            if (!Array.isArray(ordersResponse.data)) {
                throw new Error("Invalid order data received");
            }

            const dateOrders = ordersResponse.data.filter(order => {
                if (!order.createdAt) return false;

                const orderDate = new Date(order.createdAt);

                // Local tarih karşılaştırması (UTC problemi çözülüyor)
                const localDateStr = orderDate.getFullYear() + "-" +
                    String(orderDate.getMonth() + 1).padStart(2, '0') + "-" +
                    String(orderDate.getDate()).padStart(2, '0');

                return localDateStr === dateStr;
            });


            // Sort orders by createdAt timestamp in descending order (newest first)
            const sortedDateOrders = dateOrders.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            
            const ordersWithProducts = await Promise.all(sortedDateOrders.map(async (order) => {
                try {
                    const productsResponse = await axios.get(`${API_BASE_URL}/api/orderproduct/by-order/${order.orderId}`, {
                        withCredentials: true, params: { language }
                    });
                    
                    return {
                        ...order,
                        products: Array.isArray(productsResponse.data) ? productsResponse.data : []
                    };
                } catch (err) {
                    console.error(`Error fetching products for order ${order.orderId}:`, err);
                    return {
                        ...order,
                        products: [],
                        error: "Failed to fetch products"
                    };
                }
            }));
            
            setDateOrders(ordersWithProducts);
            setCurrentOrderIndex(0); // Reset to first order (now the most recent one)
        } catch (err) {
            console.error("Error fetching orders for date:", err);
            setDateOrders([]);
        } finally {
            setLoadingOrders(false);
        }
    };

    const generateCalendarDays = (year, month) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        let days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null); 
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    };

    const handleMonthClick = (index) => {
        setSelectedMonth(index);
    };

    const getOrderCount = (day) => {
        if (!day) return 0;
        
        const dateStr = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        return calendarData[dateStr] || 0;
    };

    const handleDayClick = (day) => {
        if (!day) return;
        
        const dateStr = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        const orderCount = calendarData[dateStr] || 0;
        
        if (orderCount > 0) {
            setSelectedDate(dateStr);
            fetchOrdersForDate(dateStr);
            setShowPopup(true);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const calculatedTotalProducts = (products) => {
        if (!products || !Array.isArray(products) || products.length === 0) return 0;
        return products.reduce((total, product) => {
            return total + (product.totalPerProduct || 0);
        }, 0).toFixed(2);
    };

    const handleNextOrder = () => {
        if (currentOrderIndex < dateOrders.length - 1) {
            setCurrentOrderIndex(currentOrderIndex + 1);
        }
    };

    const handlePreviousOrder = () => {
        if (currentOrderIndex > 0) {
            setCurrentOrderIndex(currentOrderIndex - 1);
        }
    };

    // Get the appropriate day names based on language
    const getDayNames = () => {
        if (language === 'tr') {
            return ['Pzr', 'Pzt', 'Sal', 'Çrş', 'Prş', 'Cum', 'Cmt'];
        }
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', { 
                                style: 'currency', 
                                currency: 'TRY',
                                minimumFractionDigits: 2
                            }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return value.toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US') + ' ₺';
                    }
                }
            }
        }
    };

    // Get localized text for orders based on language and count
    const getOrdersText = (count) => {
        if (language === 'tr') {
            return count === 1 ? 'Sipariş' : 'Sipariş';
        }
        return count === 1 ? 'Order' : 'Orders';
    };

    // Get localized navigation buttons text
    const getNavButtonText = (type) => {
        if (type === 'prev') {
            return language === 'tr' ? 'Önceki' : 'Previous';
        }
        return language === 'tr' ? 'Sonraki' : 'Next';
    };

    // Get localized order count text
    const getOrderCountText = (current, total) => {
        if (language === 'tr') {
            return `Sipariş ${current} / ${total}`;
        }
        return `Order ${current} of ${total}`;
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-auto">
                <Topbar/>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold text-green-700">{t("today")}</h3>
                        <p className="text-xl text-gray-500 font-medium"><Clock/></p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold text-green-700">{t("total_sales")}</h3>
                        <p className="text-xl text-gray-500 font-medium">{totalSales}</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold text-green-700">{t("total_customer")}</h3>
                        <p className="text-xl text-gray-500 font-medium">{userCount}</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold text-green-700">{t("orders")}</h3>
                        <p className="text-xl text-gray-500 font-medium">{orderCount}</p>
                    </div>
                </div>

                <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-700">
                                {t("sales_overview")} ({selectedYear})
                            </h3>
                            <select
                                value={selectedYear}
                                onChange={handleYearChange}
                                className="p-2 border rounded"
                            >
                                {[2023, 2024, 2025, 2026].map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <p>{language === 'tr' ? 'Satış verileri yükleniyor...' : 'Loading sales data...'}</p>
                            </div>
                        ) : (
                            <Line data={salesChartData} options={chartOptions} />
                        )}
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 overflow-auto h-80">
                        <h3 className="text-xl font-bold text-gray-700">{t("calendar")}</h3>
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.5}}
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                {/* Year Selector */}
                                <select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    className="p-2 border rounded"
                                >
                                    {[2023, 2024, 2025, 2026].map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>

                                {/* Month Selector */}
                                <div className="flex overflow-x-auto space-x-2 scrollbar-hide">
                                    {months.map((month, index) => (
                                        <button
                                            key={index}
                                            className={`p-2 rounded min-w-max ${
                                                selectedMonth === index ? "bg-green-500 text-white" : "bg-gray-200"
                                            }`}
                                            onClick={() => handleMonthClick(index)}
                                        >
                                            {month}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedMonth !== null && (
                                <div className="mt-4">
                                    <h4 className="text-lg font-semibold text-gray-700">
                                        {t("selected_month")}: {months[selectedMonth]}
                                    </h4>
                                    <div className="grid grid-cols-7 gap-4 mt-4">
                                        {/* Day headers - use language-aware day names */}
                                        {getDayNames().map((day, index) => (
                                            <div key={`header-${index}`} className="text-center font-semibold text-gray-600">
                                                {day}
                                            </div>
                                        ))}
                                        
                                        {/* Calendar days */}
                                        {generateCalendarDays(selectedYear, selectedMonth).map((day, index) => {
                                            const orderCount = getOrderCount(day);
                                            return (
                                                <div
                                                    key={index}
                                                    className={`p-2 text-center rounded ${
                                                        day ? (orderCount > 0 ? "bg-green-100 cursor-pointer hover:bg-green-200" : "bg-white") : ""
                                                    }`}
                                                    onClick={() => handleDayClick(day)}
                                                >
                                                    {day && (
                                                        <>
                                                            <p>{day}</p>
                                                            {orderCount > 0 && (
                                                                <span className="text-xs text-green-700">
                                                                    {orderCount} {getOrdersText(orderCount)}
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4">
                                <h4 className="text-lg font-semibold text-gray-700">{t("orders_this_month")}</h4>
                                <ul className="mt-2">
                                    {ordersData.length > 0 ? (
                                        ordersData.map(({date, orders}, index) => (
                                            <li key={index} className="p-2 border-b">
                                                {date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')} - {orders} {getOrdersText(orders)}
                                            </li>
                                        ))
                                    ) : (
                                        <p className="p-2">{t("no_order_message")}</p>
                                    )}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
            
            {/* Order Details Popup with Pagination */}
            <AnimatePresence>
                {showPopup && (
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
                                    {language === 'tr' ? 'Tarih için Siparişler:' : 'Orders for'} {selectedDate && formatDate(selectedDate)}
                                </h2>
                                <button 
                                    onClick={() => setShowPopup(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
                            {loadingOrders ? (
                                <div className="flex justify-center items-center p-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                                </div>
                            ) : dateOrders.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">{t("order_detail_message")}</p>
                            ) : (
                                <>
                                    {/* Single Order Display */}
                                    {dateOrders.length > 0 && (
                                        <div className="border rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-xl font-semibold text-gray-700">
                                                    {t("orders")} #{dateOrders[currentOrderIndex].orderId}
                                                </h3>
                                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                                     {t(`statuses.${dateOrders[currentOrderIndex].latestStatus}`)}
                                                </span>
                                            </div>
                                            
                                            <div className="mb-4">
                                                <p className="text-gray-600">
                                                    <span className="font-medium">{t("customer")}:</span> {dateOrders[currentOrderIndex].userEmail}
                                                </p>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">{t("order_time")}:</span> {new Date(dateOrders[currentOrderIndex].createdAt).toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US')}
                                                </p>
                                            </div>
                                            
                                            <h4 className="font-medium text-lg text-gray-700 mb-2">{t("products")}</h4>
                                            
                                            {dateOrders[currentOrderIndex].products && dateOrders[currentOrderIndex].products.length > 0 ? (
                                                <>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {dateOrders[currentOrderIndex].products.map((product, productIndex) => (
                                                            <div key={productIndex} className="flex border rounded p-3 bg-gray-50">
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
                                                                        {language === 'tr' ? 'Toplam' : 'Total'}: {product.totalPerProduct?.toFixed(2)}₺
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4 text-right">
                                                        <p className="text-lg font-bold text-green-700">
                                                            {t("products_total")}: {calculatedTotalProducts(dateOrders[currentOrderIndex].products)}₺
                                                        </p>
                                                        <p className="text-xl font-bold text-green-800 mt-2">
                                                            {t("grand_total")}: {dateOrders[currentOrderIndex].totalAmount?.toFixed(2)}₺
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-center text-gray-500 py-4">{t("no_product_message")}</p>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Pagination Controls*/}
                                    {dateOrders.length > 0 && (
                                        <div className="flex justify-between items-center mt-6">
                                            <button 
                                                onClick={handlePreviousOrder}
                                                disabled={currentOrderIndex === 0}
                                                className={`flex items-center px-3 py-2 rounded ${
                                                    currentOrderIndex === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                            >
                                                <ChevronLeft size={16} className="mr-1" />
                                                {getNavButtonText('prev')}
                                            </button>
                                            
                                            <span className="text-gray-600">
                                                {getOrderCountText(currentOrderIndex + 1, dateOrders.length)}
                                            </span>
                                            
                                            <button 
                                                onClick={handleNextOrder}
                                                disabled={currentOrderIndex === dateOrders.length - 1}
                                                className={`flex items-center px-3 py-2 rounded ${
                                                    currentOrderIndex === dateOrders.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                            >
                                                {getNavButtonText('next')}
                                                <ChevronRight size={16} className="ml-1" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManagerPage;