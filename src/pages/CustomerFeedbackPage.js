import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import managerIcon from "../assets/manager.svg";
import { FaStar, FaReply, FaCheck, FaTrash } from 'react-icons/fa';

const ContactFormsPage = () => {
    const [forms, setForms] = useState([]);

    useEffect(() => {
        const storedForms = JSON.parse(localStorage.getItem("contactForms")) || [];
        setForms(storedForms);
    }, []);

    const handleFavorite = (index) => {
        const updatedForms = [...forms];
        updatedForms[index].isFavorite = !updatedForms[index].isFavorite;
        setForms(updatedForms);
        localStorage.setItem("contactForms", JSON.stringify(updatedForms));
    };

    const handleReply = (index) => {
        // Yanıtlama işlemi burada gerçekleştirilebilir
        console.log(`Form ${index + 1} yanıtlandı.`);
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

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
                    <h1 className="text-2xl font-semibold text-gray-700">Contact Forms</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-500">Manager Panel</span>
                        <img src={managerIcon} alt="Manager" className="rounded-full w-14 h-18" />
                    </div>
                </header>

                {/* Forms List */}
                <div className="p-4 overflow-auto">
                    {forms.length === 0 ? (
                        <p className="text-gray-500">No contact forms submitted yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {forms.map((form, index) => (
                                <div key={index} className="bg-white shadow-md rounded-lg flex w-50">
                                    {/* Sol Renk Göstergesi */}
                                    <div
                                        className={`w-2 rounded-l-lg ${form.isFavorite ? 'bg-yellow-500' : 'bg-gray-300'}`}
                                    ></div>
                                    {/* Form İçeriği */}
                                    <div className="p-4 flex-1 relative text-sm">
                                        <p><strong>Name:</strong> {form.name}</p>
                                        <p><strong>Surname:</strong> {form.surname}</p>
                                        <p><strong>Email:</strong> {form.email}</p>
                                        <p><strong>Phone Number:</strong> {form.phoneNumber}</p>
                                        <p><strong>Topic:</strong> {form.topic}</p>
                                        <p><strong>Message:</strong> {form.message}</p>
                                        <p><strong>Submitted At:</strong> {form.timestamp}</p>
                                        <div className="absolute top-4 right-4 flex space-x-2">
                                            <button
                                                onClick={() => handleFavorite(index)}
                                                className={`bg-yellow-500 text-white rounded-full p-2 hover:bg-yellow-400 focus:outline-none`}
                                                title="Favorile"
                                            >
                                                <FaStar/>
                                            </button>
                                            <button
                                                onClick={() => handleReply(index)}
                                                className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none"
                                                title="Yanıtla"
                                            >
                                                <FaReply/>
                                            </button>
                                            <button
                                                onClick={() => handleMarkAsRead(index)}
                                                className={`bg-green-500 text-white rounded-full p-2 hover:bg-green-400 focus:outline-none`}
                                                title="Okundu olarak işaretle"
                                            >
                                                <FaCheck/>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(index)}
                                                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-400 focus:outline-none"
                                                title="Sil"
                                            >
                                                <FaTrash/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ContactFormsPage;
