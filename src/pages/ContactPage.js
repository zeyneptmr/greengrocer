// ContactPage.js
import React, { useState } from 'react';
import '../styles/ContactPage.css';


function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted with:", formData);
    };

    return (
        <div className="contact-container">
            <form className="contact-form" onSubmit={handleSubmit}>
                <h1>Contact Us</h1>

                <div>
                    <label htmlFor="firstName">Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        onFocus={(e) => e.target.style.boxShadow = '0 0 8px rgba(0, 128, 0, 0.3)'}
                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                    />
                </div>

                <div>
                    <label htmlFor="lastName">Surname:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        onFocus={(e) => e.target.style.boxShadow = '0 0 8px rgba(0, 128, 0, 0.3)'}
                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                    />
                </div>

                <div>
                    <label htmlFor="email">E-Mail Address:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        onFocus={(e) => e.target.style.boxShadow = '0 0 8px rgba(0, 128, 0, 0.3)'}
                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                    />
                </div>

                <div>
                    <label htmlFor="phone">Phone Number:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        onFocus={(e) => e.target.style.boxShadow = '0 0 8px rgba(0, 128, 0, 0.3)'}
                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                    />
                </div>

                <div>
                    <label htmlFor="subject">Topic:</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        onFocus={(e) => e.target.style.boxShadow = '0 0 8px rgba(0, 128, 0, 0.3)'}
                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                    />
                </div>

                <div>
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        onFocus={(e) => e.target.style.boxShadow = '0 0 8px rgba(0, 128, 0, 0.3)'}
                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                    />
                </div>

                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default ContactPage;

