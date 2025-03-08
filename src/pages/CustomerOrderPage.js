import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const CustomerOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const storedOrders = JSON.parse(localStorage.getItem("orderinfo")) || [];
        setOrders(storedOrders);
    }, []);

    const handleDetailsToggle = (index) => {
        if (selectedOrder === index) {
            setSelectedOrder(null);
        } else {
            setSelectedOrder(index);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar className="h-full" />

            <main className="flex-1 flex flex-col overflow-y-auto">
                {/* Topbar */}
                <Topbar />

                <div className="max-w-6xl mx-auto p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Orders</h2>
                    <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg shadow-md bg-white">
                        <thead className="bg-gray-200">
                        <tr>
                            <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Name</th>
                            <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Surname</th>
                            <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                            <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Address</th>
                            <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Order Total</th>
                            <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Order Date</th>
                            <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Detail</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.length > 0 ? (
                            orders.map((order, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="border-t border-gray-300 p-3">{order.name.split(" ")[0]}</td>
                                    <td className="border-t border-gray-300 p-3">{order.name.split(" ")[1]}</td>
                                    <td className="border-t border-gray-300 p-3">{order.address.phone}</td>
                                    <td className="border-t border-gray-300 p-3">{order.address.neighborhood}</td>
                                    <td className="border-t border-gray-300 p-3">{order.totalCost} TL</td>
                                    <td className="border-t border-gray-300 p-3">{new Date().toLocaleDateString()}</td>
                                    <td className="border-t border-gray-300 p-3 cursor-pointer text-blue-500 hover:text-blue-700"
                                        onClick={() => handleDetailsToggle(index)}>
                                        {selectedOrder === index ? "Close" : "Detail"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center p-4">Sipariş bulunamadı.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    {/* Detail */}
                    {selectedOrder !== null && (
                        <div className="mt-6 p-4 border rounded-lg shadow-md bg-gray-50">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Details</h3>
                            <ul>
                                {orders[selectedOrder].cart.map((item, index) => (
                                    <li key={index}
                                        className="flex justify-between mb-2 p-2 hover:bg-gray-100 rounded-md">
                                        <span className="text-gray-700">{item.name}</span>
                                        <span
                                            className="text-gray-600">{item.quantity} quantity - {(item.price * item.quantity).toFixed(2)} TL</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CustomerOrderPage;
