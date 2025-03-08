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
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Siparişlerim</h2>
                    <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg shadow-md bg-white">
                        <thead className="bg-gray-200">
                        <tr>
                            <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Müşteri Adı</th>
                            <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Soyadı</th>
                            <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Telefon Numarası</th>
                            <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Ev Adresi</th>
                            <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Sipariş Tutarı</th>
                            <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Sipariş Tarihi</th>
                            <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">Detay</th>
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
                                        {selectedOrder === index ? "Kapat" : "Detay"}
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

                    {/* Detaylar */}
                    {selectedOrder !== null && (
                        <div className="mt-6 p-4 border rounded-lg shadow-md bg-gray-50">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Sipariş Detayları</h3>
                            <ul>
                                {orders[selectedOrder].cart.map((item, index) => (
                                    <li key={index} className="flex justify-between mb-2 p-2 hover:bg-gray-100 rounded-md">
                                        <span className="text-gray-700">{item.name}</span>
                                        <span className="text-gray-600">{item.quantity} adet - {item.price * item.quantity} TL</span>
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
