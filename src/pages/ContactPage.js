import { useState } from "react";

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

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
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

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, email: value });
        if (value && !validateEmail(value)) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError(null);
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
        let formattedValue = "";

        if (value.length > 0) {
            formattedValue += "(" + value.substring(0, 3);
        }
        if (value.length >= 4) {
            formattedValue += ") " + value.substring(3, 6);
        }
        if (value.length >= 7) {
            formattedValue += "-" + value.substring(6, 10);
        }
        setPhoneNumber(formattedValue);
        if (value === "") {
            setPhoneError(null);
        } else {
            const phoneValid = value.length === 10;
            setPhoneError(phoneValid ? null : "Please enter a valid phone number!");
        }
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
        if (emailError || phoneError) {
            alert("Please correct the errors in the form..");
            return;
        }
        console.log(formData);
    };

    return (
        <div className="flex flex-col md:flex-row justify-center items-start p-10 space-x-10">
            <div className="bg-white p-8 shadow-lg w-full md:w-1/2">
                <h2 className="text-3xl font-semibold text-green-700 mb-2">Contact Form</h2>
                <p className="text-sm text-orange-500 mb-4">*To provide you with better service, you need to log in.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="Name*" value={formData.name} onChange={handleChange}
                           className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-orange-400" required/>
                    <input type="text" name="surname" placeholder="Surname*" value={formData.surname}
                           onChange={handleChange} className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-orange-400" required/>
                    <input type="email" name="email" placeholder="E-mail Address*" value={formData.email} onChange={handleEmailChange} className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-orange-400" required/>
                    {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

                    <input type="tel" name="phone" placeholder="Phone Number* (Format: 555-555-5555)" value={phoneNumber} onChange={handlePhoneChange} className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-orange-400" required/>
                    {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
                    <select name="topic" value={formData.topic} onChange={handleChange} className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-orange-400" required>
                        <option value="">-- Select --</option>
                        {topics.map((topic, index) => (
                            <option key={index} value={topic}>{topic}</option>
                        ))}
                    </select>
                    <textarea name="message" placeholder="Message*" value={formData.message} onChange={handleChange}
                              className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-orange-400" required></textarea>
                    {messageError && <p className="text-red-500 text-sm">{messageError}</p>}
                    <button type="submit" className="bg-green-500 text-white py-2 px-4 w-full">Submit</button>
                </form>
            </div>

            {/* Customer Service Section */}
            <div className="bg-white p-8 shadow-lg w-full md:w-1/3">
                <h2 className="text-2xl font-semibold text-green-700 mb-2">Customer Service</h2>
                <p className="text-2xl font-bold">(0212) 533 65 32</p>
                <p className="text-2xl text-green-700 font-semibold">TapTaze Food Services Inc.</p>
                <p className="text-sm text-gray-600">
                    Address: Cibali Mah. Kadir Has Cad. 34083 Fatih / İSTANBUL
                    <br />
                    Phone Number: (0212) 533 65 32
                    <br />
                    Fax: (0212) 533 65 32
                </p>
            </div>
        </div>
    );
}
