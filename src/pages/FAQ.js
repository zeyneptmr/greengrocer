import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const { t } = useTranslation("faq");

    const toggleActive = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const faqItems = [
        {
            question: t("questions.whyBecomeMember.question"),
            answer: t("questions.whyBecomeMember.answer"),
            icon: "⭐",
        },
        {
            question: t("questions.howBecomeMember.question"),
            answer: t("questions.howBecomeMember.answer"),
            icon: "📝",
        },
        {
            question: t("questions.forgotPassword.question"),
            answer: t("questions.forgotPassword.answer"),
            icon: "🔑",
        },
        {
            question: t("questions.updateAddress.question"),
            answer: t("questions.updateAddress.answer"),
            icon: "🏠",
        },
        {
            question: t("questions.updatePhone.question"),
            answer: t("questions.updatePhone.answer"),
            icon: "📱",
        },
        {
            question: t("questions.dataSecurity.question"),
            answer: t("questions.dataSecurity.answer"),
            icon: "🔒",
        },
        {
            question: t("questions.homeDelivery.question"),
            answer: t("questions.homeDelivery.answer"),
            icon: "🚚",
        },
        {
            question: t("questions.productsOrganic.question"),
            answer: t("questions.productsOrganic.answer"),
            icon: "🌱",
        },
        {
            question: t("questions.productDiscounts.question"),
            answer: t("questions.productDiscounts.answer"),
            icon: "🎉",
        },
        {
            question: t("questions.placeOrder.question"),
            answer: t("questions.placeOrder.answer"),
            icon: "🛒",
        },
        {
            question: t("questions.returnExchange.question"),
            answer: t("questions.returnExchange.answer"),
            icon: "🚫",
        },
        {
            question: t("questions.paymentMethods.question"),
            answer: t("questions.paymentMethods.answer"),
            icon: "💳",
        },
        {
            question: t("questions.trackOrder.question"),
            answer: t("questions.trackOrder.answer"),
            icon: "📦",
        },
        {
            question: t("questions.deleteMembership.question"),
            answer: t("questions.deleteMembership.answer"),
            icon: "😢",
        },
    ];

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-8 bg-gradient-to-b from-green-50 via-orange-50 to-white">
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 tracking-wider">
                    {t("title")}
                </h1>
                <div className="h-1 w-24 bg-orange-500 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="w-full max-w-3xl space-y-6">
                {faqItems.map((item, index) => (
                    <motion.div
                        key={index}
                        className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl cursor-pointer"
                        onClick={() => toggleActive(index)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl">{item.icon}</div>
                                <h2 className="text-2xl font-semibold text-green-800">{item.question}</h2>
                            </div>
                            <div className="text-2xl text-green-700">{activeIndex === index ? "−" : "+"}</div>
                        </div>
                        {activeIndex === index && (
                            <motion.div
                                className="mt-4 text-gray-700 text-lg leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                {item.answer}
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
