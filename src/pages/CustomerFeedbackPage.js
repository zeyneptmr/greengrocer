import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import managerIcon from "../assets/manager.svg";
import { FaReply, FaCheck, FaTrash } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios"; // Axios import
import { useTranslation } from "react-i18next";

const ContactFormsPage = () => {
    const [forms, setForms] = useState([]);
    const [unreadForms, setUnreadForms] = useState([]); // Add unreadForms state
    const [expandedId, setExpandedId] = useState(null);
    const unreadCount = unreadForms.length; // Use unreadForms for unread count
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUnreadOnly, setShowUnreadOnly] = useState(false); // Yeni: filtre kontrolü
    const [selectedFormId, setSelectedFormId] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState("all");

    const topicOptions = [...new Set(forms.map(f => f.topic))];
    const filteredForms = forms.filter(form => selectedTopic === "all" || form.topic === selectedTopic);
    const { t } = useTranslation("managercontact");

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

            setForms(forms.map(form => form.id === id ? { ...form, isRead: true } : form));
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
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar/>

            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="bg-white shadow p-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-green-700">{t("header")}</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-orange-500 font-semibold text-lg">{t("managerPanel")}</span>
                        <img src={managerIcon} alt="Manager" className="w-14 h-14 rounded-full"/>
                    </div>
                </header>

                <div
                    className="p-4 bg-green-100 border-b border-green-300 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <h2 className="text-green-800 font-semibold text-md">
                    </h2>

                    <div className="flex justify-end">
                        <select
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                            className="px-4 py-2 rounded-xl shadow-md border border-green-400 text-green-800 bg-white hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 font-medium"
                        >
                            <option value="all" className="text-gray-600 italic"> {t("showAll")}</option>
                            {topicOptions.map((topic, idx) => (
                                <option key={idx} value={topic}>{topic}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {forms.length === 0 ? (
                        <p className="text-green-600 italic">{t("noForms")}</p>
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
                                        <p><strong>{t("name")}:</strong> {form.name}</p>
                                        <p><strong>{t("surname")}:</strong> {form.surname}</p>
                                        <p><strong>{t("email")}:</strong> {form.email}</p>
                                        <p><strong>{t("phone")}:</strong> {form.phoneNumber}</p>
                                        <p><strong>{t("message")}:</strong> {form.message}</p>
                                        <p><strong>{t("sentAt")}:</strong> {new Date(form.timestamp).toLocaleString()}</p>

                                        <div className="absolute top-4 right-4 flex space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleReply(form.email);
                                                }}
                                                className="bg-white border border-blue-500 text-blue-600 rounded-full p-3 hover:bg-blue-100 hover:shadow-md transition-all duration-200"
                                                title={t("reply")}
                                            >
                                                <FaReply className="text-lg"/>
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedFormId(form.id);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="bg-white border border-red-500 text-red-600 rounded-full p-3 hover:bg-red-100 hover:shadow-md transition-all duration-200"
                                                title={t("delete")}
                                            >
                                                <FaTrash className="text-lg"/>
                                            </button>

                                            {showDeleteModal && (
                                                <div
                                                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                    <div
                                                        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md text-center">
                                                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                                                            <p>{t("deleteWarning")}</p>
                                                        </h2>
                                                        <div className="flex justify-center space-x-4">
                                                            <button
                                                                onClick={() => setShowDeleteModal(false)}
                                                                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                            >
                                                                {t("cancel")}
                                                            </button>
                                                            <button
                                                                onClick={confirmDelete}
                                                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                                                            >
                                                                {t("yesDelete")}
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
                </div>
            </main>
        </div>
    );

};

export default ContactFormsPage;

