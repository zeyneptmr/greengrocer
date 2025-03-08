import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Clock from "../components/Clock";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { motion } from "framer-motion";

const ManagerPage = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [ordersData, setOrdersData] = useState([]);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Example orders data: "YYYY-MM-DD" format
    const orderData = {
        "2025-03-01": 5,
        "2025-03-03": 8,
        "2025-03-10": 3,
        "2025-03-14": 7,
        "2025-03-21": 2,
        "2025-03-25": 6
    };

    // Function to generate calendar days for a selected month
    const generateCalendarDays = (year, month) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        let days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null); // Empty days before the start of the month
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    // Filter orders for the selected month and year
    const getOrdersForMonth = (year, month) => {
        const monthOrders = [];
        for (const [date, orders] of Object.entries(orderData)) {
            const orderDate = new Date(date);
            if (orderDate.getFullYear() === year && orderDate.getMonth() === month) {
                monthOrders.push({ date: orderDate, orders });
            }
        }
        return monthOrders;
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
        setSelectedMonth(null); // Reset month when year changes
    };

    const handleMonthClick = (index) => {
        setSelectedMonth(index);
        setOrdersData(getOrdersForMonth(selectedYear, index)); // Get orders for the selected month
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

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 flex flex-col">
                <Topbar />
                <div className="p-6 grid grid-cols-4 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold text-green-700">Today</h3>
                        <p className="text-xl text-gray-500 font-medium"><Clock /></p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold text-green-700">Total Sales</h3>
                        <p className="text-xl text-gray-500 font-medium">₺45,300</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold text-green-700">Total Users</h3>
                        <p className="text-xl text-gray-500 font-medium">8,450</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold text-green-700">Orders</h3>
                        <p className="text-xl text-gray-500 font-medium">{ordersData.length}</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-2 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-xl font-bold text-gray-700">Sales Overview</h3>
                        <Line data={salesData} />
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 overflow-auto h-80">
                        <h3 className="text-xl font-bold text-gray-700">Calendar</h3>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex justify-between items-center mb-4">
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
                                <div className="flex overflow-x-auto space-x-4">
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
                                    <h4 className="text-lg font-semibold text-gray-700">Selected Month: {months[selectedMonth]}</h4>
                                    <div className="grid grid-cols-7 gap-4 mt-4">
                                        {generateCalendarDays(selectedYear, selectedMonth).map((day, index) => (
                                            <div
                                                key={index}
                                                className={`p-2 text-center rounded ${
                                                    day ? (orderData[`${selectedYear}-${(selectedMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`] ? "bg-green-100" : "bg-white") : ""
                                                }`}
                                            >
                                                {day && (
                                                    <>
                                                        <p>{day}</p>
                                                        {orderData[`${selectedYear}-${(selectedMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`] && (
                                                            <span className="text-xs text-green-700">
                                                                {orderData[`${selectedYear}-${(selectedMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`]} Orders
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <ul className="mt-4">
                                {ordersData.length > 0 ? (
                                    ordersData.map(({ date, orders }) => (
                                        <li key={date} className="p-2 border-b">
                                            {date.toLocaleDateString()} - {orders} Orders
                                        </li>
                                    ))
                                ) : (
                                    <p>No orders for this month</p>
                                )}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManagerPage;
