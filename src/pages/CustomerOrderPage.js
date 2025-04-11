import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import managerIcon from "../assets/manager.svg";
import axios from "axios";

const statusSteps = ["Order Received", "Confirmed", "Preparing", "Dispatched"];

const CustomerOrderPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/customerorder/orders/all", { withCredentials: true })
            .then(res => {
                if (Array.isArray(res.data)) {
                    setOrders(res.data);
                }
            })
            .catch(err => console.error("Orders could not be fetched:", err));
    }, []);

    const handleStatusChange = async (orderId, currentStatus) => {
        const nextStatus = statusSteps[statusSteps.indexOf(currentStatus) + 1];
        if (!nextStatus) return;

        try {
            await axios.post(`http://localhost:8080/api/customerorder/orders/${orderId}/status`,
                { status: nextStatus },
                { withCredentials: true }

        );

            const updated = await axios.get("http://localhost:8080/api/customerorder/orders/all", { withCredentials: true });
            setOrders(updated.data);
        } catch (error) {
            console.error("Status could not be updated:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="bg-white shadow p-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-green-700">Customer Order Management</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-orange-500 font-semibold text-lg">Manager Panel</span>
                        <img src={managerIcon} alt="Manager" className="w-14 h-14 rounded-full"/>
                    </div>
                </header>

                <div className="p-6">
                    {orders.length === 0 ? (
                        <div className="text-center p-12 bg-gray-200 rounded-xl shadow-lg text-xl font-semibold text-gray-600">
                            <p>Your current orders are empty.</p>
                            <p className="text-sm text-gray-500 mt-2">There are no orders to manage at the moment.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-2xl rounded-xl overflow-hidden">
                                <thead className="bg-gradient-to-r from-green-500 to-lime-500 text-white">
                                <tr>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">#</th>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">Order ID</th>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">Created At</th>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">User ID</th>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">Email</th>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">Shipping Address</th>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">Total Amount</th>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">Status</th>
                                    <th className="px-4 py-4 text-center text-[16px] font-semibold">Process</th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                {orders.map((order, idx) => {
                                    const currentStatus = order.latestStatus || "Order Received";
                                    return (
                                        <tr key={order.orderId} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-lg">{idx + 1}</td>
                                            <td className="px-6 py-4 text-lg font-semibold text-gray-700">{order.orderId}</td>
                                            <td className="px-6 py-4 text-base text-gray-600">{order.createdAt?.slice(0, 19).replace("T", " ")}</td>
                                            <td className="px-6 py-4 text-lg">{order.userId}</td>
                                            <td className="px-6 py-4 text-lg">{order.userEmail}</td>
                                            <td className="px-6 py-4 text-base">{order.shippingAddress}</td>
                                            <td className="px-6 py-4 text-lg text-orange-600 font-bold">{order.productTotal}₺</td>
                                            <td className="px-6 py-4 text-lg">

                                                <div className="flex items-center justify-center space-x-3">
                                                    <span
                                                        className="px-4 py-2 bg-green-100 text-green-800 text-lg rounded-full">
                                                        {currentStatus}
                                                    </span>
                                                    {currentStatus === "Order Received" && (
                                                        <svg className="w-7 h-7 text-green-600" fill="none"
                                                             stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8"/>
                                                            <path
                                                                d="M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                                        </svg>
                                                    )}

                                                    {currentStatus === "Confirmed" && (
                                                        <svg className="w-7 h-7 text-yellow-500" fill="none"
                                                             stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path d="M5 13l4 4L19 7"/>
                                                        </svg>
                                                    )}

                                                    {currentStatus === "Preparing" && (
                                                        <svg className="w-7 h-7 text-purple-600" fill="none"
                                                             stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path d="M12 6v6l4 2"/>
                                                            <circle cx="12" cy="12" r="10"/>
                                                        </svg>
                                                    )}

                                                    {currentStatus === "Dispatched" && (
                                                        <svg className="w-7 h-7 text-orange-500" fill="none"
                                                             stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path
                                                                d="M3 7V17H5A2 2 0 0 0 9 17H15A2 2 0 0 0 19 17H21V11L17 7H3Z"
                                                                strokeLinecap="round" strokeLinejoin="round"/>
                                                            <circle cx="7" cy="17" r="2"/>
                                                            <circle cx="17" cy="17" r="2"/>
                                                        </svg>
                                                    )}

                                                    {currentStatus === "Delivered" && (
                                                        <svg className="w-7 h-7 text-blue-500" fill="none"
                                                             stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                                        </svg>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 space-y-2">
                                                {/* Dikey sıralama için flex-col ekledik */}
                                                {statusSteps.map((step, i) => (
                                                    <button
                                                        key={i}
                                                        className={`w-full py-2 rounded-md text-sm font-medium transition-all duration-300
                                                                ${step === currentStatus
                                                            ? "bg-green-600 text-white"
                                                            : statusSteps.indexOf(step) === statusSteps.indexOf(currentStatus) + 1
                                                                ? "bg-orange-400 text-white hover:bg-orange-500"
                                                                : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                                                        disabled={
                                                            step !== currentStatus &&
                                                            statusSteps.indexOf(step) !== statusSteps.indexOf(currentStatus) + 1
                                                        }
                                                        onClick={() => handleStatusChange(order.orderId, currentStatus)}
                                                    >
                                                        {step}
                                                    </button>
                                                ))}
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
        </div>
    );
};

export default CustomerOrderPage;
