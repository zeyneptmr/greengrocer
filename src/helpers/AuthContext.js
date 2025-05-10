
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null);

    return (
        <AuthContext.Provider value={{ role, setRole, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};
