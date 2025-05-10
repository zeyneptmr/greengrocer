
import { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import { CheckCircle, Circle, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import axios from "axios";

const CardEntryForm = () => {
    const [defaultCardId, setDefaultCardId] = useState(null);
    const [cardNumber, setCardNumber] = useState("");
    const [holderName, setHolderName] = useState("");
    const [expiryMonth, setExpiryMonth] = useState("");
    const [expiryYear, setExpiryYear] = useState("");
    const [cvv, setCvv] = useState("");
    const [error, setError] = useState("");
    const [savedCards, setSavedCards] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [cardToDelete, setCardToDelete] = useState(null);
    const { t } = useTranslation("creditcard");


    const fetchSavedCards = () => {
        axios.get("http://localhost:8080/api/cards", { withCredentials: true })
            .then((res) => {
                setSavedCards(res.data);
            })
            .catch((err) => console.error("An error occur while fetching cards:", err));
    };

    useEffect(() => {
        fetchSavedCards();
    }, []);

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.replace(/(.{4})/g, "$1 ").trim();
        setCardNumber(value);
    };

    const handleHolderNameChange = (e) => {
        let value = e.target.value.replace(/[^a-zA-ZğüşöçıİĞÜŞÖÇ\s]/gi, "");
        value = value.replace(/i/g, "İ").toUpperCase();
        setHolderName(value.toUpperCase());
    };

    const handleDeleteCard = (id) => {

        axios.delete(`http://localhost:8080/api/cards/${id}`, { withCredentials: true })
            .then(() => {
                fetchSavedCards();
            })
            .catch((err) => console.error("An error occur while deleting cards ", err));
    };


    const confirmDeleteCard = (id) => {
        setCardToDelete(id);
    };

    const handleConfirmDelete = () => {
        const cardToDeleteData = savedCards.find(card => card.id === cardToDelete);

        if (cardToDeleteData.isDefault) {
            setError(t("defaultCardDeleteError"));
            setTimeout(() => setError(""), 3000);
            setCardToDelete(null);

        } else {
            handleDeleteCard(cardToDelete);
            setSuccessMessage(t("cardDeleted"));
            setTimeout(() => setSuccessMessage(""), 3000);
            setCardToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setCardToDelete(null);
    };

    const setDefaultCard = (id) => {
        axios.put("http://localhost:8080/api/cards/default", { id }, { withCredentials: true })
            .then(() => {
                setDefaultCardId(id);
                fetchSavedCards();
            })
            .catch((err) => console.error("Could not set default card!", err));
    };


    const handleSubmit = () => {
        if (!holderName || !cardNumber || !expiryMonth || !expiryYear || !cvv) {
            setError(t("fillFields"));
            return;
        }
        setError("");

        
        const cardNumberWithoutSpaces = cardNumber.replace(/\s+/g, '');
        if (cardNumberWithoutSpaces.length !== 16) {
            setError(t("invalidCardNumber"));
            return;
        }

        

        const newCard = {
            cardNumberLast4: cardNumberWithoutSpaces.substring(cardNumberWithoutSpaces.length - 4),
            holderName,
            expiryMonth,
            expiryYear,
            cvv
        };


        axios.post("http://localhost:8080/api/cards", newCard, { withCredentials: true })
            .then(() => {
                fetchSavedCards();
                setSuccessMessage(t("cardSaved"));
                setTimeout(() => setSuccessMessage(""), 3000);
                setShowForm(false);
                setCardNumber("");
                setHolderName("");
                setExpiryMonth("");
                setExpiryYear("");
                setCvv("");
            })
            .catch((err) => {
                console.error("Card could not be saved:", err.response?.data);
                alert(`Card could not be saved: ${err.response?.data}`);
                setError(t("cardNotSaved"));
            });
    };

    return (
        <div className="flex flex-col md:flex-row bg-green-50 min-h-screen">
            <UserSidebar />
            <div className="p-6 md:p-10 w-full max-w-4xl mx-auto bg-white shadow-xl rounded-3xl mt-10 mb-10">
                <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">{t("paymentMethods")}</h2>
                <div className="bg-white shadow-md rounded-2xl p-6 md:p-10 border-t-4 border-orange-500">
                    {error && (
                        <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded-xl mb-6 text-center font-medium">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded-xl mb-6 text-center font-medium">
                            {successMessage}
                        </div>
                    )}

                    <p className="text-orange-500 text-center mb-6 text-base md:text-lg">
                        {t("enterCardInfo")}
                    </p>

                    <div className="flex flex-col md:flex-row gap-6">
                        <button
                            className="flex-1 p-6 border-2 border-dashed border-gray-300 rounded-3xl text-center text-gray-700 font-semibold hover:bg-gray-50 transition"
                            onClick={() => setShowForm(true)}
                        >
                            + {t("addNewPayment")}
                        </button>

                        {savedCards.length > 0 && (
                            <div className="flex-1 p-4 md:p-6 border rounded-2xl shadow-md max-h-[500px] overflow-y-auto ">
                                {savedCards.map((card, index) => (
                                    <div
                                        key={index}
                                        className="mb-6 flex justify-between items-center border-b pb-4 pt-4 px-6 py-6 min-h-[120px] rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 shadow-md"

                                    >
                                        <button onClick={() => setDefaultCard(card.id)} className="text-2xl">
                                            {card.isDefault ? (
                                                <CheckCircle size={24} className="text-green-600" />
                                            ) : (
                                                <Circle size={24} className="text-gray-400" />
                                            )}
                                        </button>
                                        <div className="ml-4 flex-1">
                                            <p className="font-semibold text-gray-800">{card.holderName}</p>
                                            <p className="text-gray-600"> {card.cardNumberLast4 ? `**** **** **** ${card.cardNumberLast4}` : t("noCardNumber")}</p>
                                            <p className="text-gray-500 text-sm">
                                                {card.expiryMonth}/{card.expiryYear}
                                            </p>
                                        </div>
                                        <button
                                            className="text-red-500 hover:text-red-700 transition"
                                            onClick={() => confirmDeleteCard(card.id)}
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {cardToDelete !== null && (
                        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                                <p className="mb-4 text-lg">{t("confirmDelete")}</p>
                                <div className="flex justify-center gap-4">
                                    <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                        {t("delete")}
                                    </button>
                                    <button onClick={handleCancelDelete} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
                                        {t("cancel")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showForm && (
                        <div className="mt-10 p-6 bg-gray-50 border rounded-2xl shadow-sm">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">{t("cardInformation")}</h3>

                            <div className="mb-4">
                                <label className="block mb-2 text-gray-700 font-medium">{t("holderName")}</label>
                                <input
                                    type="text"
                                    value={holderName}
                                    onChange={handleHolderNameChange}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder={t("nameSurname")}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2 text-gray-700 font-medium">{t("cardNo")}</label>
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    maxLength="19"
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="XXXX XXXX XXXX XXXX"
                                />
                            </div>

                            <div className="flex gap-4 mb-4">
                                <div className="w-1/2">
                                    <label className="block mb-2 text-gray-700 font-medium">{t("expirationDate")}</label>
                                    <div className="flex gap-2">
                                        <select
                                            className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                            value={expiryMonth}
                                            onChange={(e) => setExpiryMonth(e.target.value)}
                                        >
                                            <option value="">{t("month")}</option>
                                            {[...Array(12)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                        <select
                                            className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                            value={expiryYear}
                                            onChange={(e) => setExpiryYear(e.target.value)}
                                        >
                                            <option value="">{t("year")}</option>
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i} value={2025 + i}>{2025 + i}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="w-1/2">
                                    <label className="block mb-2 text-gray-700 font-medium">{t("cvv")}</label>
                                    <input
                                        type="text"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        maxLength="3"
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="XXX"
                                    />
                                </div>
                            </div>

                            <button
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-xl font-semibold transition duration-300"
                                onClick={handleSubmit}
                            >
                                {t("save")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default CardEntryForm;
