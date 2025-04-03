
import { useState, useEffect } from "react";
import Flag from "react-world-flags";
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Navigate } from "react-router-dom";

import ForgotPassword from './ForgotPassword';

import axios from "axios";

const Account = ({ isOpen, onClose }) => {
    const [isForgotPassword, setIsForgotPassword] = useState(false); // Modal için state
    const navigate = useNavigate(); // Initialize the navigate function
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    //const [isLoginModalOpen, setIsLoginModalOpen] = useState(true); // Login modalının açık olup olmadığını kontrol etFo
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        countryCode: "+90", // Default country code
    });

    const [errors, setErrors] = useState({
        emailError: null,
        passwordError: null,
        confirmPasswordError: null,
        phoneError: null,
    });

    const [message, setMessage] = useState(""); // Message to display success or error
    //const [token, setToken] = useState(null);
    //const [role, setRole] = useState(localStorage.getItem('role') || '');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen]);
    /*useEffect(() => {
        if (!role) return;

        console.log("Role detected:", role);
        if (role === "ADMIN") {
            navigate("/admin", { replace: true });
        } else if (role === "MANAGER") {
            navigate("/manager", { replace: true });

        } else if (role === "USER") {
            navigate("/user", { replace: true });
        }
    }, [role, navigate]); */


    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜ]/g, "");
        setFormData((prevData) => ({
            ...prevData,
            name: value,
        }));
    };

    const handleSurnameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜ]/g, "");
        setFormData((prevData) => ({
            ...prevData,
            surname: value,
        }));
    };

    const handleEmailChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9@._-]/g, "");
        setFormData((prevData) => ({
            ...prevData,
            email: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            emailError: value && !validateEmail(value) ? "Please enter a valid email address." : null,
        }));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            password: value,
        }));
        if (isRegister) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                passwordError: value.length >= 8 ? null : "Password must be at least 8 characters long!",
            }));
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            confirmPassword: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPasswordError: value !== formData.password ? "Passwords do not match!" : null,
        }));
    };

    const handlePhoneChange = (e) => {
        let rawValue = e.target.value.replace(/\D/g, "");

        if (rawValue.length > 10) {
            rawValue = rawValue.substring(0, 10);
        }

        let formattedValue = "";
        if (rawValue.length > 0) formattedValue += `(${rawValue.substring(0, 3)}`;
        if (rawValue.length >= 4) formattedValue += `) ${rawValue.substring(3, 6)}`;
        if (rawValue.length >= 7) formattedValue += `-${rawValue.substring(6, 10)}`;

        setFormData((prevData) => ({
            ...prevData,
            phoneNumber: formattedValue,
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            phoneError: rawValue.length === 10 ? null : "Please enter a valid phone number!",
        }));
    };

    const handleCountryCodeChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            countryCode: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password, confirmPassword, phoneNumber } = formData;
        const emailValid = validateEmail(email);
        const passwordsMatch = password === confirmPassword;
        const phoneValid = phoneNumber.replace(/\D/g, "").length === 10;

        if (!emailValid) setErrors((prevErrors) => ({ ...prevErrors, emailError: "Please enter a valid email address." }));
        if (isRegister && !passwordsMatch) setErrors((prevErrors) => ({ ...prevErrors, confirmPasswordError: "Passwords do not match!" }));
        if (isRegister && password.length < 8) setErrors((prevErrors) => ({ ...prevErrors, passwordError: "Password must be at least 8 characters long!" }));
        if (isRegister && !phoneValid) setErrors((prevErrors) => ({ ...prevErrors, phoneError: "Please enter a valid phone number!" }));

        if (emailValid && (!isRegister || (passwordsMatch && password.length >= 8 && phoneValid))) {
            const userData = { name: formData.name, surname: formData.surname, email, password, phoneNumber };

            if (isRegister) {
                // Register - Backend'e veri gönderme
                axios.post("http://localhost:8080/api/users/register", userData, { withCredentials: true })
                    .then(response => {
                        console.log("Response Data:", response.data);
                        setMessage(response.data);
                        if (response.data === "Registration successful!") {
                            setFormData({
                                name: "",
                                surname: "",
                                email: "",
                                password: "",
                                confirmPassword: "",
                                phoneNumber: "",
                                countryCode: "+90",
                            });

                            setErrors({
                                emailError: "",
                                phoneError: "",
                                passwordError: "",
                                confirmPasswordError: "",
                            });

                            setTimeout(() => {
                                    setIsRegister(false);
                                    setMessage(""); // Kullanıcıyı giriş ekranına yönlendir
                            }, 4000);

                            return <Navigate to="/*" />;
                        }
                    })
                    .catch(error => {
                        console.error("An account with this email already exists!", error);
                        setMessage("An account with this email already exists!");
                    });
            } else {
                // Login - Backend'e giriş isteği gönderme
                axios.post("http://localhost:8080/api/users/login", { email, password }, { withCredentials: true })
                    .then(response => {
                        console.log("Login Response:", response.data);
                        if (response.data.role) {
                            console.log("role: ", response.data.role)

                            if(response.data.role === "USER") {
                                localStorage.setItem("loggedInUser", JSON.stringify(response.data.role));
                            }
                            onClose();

                            if (response.data.role === "ADMIN") {
                                navigate("/admin", { replace: true });
                            } else if (response.data.role === "MANAGER") {
                                navigate("/manager", { replace: true });
                            } else if (response.data.role === "USER") {
                                navigate("/user/home", { replace: true });
                            }

                            // Kullanıcı bilgilerini doğrulamak için /me endpoint'ini çağır
                            axios.get("http://localhost:8080/api/users/me", { withCredentials: true })
                                .then(authResponse => {
                                    //console.log("Authenticated user:", authResponse.data);
                                    // Eğer kullanıcı doğrulandıysa, sayfaya yönlendirme yapılabilir
                                })
                                .catch(error => {
                                    console.error("Error during authentication check:", error);
                                    // Hata durumunda yapılacak işlemler
                                });

                            setFormData({
                                name: "",
                                surname: "",
                                email: "",
                                password: "",
                                confirmPassword: "",
                                phoneNumber: "",
                                countryCode: "+90",
                            });

                            setErrors({
                                emailError: "",
                                phoneError: "",
                                passwordError: "",
                                confirmPasswordError: "",
                            });

                        } else {
                            setMessage("Invalid email or password.");
                            setTimeout(() => {
                                setMessage("");  // 5 saniye sonra mesajı temizle
                            }, 3000);
                        }
                    })
                    .catch(error => {
                        console.error("Login error:", error.response ? error.response.data : error.message);
                        setMessage("Invalid email or password!");
                        setTimeout(() => {
                            setMessage("");  // 5 saniye sonra mesajı temizle
                        }, 3000);
                    });
            }
        }
    };


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

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg text-center relative w-[460px] border-2 border-orange-500">
                <button className="absolute top-2 right-2 border-none bg-transparent cursor-pointer text-2xl" onClick={onClose}>&times;</button>
                <form onSubmit={handleSubmit}>
                    {isRegister ? (
                        <>
                            <h2 className="text-xl font-bold text-green-600">Sign Up</h2>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleNameChange}
                                className="block w-full p-4 my-2 border border-gray-300 rounded-md text-lg focus:border-orange-600"
                                required
                            />
                            <input
                                type="text"
                                name="surname"
                                placeholder="Surname"
                                value={formData.surname}
                                onChange={handleSurnameChange}
                                className="block w-full p-4 my-2 border border-gray-300 rounded-md text-lg focus:border-orange-600"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                value={formData.email}
                                onChange={handleEmailChange}
                                className={`block w-full p-4 my-2 border rounded-md text-lg focus:border-orange-600 ${errors.emailError ? "border-red-500" : "border-gray-300"}`}
                                required
                            />
                            {errors.emailError && <p className="text-red-500 text-sm mt-1">{errors.emailError}</p>}
                            <div className="flex items-center space-x-2">
                                <div
                                    className="flex items-center border border-gray-300 rounded-md w-[150px] h-[60px] p-2">
                                    <Flag
                                        code={countries.find(country => country.code === formData.countryCode)?.flag || "US"}
                                        style={{width: "20px", height: "30px"}}
                                    />
                                    <select
                                        value={formData.countryCode}
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
                                    name="phoneNumber"
                                    placeholder="Phone number"
                                    value={formData.phoneNumber}
                                    onChange={handlePhoneChange}
                                    className={`block w-full p-4 my-2 border rounded-md text-lg focus:border-orange-600 ${errors.phoneError ? "border-red-500" : "border-gray-300"}`}
                                    required
                                />
                            </div>
                            {errors.phoneError && <p className="text-red-500 text-sm mt-1">{errors.phoneError}</p>}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                    className={`block w-full p-4 my-2 border rounded-md text-lg focus:border-orange-600 ${errors.passwordError ? "border-red-500" : "border-gray-300"}`}
                                    required
                                />
                                <span
                                    className="absolute top-5 right-4 cursor-pointer text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
                                </span>
                            </div>

                            {errors.passwordError &&
                                <p className="text-red-500 text-sm mt-1">{errors.passwordError}</p>}
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className={`block w-full p-4 my-2 border rounded-md text-lg focus:border-orange-600 ${errors.confirmPasswordError ? "border-red-500" : "border-gray-300"}`}
                                    required
                                />
                                <span
                                    className="absolute top-5 right-4 cursor-pointer text-gray-500"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
                                </span>
                            </div>

                            {errors.confirmPasswordError &&
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPasswordError}</p>}
                            <button
                                type="submit"

                                className="w-full p-4 bg-green-600 text-white rounded-md cursor-pointer transition-transform hover:scale-105 hover:shadow-lg">

                                Sign Up

                            </button>

                            {/* ForgotPassword Modal */}
                            {isForgotPassword && <ForgotPassword onClose={() => setIsForgotPassword(false)}/>}
                            <p className="mt-2">Already have an account? <span

                                className="text-green-600 underline cursor-pointer"
                                onClick={() => setIsRegister(false)}>Log In</span></p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-green-600">Log In</h2>
                            <input
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                value={formData.email}
                                onChange={handleEmailChange}
                                className="block w-full p-4 my-2 border border-gray-300 rounded-md text-lg focus:border-orange-600"
                                required
                            />

                            {errors.emailError && <p className="text-red-500 text-sm mt-1">{errors.emailError}</p>}

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                    className="block w-full p-4 my-2 border border-gray-300 rounded-md text-lg focus:border-orange-600"
                                    required
                                />
                                <span
                                    className="absolute top-5 right-4 cursor-pointer text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                {showPassword ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
                                </span>
                            </div>

                            <button type="submit"
                                    className="w-full p-4 bg-green-600 text-white rounded-md cursor-pointer transition-transform hover:scale-105 hover:shadow-lg">
                                Log In
                            </button>
                            <p className="mt-2">Don't have an account? <span className="text-green-600 underline cursor-pointer" onClick={() => setIsRegister(true)}>Sign Up</span></p>
                            <p className="mt-2">
                                 <span
                                     className="text-green-700 underline cursor-pointer"
                                     onClick={() => {
                                         setIsForgotPassword(true); // Forgot Password modalını aç
                                     }}
                                 >
                        Forgot Password?
                    </span>
                            </p>

                            {/* ForgotPassword Modal */}
                            {isForgotPassword && <ForgotPassword onClose={() => setIsForgotPassword(false)}/>}
                        </>
                    )}
                </form>
                {message && <p className="text-center mt-3 text-green-600">{message}</p>} {/* Display message */}
            </div>

        </div>

    );

};

export default Account;
