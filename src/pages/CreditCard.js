import { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import { CheckCircle, Circle, Trash2 } from "lucide-react";
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
    const [defaultCardIndex, setDefaultCardIndex] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");


    useEffect(() => {
        axios.get("http://localhost:5000/cards")
            .then((res) => {
                setSavedCards(res.data.cards);
                setDefaultCardIndex(res.data.defaultCardIndex);
            })
            .catch((err) => console.error("Failed to fetch cards:", err));
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
        axios.delete(`http://localhost:5000/cards/${id}`)
            .then((res) => {
                setSavedCards(res.data.cards);
                setDefaultCardId(res.data.defaultCardId);
            })
            .catch((err) => console.error("Delete failed:", err));
    };



    const handleSubmit = () => {
        if (!holderName || !cardNumber || !expiryMonth || !expiryYear || !cvv) {
            setError("Please fill in all fields.");
            return;
        }
        setError("");

        const newCard = { cardNumber, holderName, expiryMonth, expiryYear, cvv };

        axios.post("http://localhost:5000/cards", newCard)
            .then((res) => {
                setSavedCards(res.data.cards);
                setDefaultCardIndex(res.data.defaultCardIndex);
                setSuccessMessage("Card information saved successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
                setShowForm(false);
                setCardNumber("");
                setHolderName("");
                setExpiryMonth("");
                setExpiryYear("");
                setCvv("");
            })
            .catch((err) => {
                console.error("Card save failed:", err);
                setError("Failed to save card.");
            });
    };


    const setDefaultCard = (id) => {
        axios.put("http://localhost:5000/cards/default", { id })
            .then(() => {
                setDefaultCardId(id);
            })
            .catch((err) => console.error("Setting default card failed:", err));
    };


    return (
        <div className="flex bg-green-50 min-h-screen">
            <UserSidebar/>
            <div className="p-8 max-w-2xl mx-auto w-full bg-white shadow-lg rounded-xl mt-12 mb-12 min-h-[600px]">
                <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Payment Methods</h2>
                <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl border-t-4 border-orange-500">
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {successMessage && (
                        <div className="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded relative mb-4 text-center">
                            {successMessage}
                        </div>
                    )}
                    <p className="text-orange-500 text-center mb-4">Please enter your debit or credit card information
                        below.</p>

                    <div className="flex gap-4">
                        <button
                            className="flex-1 p-6 border rounded-lg text-center text-gray-700 font-semibold hover:bg-gray-100"
                            onClick={() => setShowForm(true)}
                        >
                            + Add New Payment
                        </button>
                        {savedCards.length > 0 && (
                            <div className="flex-1 p-6 border rounded-lg shadow-md">
                                {savedCards.map((card, index) => (
                                    <div key={index} className="mb-4 flex justify-between items-center border-b pb-2">
                                        <button
                                            onClick={() => setDefaultCard(card.id)}
                                            className="text-2xl"
                                        >
                                            {defaultCardIndex === index ? <CheckCircle size={24} /> : <Circle size={24} />}
                                        </button>
                                        <div>
                                            <p className="font-medium">{card.holderName}</p>
                                            <p className="text-gray-600">**** **** **** {card.cardNumber.slice(-4)}</p>
                                            <p className="text-gray-500">{card.expiryMonth}/{card.expiryYear}</p>
                                        </div>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleDeleteCard(card.id)}
                                        >
                                            <Trash2 size={24} />

                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {showForm && (
                        <div className="mt-6 p-6 bg-gray-50 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Card Information</h3>
                            <div className="mb-4">
                                <label className="block mb-2 text-gray-700 font-medium">Holder Name</label>
                                <input
                                    type="text"
                                    value={holderName}
                                    onChange={handleHolderNameChange}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="Name Surname"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-gray-700 font-medium">Card No</label>
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
                                    <label className="block mb-2 text-gray-700 font-medium">Expiration Date</label>
                                    <div className="flex gap-2">
                                        <select
                                            className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                            value={expiryMonth}
                                            onChange={(e) => setExpiryMonth(e.target.value)}
                                        >
                                            <option value="">Month</option>
                                            {[...Array(12)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                        <select
                                            className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                            value={expiryYear}
                                            onChange={(e) => setExpiryYear(e.target.value)}
                                        >
                                            <option value="">Year</option>
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i} value={2025 + i}>{2025 + i}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <label className="block mb-2 text-gray-700 font-medium">CVV</label>
                                    <input
                                        type="text"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                                        maxLength="3"
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="XXX"
                                    />
                                </div>
                            </div>
                            <button
                                className="w-full bg-orange-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition"
                                onClick={handleSubmit}
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardEntryForm;
