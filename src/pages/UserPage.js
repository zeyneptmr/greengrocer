import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Eğer kullanıcı giriş yapmışsa Home sayfasına yönlendir
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (loggedInUser) {
            console.log("User is logged in:", loggedInUser);
            navigate("/user/home"); // Home sayfasına yönlendir
        } else {
            console.log("No user logged in.");
            navigate("/login"); // Eğer kullanıcı yoksa login sayfasına yönlendir
        }
    }, [navigate]);

    return (
        <div>
            <h1>User Page</h1>
        </div>
    );
};

export default UserPage;
