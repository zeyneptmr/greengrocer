import { useState } from "react";
import axios from "axios";
import Flag from "react-world-flags"; // Import the flag component
import { useTranslation } from "react-i18next";

export default function ContactForm() {
    const topics = [
        "Product Complaint",
        "Product Quality",
        "Product Suggestion",
        "Order/Shipment Shortage",
        "Order/Shipment Delay",
        "Order Issues",
        "Payment Issues",
        "Campaign Problems",
        "Congratulations/Thank You",
        "Other",
    ];

    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        topic: "",
        message: "",
        phoneNumber: "",
    });

    const [messageError, setMessageError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [countryCode, setCountryCode] = useState("+90"); // Default country code set to Turkey
    const [bannerMessage, setBannerMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useTranslation("contact");

    const countries = [
        { code: "+1", flag: "US" },
        { code: "+44", flag: "GB" },
        { code: "+90", flag: "TR" },
        { code: "+33", flag: "FR" },
        { code: "+49", flag: "DE" },
        { code: "+39", flag: "IT" },
        { code: "+34", flag: "ES" },
        { code: "+1", flag: "CA" },
        { code: "+61", flag: "AU" },
        { code: "+55", flag: "BR" },
        { code: "+91", flag: "IN" },
        { code: "+81", flag: "JP" },
        { code: "+52", flag: "MX" },
        { code: "+7", flag: "RU" },
        { code: "+82", flag: "KR" },
        { code: "+46", flag: "SE" },
        { code: "+45", flag: "DK" },
        { code: "+27", flag: "ZA" },
        { code: "+64", flag: "NZ" }
    ];

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9@._-]+$/; // Only allows English characters, numbers, @, ., _
        return regex.test(email);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, email: value });
        setEmailError(value && !validateEmail(value) ? t("errors.email") : "");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "name" || name === "surname") {
            if (/^[a-zA-ZğüşıöçĞÜŞİÖÇ ]*$/.test(value)) {
                setFormData({ ...formData, [name]: value });
            }
        } else if (name === "message") {
            setFormData({ ...formData, [name]: value });
            setMessageError(countLettersOnly(value) < 20 ? t("errors.message") : "");
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        let formattedValue = "";

        if (value.length > 0) formattedValue = `(${value.substring(0, 3)}`;
        if (value.length >= 4) formattedValue += `) ${value.substring(3, 6)}`;
        if (value.length >= 7) formattedValue += `-${value.substring(6, 10)}`;
        
        setPhoneNumber(formattedValue);

        if (value.length < 10) {
            setPhoneError(t("errors.phone"));
        } else {
            setPhoneError(null);
        }
    };

    const handleCountryCodeChange = (e) => {
        setCountryCode(e.target.value);
    };

    const countLettersOnly = (text) => {
        return (text.match(/[a-zA-ZğüşıöçĞÜŞİÖÇ]/g) || []).length;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (countLettersOnly(formData.message) < 20) {
            alert(t("alerts.messageTooShort"));
            return;
        }
        if (phoneNumber.replace(/\D/g, "").length !== 10) {
            setPhoneError(t("errors.phone"));
            return;
        }
        if (emailError || phoneError) {
            alert(t("alerts.correctErrors"));
            return;
        }

        const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/\D/g, "")}`;
        const formDataToSubmit = {
            ...formData,
            phoneNumber: fullPhoneNumber // Include the formatted phone number
        };

        try {
            const response = await axios.post('http://localhost:8080/api/contact/submit', formDataToSubmit);
            setBannerMessage(response.data);
            setIsModalOpen(true);
            setTimeout(() => {
                setIsModalOpen(false);
                setBannerMessage("");
            }, 5000);

            setFormData({
                name: "",
                surname: "",
                email: "",
                topic: "",
                message: "",
                phoneNumber: "",
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("There was an error submitting the form.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 sm:p-10">
            <div className="bg-white p-8 shadow-xl w-full max-w-4xl space-y-8 mx-auto my-10 rounded-xl"
                 style={{boxShadow: '0 0 50px rgba(0, 128, 0, 0.3)'}}>

                {/* Banner*/}
                {isModalOpen && (
                    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
                        <div className={`rounded-xl shadow-2xl overflow-hidden border-l-8 ${bannerMessage.includes("Error") ? "bg-red-100 border-red-600" : "bg-green-100 border-green-600"}`}>
                            <div className={`px-6 py-4 flex items-start space-x-4`}>
                                <div className="text-2xl">
                                    {bannerMessage.includes("Error") ? "❌" : "✅"}
                                </div>
                                <div>
                                    <h3 className={`text-lg font-semibold ${bannerMessage.includes("Error") ? "text-red-700" : "text-green-700"}`}>
                                        {bannerMessage.includes("Error") ? t("submissionFailed") : t("messageSent")}
                                    </h3>
                                    <p className="text-sm text-gray-700 mt-1">{bannerMessage.includes("Error") ?  t("tryAgain") : t("thankYou")}</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="ml-auto text-gray-500 hover:text-gray-700"
                                >
                                    ✖
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="text-3xl font-semibold text-green-800 mb-4">{t("contactFormTitle")}</h2>
                    <p className="text-sm text-orange-500 mb-4"></p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="text"
                            name="name"
                            placeholder={t("placeholders.name")}
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-xl shadow-sm"
                            required
                        />
                        <input
                            type="text"
                            name="surname"
                            placeholder={t("placeholders.surname")}
                            value={formData.surname}
                            onChange={handleChange}
                            className="w-full border p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-xl shadow-sm"
                            required/>

                        <input
                            type="email"
                            name="email"
                            placeholder={t("placeholders.email")}
                            value={formData.email}
                            onChange={handleEmailChange}
                            className="w-full border p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-xl shadow-sm"
                            required
                        />
                        {emailError && <p className="text-red-500 text-sm">{t("errors.email")}</p>}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                            <div
                                className="flex items-center border border-gray-300 rounded-md p-4 w-full sm:w-[180px] shadow-sm">
                                <Flag
                                    code={countries.find(country => country.code === countryCode)?.flag || "US"}
                                    style={{width: "20px", height: "20px"}}
                                />
                                <select
                                    value={countryCode}
                                    onChange={handleCountryCodeChange}
                                    className="ml-4 border-none text-lg focus:ring-0 focus:outline-none w-full"
                                >
                                    {countries.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.code}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                placeholder={t("placeholders.phone")}
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                className={`w-full sm:w-auto border p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-xl shadow-sm ${phoneError ? "border-red-500" : ""}`}
                                required
                            />
                        </div>
                        {phoneError && <p className="text-red-500 text-sm">{t("errors.phone")}</p>}

                        <select
                            name="topic"
                            value={formData.topic}
                            onChange={e => setFormData({...formData, topic: e.target.value})}
                            className="w-full border p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-xl shadow-sm"
                            required
                        >
                            <option value="">{t("topicSelect")}</option>
                            {topics.map((topic, index) => (
                                <option key={index} value={t(`topics.${index}`)}>
                                    {t(`topics.${index}`)}
                                </option>
                            ))}
                        </select>

                        <textarea
                            name="message"
                            placeholder={t("placeholders.message")}
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full border p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-xl shadow-sm"
                            required
                        />
                        {messageError && <p className="text-red-500 text-sm">{t("errors.message")}</p>}

                        <button type="submit"
                                className="bg-green-600 text-white py-3 px-6 w-full rounded-xl hover:bg-green-700 transition duration-300 ease-in-out">
                            {t("submit")}
                        </button>
                    </form>
                </div>

                {/* Customer Service Section */}
                <div className="bg-white p-8 shadow-xl w-full max-w-4xl space-y-8 mx-auto my-10 rounded-xl"
                     style={{boxShadow: '0 0 50px rgba(0, 128, 0, 0.3)'}}>
                    <h2 className="text-2xl font-semibold text-green-700 mb-2">{t("customerService")}</h2>
                    <p className="text-2xl font-bold text-orange-400">(0212) 533 65 32</p>
                    <p className="text-2xl text-green-700 font-semibold">{t("companyName")}</p>
                    <p className="text-sm text-orange-400">
                        {t("address")}
                        <br/>
                        {t("phone")}
                        <br/>
                        {t("fax")}
                    </p>
                </div>
            </div>
        </div>
    );
}
