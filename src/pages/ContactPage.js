import { useState } from "react";
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
        phone: "",
        topic: "",
        message: "",
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
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
        const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
        let formattedValue = "";

        if (value.length > 0) formattedValue += "(" + value.substring(0, 3);
        if (value.length >= 4) formattedValue += ") " + value.substring(3, 6);
        if (value.length >= 7) formattedValue += "-" + value.substring(6, 10);

        setPhoneNumber(formattedValue);
        if (value.length === 10) {
            setPhoneError(null);
        } else {
            setPhoneError("Please enter a valid phone number!");
        }
    };

    const handleCountryCodeChange = (e) => {
        setCountryCode(e.target.value);
    };

    const countLettersOnly = (text) => {
        return (text.match(/[a-zA-ZğüşıöçĞÜŞİÖÇ]/g) || []).length;
    };

    const handleSubmit = (e) => {
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
        localStorage.setItem("contactForm", JSON.stringify(formData));

        // Show banner message
        setBannerMessage("Your form has been successfully submitted!");
        setIsModalOpen(true);

        setTimeout(() => {
            setIsModalOpen(false);
            setBannerMessage(""); // Banner mesajını da temizle
        }, 5000);

        setFormData({
            name: "",
            surname: "",
            email: "",
            phone: "",
            topic: "",
            message: "",
        });
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 sm:p-10">
            <div className="bg-white p-8 shadow-xl w-full max-w-4xl space-y-8 mx-auto my-10"
                 style={{boxShadow: '0 0 50px rgba(0, 128, 0, 0.5)'}}>

                {/* Banner Penceresi */}
                {isModalOpen && (
                    <div
                        className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white border-4 border-green-500 p-6 shadow-lg rounded-lg flex flex-col items-center text-center w-96 animate-fade-in">
                        <div className="bg-orange-500 w-full py-2 rounded-t-lg text-white font-bold">
                            Success!
                        </div>
                        <div className="text-green-700 font-medium p-4">
                            {bannerMessage}
                        </div>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-2 px-4 py-1 bg-green-500 text-white font-semibold rounded-md hover:bg-green-700"
                        >
                            Close
                        </button>
                    </div>
                )}

                <div>
                    <h2 className="text-3xl font-semibold text-green-700 mb-2">Contact Form</h2>
                    <p className="text-sm text-orange-500 mb-4"></p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name*"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            required
                        />
                        <input
                            type="text"
                            name="surname"
                            placeholder="Surname*"
                            value={formData.surname}
                            onChange={handleChange}
                            className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            required/>

                        <input
                            type="email"
                            name="email"
                            placeholder="E-mail Address*"
                            value={formData.email}
                            onChange={handleEmailChange}
                            className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            required
                        />
                        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                            <div
                                className="flex items-center border border-gray-300 rounded-md p-2 w-full sm:w-[150px]">
                                <Flag
                                    code={countries.find(country => country.code === countryCode)?.flag || "US"}
                                    style={{width: "20px", height: "20px"}}
                                />
                                <select
                                    value={countryCode}
                                    onChange={handleCountryCodeChange}
                                    className="ml-2 border-none text-lg focus:ring-0 focus:outline-none w-full"
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
                                placeholder="Phone Number* (Format: 555-555-5555)"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                className={`w-full sm:w-auto border p-2 focus:outline-none focus:ring-2 focus:ring-orange-400 ${phoneError ? "border-red-500" : ""}`}
                                required
                            />
                        </div>
                        {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}

                        <select
                            name="topic"
                            value={formData.topic}
                            onChange={e => setFormData({...formData, topic: e.target.value})}
                            className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                            className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            required
                        />
                        {messageError && <p className="text-red-500 text-sm">{messageError}</p>}

                        <button type="submit" className="bg-green-500 text-white py-2 px-4 w-full">Submit</button>
                    </form>
                </div>

                {/* Customer Service Section */}
                <div className="bg-white p-8 shadow-xl w-full max-w-4xl space-y-8 mx-auto my-10"
                     style={{boxShadow: '0 0 50px rgba(0, 128, 0, 0.5)'}}>
                    <h2 className="text-2xl font-semibold text-green-700 mb-2">Customer Service</h2>
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