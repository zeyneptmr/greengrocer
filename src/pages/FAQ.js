import { useState } from "react";
import { motion } from "framer-motion";

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleActive = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const faqItems = [
        {
            question: "Why should I become a member?",
            answer: "Membership offers you exclusive opportunities, discounts, new products, and personalized suggestions, making your shopping experience more enjoyable and advantageous. Additionally, you won’t have to re-enter your contact information, delivery address, and billing address every time you complete a purchase. You can view your previous orders, create favorite products, and view your cart.",
            icon: "⭐",
        },
        {
            question: "How can I become a member?",
            answer: "To become a member, click on the 'Sign Up' button in the top right corner. Fill out the form that appears on the login screen. You can complete your registration by entering your name, surname, phone number, and password.",
            icon: "📝",
        },
        {
            question: "I forgot my password, what should I do?",
            answer: "To reset your password, click on 'Forgot Password' on the login screen. Enter your email address, and once you receive a 6-digit code, enter it to reset your password.",
            icon: "🔑",
        },
        {
            question: "How can I update my delivery address?",
            answer: "After logging into your account, go to the 'Address' section in your profile page. You can edit your current address and save the new information there.",
            icon: "🏠",
        },
        {
            question: "How can I update my phone number?",
            answer: "Go to the 'My Profile' section and you will see your personal information, including your phone number. You can edit your phone number and save the changes.",
            icon: "📱",
        },
        {
            question: "Is my data secure?",
            answer: "Customer data is very important to us and is protected with the highest security measures. Credit card details, delivery addresses, and other personal data are stored using secure payment systems and encryption technologies. User security is prioritized in all transactions.",
            icon: "🔒",
        },
        {
            question: "Do you deliver to my home?",
            answer: "Yes, we deliver all our products right to your door. Our deliveries are made with care to ensure fresh and quality products.",
            icon: "🚚",
        },
        {
            question: "Are your products organic?",
            answer: "Yes, all of our products are produced using organic farming methods. No additives or pesticides are used in our agriculture.",
            icon: "🌱",
        },
        {
            question: "When are discounts available for your products?",
            answer: "Discounts are available on specific days for our products. You can follow these discounts and purchase products at a lower price.",
            icon: "🎉",
        },
        {
            question: "How can I place an order?",
            answer: "Add products to your cart and complete the payment process to quickly place your order. You can use secure payment options through our website.",
            icon: "🛒",
        },
        {
            question: "Can I return or exchange products?",
            answer: "Unfortunately, we do not currently accept returns or exchanges. However, if you have an issue with your product, you can contact us.",
            icon: "🚫",
        },
        {
            question: "What payment methods can I use?",
            answer: "Only credit card payments are accepted. Cash on delivery is not available.",
            icon: "💳",
        },
        {
            question: "How can I track my order?",
            answer: "Once your order is shipped, you can easily track your shipment through the application. You can check the status of your shipment in real-time.",
            icon: "📦",
        },
        {
            question: "How can I delete my membership?",
            answer: "To delete your account, go to the 'My Profile' section and click on 'Delete Account'. After entering your password again, your membership will be completely deleted.",
            icon: "😢",
        },
    ];

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-8 bg-gradient-to-b from-green-50 via-orange-50 to-white">
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 tracking-wider">
                    Frequently Asked Questions
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
