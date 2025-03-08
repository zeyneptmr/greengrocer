import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import managerIcon from "../assets/manager.svg";
import { FaReply, FaCheck, FaTrash } from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const ContactFormsPage = () => {
    const [forms, setForms] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // Active form index

    useEffect(() => {
        const storedForms = JSON.parse(localStorage.getItem("contactForms")) || [];
        setForms(storedForms);
    }, []);

    const handleReply = (index) => {
        window.location.href = "mailto:someone@example.com";
    };

    const handleMarkAsRead = (index) => {
        const updatedForms = [...forms];
        updatedForms[index].isRead = !updatedForms[index].isRead;
        setForms(updatedForms);
        localStorage.setItem("contactForms", JSON.stringify(updatedForms));
    };

    const handleDelete = (index) => {
        const updatedForms = forms.filter((_, i) => i !== index);
        setForms(updatedForms);
        localStorage.setItem("contactForms", JSON.stringify(updatedForms));
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
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
                    <h1 className="text-2xl font-semibold text-gray-700">Contact Forms</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-500">Manager Panel</span>
                        <img src={managerIcon} alt="Manager" className="rounded-full w-14 h-18" />
                    </div>
                </header>
                <div className="p-4 overflow-auto">
                    {forms.length === 0 ? (
                        <p className="text-gray-500">No contact forms submitted yet.</p>
                    ) : (
                        <div>
                            {/* Form index and total forms display */}
                            <div className="text-sm text-gray-600 mb-4">
                                <span>Form {currentIndex + 1} of {forms.length}</span>
                            </div>

                            {/* Slider Component */}
                            <Slider {...settings}>
                                {forms.map((form, index) => (
                                    <div key={index}
                                         className={`bg-white shadow-md rounded-lg flex w-50 ${form.isRead ? 'bg-gray-300' : ''}`}>
                                        <div className="p-4 flex-1 relative text-sm">
                                            <p><strong>Name:</strong> {form.name}</p>
                                            <p><strong>Surname:</strong> {form.surname}</p>
                                            <p><strong>Email:</strong> {form.email}</p>
                                            <p><strong>Phone Number:</strong> {form.phoneNumber}</p>
                                            <p><strong>Topic:</strong> {form.topic}</p>
                                            <p><strong>Message:</strong> {form.message}</p>
                                            <p><strong>Submitted At:</strong> {form.timestamp}</p>

                                            {form.isRead && <p className="text-gray-500 text-right">Read</p>}
                                            <div className="absolute top-4 right-4 flex space-x-2">
                                                <button onClick={() => handleReply(index)}
                                                        className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none"
                                                        title="Yanıtla">
                                                    <FaReply/>
                                                </button>
                                                <button onClick={() => handleMarkAsRead(index)}
                                                        className="bg-green-500 text-white rounded-full p-2 hover:bg-green-400 focus:outline-none"
                                                        title="Okundu olarak işaretle">
                                                    <FaCheck/>
                                                </button>
                                                <button onClick={() => handleDelete(index)}
                                                        className="bg-red-500 text-white rounded-full p-2 hover:bg-red-400 focus:outline-none"
                                                        title="Sil">
                                                    <FaTrash/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
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

