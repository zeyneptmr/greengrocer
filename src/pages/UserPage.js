import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role"); // Rol bilgisini al
        if (role === "ADMIN") {
            navigate("/admin");
        } else if (role === "MANAGER") {
            navigate("/manager");
        } else if (role === "USER") {
            navigate("/user");
        } else {
            navigate("/login"); // Eğer rol yoksa giriş sayfasına at
        }
    }, [navigate]);

    return (
        <div>
            <h1>User Page</h1>
        </div>
    );
};

export default UserPage;
