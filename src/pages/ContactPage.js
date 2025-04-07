import { useState } from "react";
import axios from "axios";
import Flag from "react-world-flags"; // Import the flag component

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
        setEmailError(value && !validateEmail(value) ? "Please enter a valid email address." : "");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "name" || name === "surname") {
            if (/^[a-zA-ZğüşıöçĞÜŞİÖÇ ]*$/.test(value)) {
                setFormData({ ...formData, [name]: value });
            }
        } else if (name === "message") {
            setFormData({ ...formData, [name]: value });
            setMessageError(countLettersOnly(value) < 20 ? "Your message must be at least 20 characters." : "");
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
            setPhoneError("Please enter a valid phone number!");
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
            alert("The message must contain at least 20 letters.");
            return;
        }
        if (phoneNumber.replace(/\D/g, "").length !== 10) {
            setPhoneError("Please enter a valid phone number.");
            return;
        }
        if (emailError || phoneError) {
            alert("Please correct the errors in the form..");
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
                                        {bannerMessage.includes("Error") ? "Submission Failed" : "Message Sent Successfully"}
                                    </h3>
                                    <p className="text-sm text-gray-700 mt-1">{bannerMessage.includes("Error") ? "Please try again later or check your input." : "Thank you for your feedback! We’ll get back to you shortly."}</p>
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
                    <h2 className="text-3xl font-semibold text-green-800 mb-4">Contact Form 📞</h2>
                    <p className="text-sm text-orange-500 mb-4"></p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="text"
                            name="name"
                            placeholder="Green"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-xl shadow-sm"
                            required
                        />
                        <input
                            type="text"
                            name="surname"
                            placeholder="Grocer"
                            value={formData.surname}
                            onChange={handleChange}
                            className="w-full border p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-xl shadow-sm"
                            required/>

                        <input
                            type="email"
                            name="email"
                            placeholder="example@taptaze.com"
                            value={formData.email}
                            onChange={handleEmailChange}
                            className="w-full border p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-xl shadow-sm"
                            required
                        />
                        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

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
                                placeholder="234 567 8901"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                className={`w-full sm:w-auto border p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-xl shadow-sm ${phoneError ? "border-red-500" : ""}`}
                                required
                            />
                        </div>
                        {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}

                        <select
                            name="topic"
                            value={formData.topic}
                            onChange={e => setFormData({...formData, topic: e.target.value})}
                            className="w-full border p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-xl shadow-sm"
                            required
                        >
                            <option value="">-- Select --</option>
                            {topics.map((topic, index) => (
                                <option key={index} value={topic}>{topic}</option>
                            ))}
                        </select>

                        <textarea
                            name="message"
                            placeholder="Message*"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full border p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-xl shadow-sm"
                            required
                        />
                        {messageError && <p className="text-red-500 text-sm">{messageError}</p>}

                        <button type="submit"
                                className="bg-green-600 text-white py-3 px-6 w-full rounded-xl hover:bg-green-700 transition duration-300 ease-in-out">
                            Submit ✉️
                        </button>
                    </form>
                </div>

                {/* Customer Service Section */}
                <div className="bg-white p-8 shadow-xl w-full max-w-4xl space-y-8 mx-auto my-10 rounded-xl"
                     style={{boxShadow: '0 0 50px rgba(0, 128, 0, 0.3)'}}>
                    <h2 className="text-2xl font-semibold text-green-700 mb-2">Customer Service 📞</h2>
                    <p className="text-2xl font-bold text-orange-400">(0212) 533 65 32</p>
                    <p className="text-2xl text-green-700 font-semibold">TapTaze Food Services Inc.</p>
                    <p className="text-sm text-orange-400">
                        Address: Cibali Mah. Kadir Has Cad. 34083 Fatih / İSTANBUL
                        <br/>
                        Phone Number: (0212) 533 65 32
                        <br/>
                        Fax: (0212) 533 65 32
                    </p>
                </div>
            </div>
        </div>
    );
}
