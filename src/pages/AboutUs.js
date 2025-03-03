import { useState } from "react";
import { motion } from "framer-motion";
import backgroundImg from "../assets/background1.jpg"; // Dosya yolu doğru olmalı

const AboutUs = () => {
    const [activeItems, setActiveItems] = useState([]);

    const toggleActive = (index) => {
        setActiveItems((prevActiveItems) =>
            prevActiveItems.includes(index)
                ? prevActiveItems.filter((item) => item !== index)
                : [...prevActiveItems, index]
        );
    };

    const items = [
        { title: "Our Motion", text: "Our motion is Quality and Trust with the motto of bringing the freshest products just a TAP away..", color: "bg-green-700" },
        { title: "Our Products", text: "We offer you homemade, daily, fresh, organic and natural products.", color: "bg-orange-600" },
        { title: "For Future", text: "We aim for sustainable production and innovation that supports farmers.", color: "bg-yellow-500" },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 bg-cover bg-opacity-80"
             style={{ backgroundImage: `url(${backgroundImg})`, overflow: "hidden" }}> {/* Arka plan görselini buraya ekledik */}

            {/* Hakkımızda yazısının üstündeki beyaz kutu */}
            <div
                className="relative p-4 rounded-lg mb-12"
                style={{
                    backgroundColor: "#FFFFFF", // Beyaz arka plan
                    boxShadow: "0px 0px 15px 2px rgba(0, 128, 0, 0.8)", // Yeşil gölge
                    display: "inline-block",
                }}
            >
                <h1
                    className="text-4xl md:text-5xl font-extrabold"
                    style={{
                        color: "#000000", // Siyah renk
                        textAlign: "center", // Ortalamak için
                        letterSpacing: "5px", // Harfler arasına mesafe
                        lineHeight: "1.2", // Satır yüksekliği
                    }}
                >
                    About Us
                </h1>
            </div>

            <div className="flex flex-col gap-12 items-center justify-center w-full flex-grow"> {/* gap-16 yerine gap-20 kullanarak mesafeyi artırdık */}
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        className={`relative flex items-center justify-center w-40 h-40 text-white rounded-full cursor-pointer ${item.color}`}
                        animate={{
                            x: activeItems.includes(index) ? (index === 1 ? 200 : -200) : 0,
                            opacity: activeItems.includes(index) || activeItems.length === 0 ? 1 : 0.75, // Opaklık %75 olacak
                            scale: activeItems.includes(index) ? 1.1 : 1, // Yazıyı 2 tık büyüt
                            boxShadow: activeItems.includes(index) ? "0px 0px 10px 3px rgba(0, 0, 0, 0.5)" : "0px 0px 8px rgba(0, 0, 0, 0.3)", // Siyah gölge
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        onClick={() => toggleActive(index)}
                    >
                        <span className={`${activeItems.includes(index) ? 'text-xl' : 'text-lg'} font-semibold`}>
                            {item.title}
                        </span>
                        {activeItems.includes(index) && (
                            <motion.div
                                className="absolute top-1/2 transform -translate-y-1/2 w-64 p-4 text-black shadow-lg rounded-lg"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    backgroundColor: "#F5F5DC", // Krem rengi arka plan
                                    left: index === 1 ? "-280px" : "120%",
                                    marginTop: "-10px", // 1 birim yukarı kaydırmak için
                                }}
                            >
                                {item.text}
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AboutUs;
