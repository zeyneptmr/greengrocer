// Example UserPage.js
import React from 'react';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const ManagerPage = () => {
    return (
        <div>
            <Sidebar/>

                {/* TopBar Bileşeni */}
                <Topbar/>

            <h1>Manager Page</h1>
        </div>
    );
};

export default ManagerPage;
