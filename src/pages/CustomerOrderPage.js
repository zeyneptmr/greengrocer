import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import managerIcon from "../assets/manager.svg";
import axios from "axios";

const statusSteps = ["Sipariş Alındı", "Onaylandı", "Hazırlanıyor", "Kargoya Verildi"];

const CustomerOrderPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/customerorder/orders/all", { withCredentials: true })
            .then(res => {
                if (Array.isArray(res.data)) {
                    setOrders(res.data);
                }
            })
            .catch(err => console.error("Siparişler çekilemedi:", err));
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
            console.error("Durum güncellenemedi:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="bg-white shadow-md p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-700">Manage Customer Orders</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-green-600 font-bold">Manager Panel</span>
                        <img src={managerIcon} alt="Admin" className="rounded-full w-16 h-16" />
                    </div>
                </header>

                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow-md">
                            <thead className="bg-green-500 text-white">
                            <tr>
                                <th className="px-4 py-2">#</th>
                                <th className="px-4 py-2">Order ID</th>
                                <th className="px-4 py-2">Created At</th>
                                <th className="px-4 py-2">User ID</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Address</th>
                                <th className="px-4 py-2">Total AMount</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Manage</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order, idx) => {
                                const currentStatus = order.latestStatus || "Sipariş Alındı";
                                return (
                                    <tr key={order.orderId} className="text-center border-b hover:bg-gray-100 transition">
                                        <td className="px-4 py-2">{idx + 1}</td>
                                        <td className="px-4 py-2">{order.orderId}</td>
                                        <td className="px-4 py-2">{order.createdAt?.slice(0, 19).replace("T", " ")}</td>
                                        <td className="px-4 py-2">{order.userId}</td>
                                        <td className="px-4 py-2">{order.userEmail}</td>
                                        <td className="px-4 py-2">{order.shippingAddress}</td>
                                        <td className="px-4 py-2 text-orange-600 font-bold">{order.productTotal}₺</td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center justify-center space-x-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                                    {currentStatus}
                                                </span>
                                                {/* Status icons based on the currentStatus */}
                                                {currentStatus === "Sipariş Alındı" &&
                                                    <span className="text-green-600">🟢</span>}
                                                {currentStatus === "Kargoya Verildi" &&
                                                    <span className="text-orange-600">🟠</span>}
                                                {currentStatus === "Teslim Edildi" &&
                                                    <span className="text-blue-600">🔵</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 space-y-2">
                                            {/* Dikey sıralama için flex-col ekledik */}
                                            {statusSteps.map((step, i) => (
                                                <button
                                                    key={i}
                                                    className={`w-full h-10 mb-1 px-4 py-1 rounded text-sm font-medium transition-all duration-300 ease-in-out ${
                                                        step === currentStatus
                                                            ? "bg-green-600 text-white"
                                                            : statusSteps.indexOf(step) === statusSteps.indexOf(currentStatus) + 1
                                                                ? "bg-orange-400 text-white hover:bg-orange-500"
                                                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                    }`}
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
                </div>
            </main>
        </div>
    );
};

export default CustomerOrderPage;
