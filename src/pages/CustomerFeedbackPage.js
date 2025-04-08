import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import managerIcon from "../assets/manager.svg";
import { FaReply, FaCheck, FaTrash } from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import axios from "axios"; // Axios import

const ContactFormsPage = () => {
    const [forms, setForms] = useState([]);
    const [unreadForms, setUnreadForms] = useState([]); // Add unreadForms state
    const [expandedId, setExpandedId] = useState(null);
    const unreadCount = unreadForms.length; // Use unreadForms for unread count
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedFormId, setSelectedFormId] = useState(null);
    const [showUnreadOnly, setShowUnreadOnly] = useState(false); // Yeni: filtre kontrolü

    const [selectedTopic, setSelectedTopic] = useState("all");
    const topicOptions = [...new Set(forms.map(f => f.topic))];

    const filteredForms = forms.filter(form =>
        (!showUnreadOnly || !form.isRead) &&
        (selectedTopic === "all" || form.topic === selectedTopic)
    );

    useEffect(() => {
        axios.get("http://localhost:8080/api/contact/all")
            .then(response => {
                setForms(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the contact forms!", error);
            });
        // Okunmamış formları al
        axios.get("http://localhost:8080/api/contact/unread")
            .then(response => {
                setUnreadForms(response.data); // Set unreadForms state
            })
            .catch(error => {
                console.error("There was an error fetching unread contact forms!", error);
            });
    }, []);

    const handleReply = (email) => {
        window.location.href = `mailto:${email}`;
    };

    // Okundu olarak işaretleme işlevi
    const handleMarkAsRead = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:8080/api/contact/${id}`, {
                isRead: true
            });

            console.log("Message marked as read:", response.data);

            // Update forms state
            setForms(forms.map(form => form.id === id ? { ...form, isRead: true } : form));
            setUnreadForms(unreadForms.filter(form => form.id !== id)); // Remove from unread list
        } catch (error) {
            console.error("Error marking message as read:", error);
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/contact/${selectedFormId}`);
            setForms(forms.filter(form => form.id !== selectedFormId));
            setUnreadForms(unreadForms.filter(form => form.id !== selectedFormId)); // Remove from unread list
            setShowDeleteModal(false);
            setSelectedFormId(null);
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            <Sidebar/>
            <main className="flex-1 flex flex-col overflow-auto">
                <header className="bg-white shadow-sm p-4 px-6 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-green-800">Contact Forms</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-500 text-sm">Manager Panel</span>
                        <div className="relative">
                            <img src={managerIcon} alt="Manager"
                                 className="rounded-full w-11 h-11 border-2 border-green-300 shadow cursor-pointer hover:scale-105 transition"/>
                            {unreadCount > 0 && (
                                <span
                                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                            {unreadForms.length}
                        </span>
                            )}
                        </div>
                    </div>

                </header>

                <div className="p-4 bg-green-100 border-b border-green-300 flex items-center space-x-4 text-sm">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            id="unreadOnly"
                            checked={showUnreadOnly}
                            onChange={() => setShowUnreadOnly(!showUnreadOnly)}
                            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="ml-2 text-green-700 font-medium">Show only unread messages</span>
                    </label>

                    <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="ml-4 px-3 py-1.5 text-sm border border-green-300 rounded shadow-sm bg-white hover:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                        <option value="all">All Topics</option>
                        {topicOptions.map((topic, idx) => (
                            <option key={idx} value={topic}>{topic}</option>
                        ))}
                    </select>
                </div>

                <div className="p-6 space-y-5">
                    {forms.length === 0 ? (
                        <p className="text-green-600 italic">No contact forms submitted yet.</p>
                    ) : (
                        filteredForms.map((form) => (
                            <div
                                key={form.id}
                                onClick={() => toggleExpand(form.id)}
                                className={`cursor-pointer border-l-4 transition-all duration-300 ${
                                    form.isRead
                                        ? "border-green-300 bg-green-100 text-gray-800"
                                        : "border-green-600 bg-white text-green-800"
                                } shadow-sm hover:shadow-lg rounded-lg px-6 py-4 relative`}
                            >
                                <h2 className="text-lg font-semibold">{form.topic}</h2>

                                {expandedId === form.id && (
                                    <div className="mt-4 text-base text-green-900 space-y-2">
                                        <p><strong>Name:</strong> {form.name}</p>
                                        <p><strong>Surname:</strong> {form.surname}</p>
                                        <p><strong>Email:</strong> {form.email}</p>
                                        <p><strong>Phone:</strong> {form.phoneNumber}</p>
                                        <p><strong>Message:</strong> {form.message}</p>
                                        <p><strong>Sent At:</strong> {new Date(form.timestamp).toLocaleString()}</p>

                                        <div className="absolute top-4 right-4 flex space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleReply(form.email);
                                                }}
                                                className="bg-white border border-blue-500 text-blue-500 rounded-full p-2 hover:bg-blue-100 transition"
                                                title="Reply"
                                            >
                                                <FaReply/>
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMarkAsRead(form.id);
                                                }}
                                                className="bg-white border border-green-500 text-green-500 rounded-full p-2 hover:bg-green-100"
                                                title="Mark as read"
                                            >
                                                <FaCheck/>
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedFormId(form.id);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="bg-white border border-red-500 text-red-500 rounded-full p-2 hover:bg-red-100 transition"
                                                title="Delete"
                                            >
                                                <FaTrash/>
                                            </button>

                                            {showDeleteModal && (
                                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md text-center">
                                                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                                                            Are you sure you want to delete this message?
                                                        </h2>
                                                        <p className="text-gray-700 mb-6">This action cannot be undone.</p>
                                                        <div className="flex justify-center space-x-4">
                                                            <button
                                                                onClick={() => setShowDeleteModal(false)}
                                                                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={confirmDelete}
                                                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                                                            >
                                                                Yes, Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}


                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    <UserRatingsChart />
                </div>
            </main>
        </div>
    );

};

const UserRatingsChart = () => {
    const data = [
        { day: "Monday", rating: 4.2 },
        { day: "Tuesday", rating: 3.8 },
        { day: "Wednesday", rating: 4.5 },
        { day: "Thursday", rating: 4.0 },
        { day: "Friday", rating: 4.7 },
        { day: "Saturday", rating: 4.3 },
        { day: "Sunday", rating: 4.6 },
    ];
    return (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="p-4 bg-white rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-bold text-center mb-4">User Ratings This Week</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <XAxis dataKey="day" stroke="#555" />
                    <YAxis domain={[3, 5]} stroke="#555" />
                    <Tooltip />
                    <Bar dataKey="rating" fill="#82ca9d" radius={[5, 5, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
};
export default ContactFormsPage;

