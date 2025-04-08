import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import managerIcon from "../assets/manager.svg";
import { FaReply, FaCheck, FaTrash } from 'react-icons/fa';
import axios from "axios"; // Axios import

const ContactFormsPage = () => {
    const [forms, setForms] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // Active form index
    const [expandedId, setExpandedId] = useState(null);
    const unreadCount = forms.filter(form => !form.isRead).length;

    useEffect(() => {
        axios.get("http://localhost:8080/api/contact/all")
            .then(response => {
                setForms(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the contact forms!", error);
            });
    }, []);

    const handleReply = (email) => {
        window.location.href = `mailto:${email}`;
    };

    // Okundu olarak işaretleme işlevi
    const handleMarkAsRead = async (id, isRead) => {
        try {
            const response = await axios.patch(`http://localhost:8080/api/contact/${id}`, {
                isRead: !isRead  // Durumu tersine çevir
            });
            console.log("Message marked as read:", response.data);
            // Okundu olarak işaretlendikten sonra UI'yi güncelle
            setForms(forms.map(form => form.id === id ? { ...form, isRead: !isRead } : form)); // forms state'ini güncelle
        } catch (error) {
            console.error("Error marking message as read:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/contact/${id}`);
            console.log("Message deleted:", response.data);
            // Silme işlemi sonrasında UI'yi güncelle
            setForms(forms.filter(form => form.id !== id)); // forms state'ini güncelle
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    }

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };


    // Handle the index change when navigating through forms
    const handleBeforeChange = (oldIndex, newIndex) => {
        setCurrentIndex(newIndex);
    };

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: handleBeforeChange,
        nextArrow: <div className="slick-next custom-arrow">Next</div>,
        prevArrow: <div className="slick-prev custom-arrow">Prev</div>,
    };

    return (
        <div className="flex h-screen bg-green-50 overflow-hidden font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-auto">
                <header className="bg-white shadow-md p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-green-700">Contact Forms</h1>
                    <div className="flex items-center space-x-4 relative">
                        <span className="text-gray-500 text-sm">Manager Panel</span>
                        <div className="relative">
                            <img src={managerIcon} alt="Manager" className="rounded-full w-12 h-12 cursor-pointer"/>
                            {unreadCount > 0 && (
                                <span
                                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
            </span>
                            )}
                        </div>
                    </div>

                </header>

                <div className="p-6 space-y-5">
                    {forms.length === 0 ? (
                        <p className="text-green-600">No contact forms submitted yet.</p>
                    ) : (
                        forms.map((form) => (
                            <div
                                key={form.id}
                                onClick={() => toggleExpand(form.id)}
                                className={`cursor-pointer transition-all duration-300 border-l-4 ${
                                    form.isRead ? "border-green-300 bg-green-100" : "border-green-600 bg-white"
                                } shadow-md rounded-lg px-6 py-4 relative hover:shadow-lg`}
                            >
                                <h2 className="text-lg font-semibold text-green-700">{form.topic}</h2>

                                {expandedId === form.id && (
                                    <div className="mt-4 text-base text-green-900 space-y-2">
                                        <p><strong>Name:</strong> {form.name}</p>
                                        <p><strong>Surname:</strong> {form.surname}</p>
                                        <p><strong>Email:</strong> {form.email}</p>
                                        <p><strong>Phone:</strong> {form.phoneNumber}</p>
                                        <p><strong>Message:</strong> {form.message}</p>

                                        {/* Timestamp */}
                                        <p><strong>Sent At:</strong> {new Date(form.timestamp).toLocaleString()}</p>

                                        <div className="absolute top-4 right-4 flex space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleReply(form.email);
                                                }}
                                                className="bg-white border border-blue-500 text-blue-500 rounded-full p-2 hover:bg-blue-100"
                                                title="Reply"
                                            >
                                                <FaReply />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMarkAsRead(form.id);
                                                }}
                                                className="bg-white border border-green-500 text-green-500 rounded-full p-2 hover:bg-green-100"
                                                title="Mark as read"
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(form.id);
                                                }}
                                                className="bg-white border border-red-500 text-red-500 rounded-full p-2 hover:bg-red-100"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );

};
export default ContactFormsPage;

