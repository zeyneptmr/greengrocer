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
    const [successMessage, setSuccessMessage] = useState("");
    const [defaultCardIndex, setDefaultCardIndex] = useState(null);

    // Kartları getir
    const fetchSavedCards = () => {
        axios.get("http://localhost:8080/api/cards", { withCredentials: true })
            .then((res) => {
                setSavedCards(res.data);
            })
            .catch((err) => console.error("Kartlar alınamadı:", err));
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
        axios.delete(⁠ http://localhost:8080/api/cards/${id} ⁠, { withCredentials: true })
            .then(() => {
            fetchSavedCards();
        })
            .catch((err) => console.error("Kart silinemedi:", err));
    };

    const handleSubmit = () => {
        if (!holderName || !cardNumber || !expiryMonth || !expiryYear || !cvv) {
            setError("Lütfen tüm alanları doldurun.");
            return;
        }
        setError("");

        // Kart numarasını temizle ve sadece son 4 hanesini al
        const cardNumberWithoutSpaces = cardNumber.replace(/\s+/g, ''); // boşlukları kaldır
        if (cardNumberWithoutSpaces.length !== 16) {
            setError("Geçersiz kart numarası. Kart numarası 16 haneli olmalıdır.");
            return;
        }

        console.log('Card number without spaces:', cardNumberWithoutSpaces);




        const newCard = {
            cardNumberLast4: cardNumberWithoutSpaces.substring(cardNumberWithoutSpaces.length - 4),  // Son 4 haneyi gönder
            holderName,
            expiryMonth,
            expiryYear,
            cvv
        };

        console.log('Sending card data:', newCard);

        axios.post("http://localhost:8080/api/cards", newCard, { withCredentials: true })
            .then(() => {
                fetchSavedCards();
                setSuccessMessage("Kart başarıyla kaydedildi!");
                setTimeout(() => setSuccessMessage(""), 3000);
                setShowForm(false);
                setCardNumber("");
                setHolderName("");
                setExpiryMonth("");
                setExpiryYear("");
                setCvv("");
            })
            .catch((err) => {
                console.error("Kart kaydedilemedi:", err.response?.data);
                alert(⁠ Kart kaydedilemedi: ${err.response?.data} ⁠);
                setError("Kart kaydedilemedi.");
            });
    };



    const setDefaultCard = (id) => {
        axios.put("http://localhost:8080/api/cards/default", { id }, { withCredentials: true })
            .then(() => {
                setDefaultCardId(id);
                fetchSavedCards();
            })
            .catch((err) => console.error("Varsayılan kart ayarlanamadı:", err));
    };


    return (
        <div className="flex flex-col md:flex-row bg-green-50 min-h-screen">
            <UserSidebar />
            <div className="p-6 md:p-10 w-full max-w-4xl mx-auto bg-white shadow-xl rounded-3xl mt-10 mb-10">
                <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Payment Methods</h2>
                <div className="bg-white shadow-md rounded-2xl p-6 md:p-10 border-t-4 border-orange-500">
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {successMessage && (
                        <div className="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded-xl mb-6 text-center font-medium">
                            {successMessage}
                        </div>
                    )}

                    <p className="text-orange-500 text-center mb-6 text-base md:text-lg">
                        Please enter your debit or credit card information below.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6">
                        <button
                            className="flex-1 p-6 border-2 border-dashed border-gray-300 rounded-2xl text-center text-gray-700 font-semibold hover:bg-gray-50 transition"
                            onClick={() => setShowForm(true)}
                        >
                            + Add New Payment
                        </button>

                        {savedCards.length > 0 && (
                            <div className="flex-1 p-4 md:p-6 border rounded-2xl shadow-md max-h-[300px] overflow-y-auto">
                                {savedCards.map((card, index) => (
                                    <div
                                        key={index}
                                        className="mb-4 flex justify-between items-center border-b pb-2"
                                    >
                                        <button onClick={() => setDefaultCard(card.id)} className="text-2xl">
                                            {defaultCardIndex === index ? (
                                                <CheckCircle size={24} className="text-green-600" />
                                            ) : (
                                                <Circle size={24} className="text-gray-400" />
                                            )}
                                        </button>
                                        <div className="ml-4 flex-1">
                                            <p className="font-semibold text-gray-800">{card.holderName}</p>
                                            <p className="text-gray-600"> {card.cardNumberLast4 ? ⁠ **** **** **** ${card.cardNumberLast4} ⁠ : "No card number available"}</p>
                                            <p className="text-gray-500 text-sm">
                                                {card.expiryMonth}/{card.expiryYear}
                                            </p>
                                        </div>
                                        <button
                                            className="text-red-500 hover:text-red-700 transition"
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
                        <div className="mt-10 p-6 bg-gray-50 border rounded-2xl shadow-sm">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">Card Information</h3>

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
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-xl font-semibold transition duration-300"
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