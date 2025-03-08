import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (loggedInUser) {
            console.log("User is logged in:", loggedInUser);
            navigate("/user/home");
        } else {
            console.log("No user logged in.");
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div>
            <h1>User Page</h1>
        </div>
    );
};

export default UserPage;
