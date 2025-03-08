import React, { useState, useEffect } from 'react';
import UserSidebar from "../components/UserSidebar";

const CustomerInfo = () => {
    const [user, setUser] = useState({
        name: '',
        surname: '',
        email: '',
        phoneNumber: ''
    });

    const [initialUser, setInitialUser] = useState(null); // Başlangıç verisini saklamak için
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false); // Buton aktif mi?

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users'));
        if (storedUsers && storedUsers.length > 0) {
            setUser(storedUsers[0]);
            setInitialUser(storedUsers[0]);

        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "name" || name === "surname") {
            if (!/^[a-zA-ZğüşöçıİĞÜŞÖÇ]*$/.test(value)) return;
        }

        if (name === "phoneNumber") {
            let rawNumbers = value.replace(/\D/g, "").slice(0, 10);
            if (rawNumbers.length > 0 && rawNumbers[0] === "0") return;

            let formattedPhone = "";
            if (rawNumbers.length > 0) formattedPhone += `(${rawNumbers.slice(0, 3)}`;
            if (rawNumbers.length > 3) formattedPhone += `) ${rawNumbers.slice(3, 6)}`;
            if (rawNumbers.length > 6) formattedPhone += ` ${rawNumbers.slice(6, 8)}`;
            if (rawNumbers.length > 8) formattedPhone += ` ${rawNumbers.slice(8, 10)}`;

            setUser({ ...user, phoneNumber: formattedPhone });
        } else {
            setUser({ ...user, [name]: value });
        }

        setIsUpdated(JSON.stringify({ ...user, [name]: value }) !== JSON.stringify(initialUser));
    };

    const handleUpdate = () => {
        if (!user.name || !user.surname || !user.phoneNumber) {
            setError("Please fill out all fields completely!");
            setSuccess(false);
            return;
        }

        const rawPhoneNumber = user.phoneNumber.replace(/\D/g, ""); // Sadece rakamları al
        if (rawPhoneNumber.length !== 10) {
            setError("Phone number must be exactly 10 digits!");
            setSuccess(false);
            return;
        }

        if (!isUpdated) return; // Değişiklik yoksa işlem yapma

        setError('');
        localStorage.setItem('users', JSON.stringify([user]));
        setInitialUser(user);
        setSuccess(true);
        setIsUpdated(false); // Güncellendikten sonra buton tekrar devre dışı
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="flex bg-green-50 min-h-screen">
            <UserSidebar/>

            <div className="p-8 max-w-2xl mx-auto w-full bg-white shadow-lg rounded-xl mt-12 mb-12 min-h-[600px]">
                <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Account Information</h2>
                <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl border-t-4 border-orange-500">
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {success && (
                        <div
                            className="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded relative mb-4 text-center">
                            <strong className="font-bold">Information is TapTaze !</strong> Changes have been updated
                            successfully.
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Surname</label>
                        <input
                            type="text"
                            name="surname"
                            value={user.surname}
                            onChange={handleChange}
                            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">E-mail</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            readOnly
                            className="w-full mt-1 p-3 border rounded-lg bg-gray-100"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold">Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={user.phoneNumber}
                            onChange={handleChange}
                            maxLength="15"
                            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <button
                        onClick={handleUpdate}
                        disabled={!isUpdated} // Eğer değişiklik yapılmadıysa buton devre dışı
                        className={`w-full py-3 px-4 rounded-lg text-lg font-bold transition-all 
                            ${isUpdated
                            ? "bg-orange-600 text-white hover:bg-orange-700"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerInfo;


