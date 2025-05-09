import { useState } from "react";
import { motion } from "framer-motion";
import aboutUsImage from '../assets/aboutUs.jpg';
import { useTranslation , Trans} from "react-i18next";

const AboutUs = () => {
    const [activeItems, setActiveItems] = useState([]);
    const { t } = useTranslation("aboutus");

    const toggleActive = (index) => {
        setActiveItems((prevActiveItems) =>
            prevActiveItems.includes(index)
                ? prevActiveItems.filter((item) => item !== index)
                : [...prevActiveItems, index]
        );
    };

    const items = [
        {
            title: t("items.ourMission.title"),
            text: t("items.ourMission.text"),
            color: "bg-green-700",
            icon: "🎯", 
            background: "bg-gradient-to-r from-green-500 to-blue-500" 
        },
        {
            title: t("items.ourProducts.title"),
            text: t("items.ourProducts.text"),
            color: "bg-orange-600",
            icon: "🥕", 
            background: "bg-gradient-to-r from-orange-400 to-yellow-500" 
        },
        {
            title: t("items.forFuture.title"),
            text: t("items.forFuture.text"),
            color: "bg-yellow-500",
            icon: "🌱", 
            background: "bg-gradient-to-r from-yellow-400 to-green-500" 
        },
    ];


    return (
        <div
            className="flex flex-col items-center justify-start min-h-screen p-8 bg-gradient-to-b from-green-50 via-orange-50 to-white">

            {/* About Us Section */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 tracking-wider text-center">
                    {t("aboutUsTitle")}
                </h1>
                <div className="h-1 w-24 bg-orange-500 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Who We Are Section */}
            <div
                className="max-w-5xl bg-white border-l-8 border-green-700 shadow-xl rounded-2xl p-8 mb-16 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-green-800 mb-4">{t("whoWeAre.title")}</h2>
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        {t("whoWeAre.text1")}
                    </p>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        {t("whoWeAre.text2")}
                    </p>
                </div>
                <div className="flex-1">
                    <img src={aboutUsImage} alt="GreenGrocer"
                         className="w-full h-auto rounded-lg shadow-xl object-cover"/>
                </div>
            </div>

            <div className="flex gap-16 items-center justify-center w-full flex-grow">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        className={`relative flex flex-col items-center justify-center w-48 h-48 text-white rounded-full cursor-pointer ${item.color}`}
                        animate={{
                            opacity: activeItems.includes(index) || activeItems.length === 0 ? 1 : 0.75,
                            scale: activeItems.includes(index) ? 1.1 : 1,
                            boxShadow: activeItems.includes(index) ? "0px 0px 10px 3px rgba(0, 0, 0, 0.5)" : "0px 0px 8px rgba(0, 0, 0, 0.3)",
                        }}
                        transition={{type: "spring", stiffness: 200, damping: 15}}
                        onClick={() => toggleActive(index)}
                    >
            <span className={`${activeItems.includes(index) ? 'text-xl' : 'text-lg'} font-semibold`}>
                {item.title}
            </span>
            
                        <div className="text-5xl mt-3">{item.icon}</div>
                    </motion.div>
                ))}
            </div>

        
            <div className="flex gap-16 items-center justify-center w-full mt-6">
                {items.map((item, index) => (
                    activeItems.includes(index) && (
                        <motion.div
                            key={index}
                            className="w-72 p-4 text-black shadow-lg rounded-lg mt-4"
                            initial={{opacity: 0, scale: 0.8}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 0.3}}
                            style={{
                                backgroundColor: "#F5F5DC", 
                            }}
                        >
                            {item.text}
                        </motion.div>
                    )
                ))}
            </div>


            <div className="h-16"></div>


            {/* Our Achievements Area */}
            <div className="max-w-6xl bg-white border-l-8 border-orange-500 shadow-xl rounded-2xl p-10 mb-20">
                <h2 className="text-3xl font-bold text-orange-600 mb-10 text-center">{t("achievements.title")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-700 text-lg">
                    {["1", "2", "3", "4", "5", "6"].map((num) => (
                        <div key={num}
                             className="flex flex-col items-center text-center p-4 bg-[#fefae0] rounded-xl shadow-md">
                            <div className="text-4xl mb-3">{t(`achievements.items.${num}.icon`)}</div>
                            <h3 className="font-semibold text-xl mb-1">{t(`achievements.items.${num}.title`)}</h3>
                            <p>{t(`achievements.items.${num}.text`)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Our Purpose Section */}
            <div className="max-w-6xl bg-white border-l-8 border-green-600 shadow-xl rounded-2xl p-10 mb-20">
                <h2 className="text-3xl font-bold text-green-700 mb-10 text-center">{t("purpose.title")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-700 text-lg">
                    {["1", "2", "3"].map((num) => (
                        <div key={num}
                             className="flex flex-col items-center text-center p-4 bg-[#edf6f9] rounded-xl shadow-md">
                            <div className="text-4xl mb-3">{t(`purpose.items.${num}.icon`)}</div>
                            <h3 className="font-semibold text-xl mb-1">{t(`purpose.items.${num}.title`)}</h3>
                            <p>{t(`purpose.items.${num}.text`)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-6xl bg-white border-l-8 border-orange-500 shadow-xl rounded-2xl p-10 mb-20">
                <h2 className="text-3xl font-bold text-orange-600 mb-10 text-center">{t("testimonials.title")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-700 text-lg">
                    {["1", "2", "3"].map((num) => (
                        <div key={num} className="flex flex-col items-center text-center p-4 bg-[#fefae0] rounded-xl shadow-md">
                            <div className="text-4xl mb-3">💬</div>
                            <p>{t(`testimonials.items.${num}.text`)}</p>
                            <p className="mt-2 font-semibold">{t(`testimonials.items.${num}.author`)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Customer Satisfaction Rate */}
            <div className="flex flex-col items-center justify-center mb-20">
                <div className="text-3xl font-bold text-green-800 mb-4 text-center">
                    {t("satisfaction.title")}
                </div>

                {/* Satisfaction Rates */}
                <div className="flex justify-center gap-12 mb-6">

                    {/* 98% Satisfaction Rate */}
                    <div className="flex flex-col items-center">
                        <div
                            className="w-36 h-36 flex items-center justify-center rounded-full bg-gradient-to-tr from-green-500 to-orange-400 shadow-lg mb-4">
                            <div className="text-white text-4xl font-extrabold">98%</div>
                        </div>
                        <p className="text-gray-600 text-center max-w-xs">
                            <Trans i18nKey="satisfaction.items.98" ns="aboutus">
                                We are proud to have achieved a <span className="font-semibold text-green-700">98% satisfaction rate</span> thanks to our commitment to freshness, service, and community trust.
                            </Trans>
                        </p>
                    </div>

                    {/* 95% Satisfaction Rate */}
                    <div className="flex flex-col items-center">
                        <div
                            className="w-36 h-36 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 shadow-lg mb-4">
                            <div className="text-white text-4xl font-extrabold">95%</div>
                        </div>
                        <p className="text-gray-600 text-center max-w-xs">
                            <Trans i18nKey="satisfaction.items.95" ns="aboutus">
                                Our <span className="font-semibold text-blue-700">95% customer loyalty rate</span> shows that people love coming back for more.
                            </Trans>
                        </p>
                    </div>

                    {/* 92% Satisfaction Rate */}
                    <div className="flex flex-col items-center">
                        <div
                            className="w-36 h-36 flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-pink-400 shadow-lg mb-4">
                            <div className="text-white text-4xl font-extrabold">92%</div>
                        </div>
                        <p className="text-gray-600 text-center max-w-xs">
                            <Trans i18nKey="satisfaction.items.92" ns="aboutus">
                                With a <span className="font-semibold text-purple-700">92% positive feedback</span>, our customers continue to express satisfaction with the quality and service we provide.
                            </Trans>
                        </p>
                    </div>
                </div>
            </div>



        </div>
    );
};

export default AboutUs;