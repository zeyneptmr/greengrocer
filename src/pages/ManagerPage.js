import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Clock from "../components/Clock";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { motion } from "framer-motion";
import axios from "axios";

const API_BASE_URL = 'http://localhost:8080';

const ManagerPage = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [ordersData, setOrdersData] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [totalSales, setTotalSales] = useState("0 TL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [calendarData, setCalendarData] = useState({});

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch total sales from the endpoint
                const salesResponse = await axios.get(`${API_BASE_URL}/api/customerorder/total-sales`);
                const totalSalesAmount = salesResponse.data;
                
                const formattedSales = totalSalesAmount.toFixed(2) + '₺';
                setTotalSales(formattedSales);
                
                // Fetch user count
                const userResponse = await axios.get("http://localhost:8080/api/users/count/users");
                setUserCount(userResponse.data);
                
                // Fetch order count
                const orderResponse = await axios.get("http://localhost:8080/api/customerorder/orders/all", { withCredentials: true });
                if (Array.isArray(orderResponse.data)) {
                    setOrderCount(orderResponse.data.length);
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data. Please try again later.");
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);


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

    const salesData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Total Sales",
                data: [12000, 15000, 18000, 20000, 25000, 30000],
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
            },
        ],
    };


    const getOrderCount = (day) => {
        if (!day) return 0;
        
        const dateStr = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        return calendarData[dateStr] || 0;
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-auto">
                <Topbar/>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold text-green-700">Today</h3>
                        <p className="text-xl text-gray-500 font-medium"><Clock/></p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold text-green-700">Total Sales</h3>
                        <p className="text-xl text-gray-500 font-medium">{totalSales}</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold text-green-700">Total Customers</h3>
                        <p className="text-xl text-gray-500 font-medium">{userCount}</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold text-green-700">Orders</h3>
                        <p className="text-xl text-gray-500 font-medium">{orderCount}</p>
                    </div>
                </div>

                <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-xl font-bold text-gray-700">Sales Overview</h3>
                        <Line data={salesData}/>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 overflow-auto h-80">
                        <h3 className="text-xl font-bold text-gray-700">Calendar</h3>
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
                                    <h4 className="text-lg font-semibold text-gray-700">Selected
                                        Month: {months[selectedMonth]}</h4>
                                    <div className="grid grid-cols-7 gap-4 mt-4">
                                        {/* Day headers */}
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
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
                                                        day ? (orderCount > 0 ? "bg-green-100" : "bg-white") : ""
                                                    }`}
                                                >
                                                    {day && (
                                                        <>
                                                            <p>{day}</p>
                                                            {orderCount > 0 && (
                                                                <span className="text-xs text-green-700">
                                                                    {orderCount} {orderCount === 1 ? 'Order' : 'Orders'}
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
                                <h4 className="text-lg font-semibold text-gray-700">Orders This Month</h4>
                                <ul className="mt-2">
                                    {ordersData.length > 0 ? (
                                        ordersData.map(({date, orders}, index) => (
                                            <li key={index} className="p-2 border-b">
                                                {date.toLocaleDateString()} - {orders} {orders === 1 ? 'Order' : 'Orders'}
                                            </li>
                                        ))
                                    ) : (
                                        <p className="p-2">No orders for this month</p>
                                    )}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManagerPage;