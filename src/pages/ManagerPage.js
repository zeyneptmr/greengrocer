// Example UserPage.js
import React from 'react';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Clock from "../components/Clock";

const ManagerPage = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar/>

            {/* TopBar Bileşeni */}

            <main className="flex-1 flex flex-col">
                {/* TopBar Bileşeni */}
                <Topbar/>
                <div className="p-6">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-2xl font-bold text-green-700">Today</h3>
                            <p className="text-2xl text-gray-500 font-medium"><Clock/></p>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-2xl font-bold text-green-700">Total Sales</h3>
                            <p className="text-2xl text-gray-500 font-medium">$45,300</p>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-2xl font-bold text-green-700">MANAGER PAGE</h3>
                            <p className="text-2xl text-gray-500 font-medium">120</p>
                        </div>
                    </div>
                </div>
            </main>


        </div>
    );
};

export default ManagerPage;
