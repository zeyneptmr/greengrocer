import { useState } from "react";
import { motion } from "framer-motion";
import aboutUsImage from '/Users/zeynep/greengrocer/src/assets/arugula.jpg'; // Görseli doğru yoldan import ettik

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
        {
            title: "Our Mission",
            text: "Our mission is to deliver the highest quality with a focus on trust, bringing fresh, organic products just a tap away.",
            color: "bg-green-700",
            icon: "🎯", // Örnek bir emoji ikonu
            background: "bg-gradient-to-r from-green-500 to-blue-500" // İkon ve arka plan rengiyle daha dikkat çekici
        },
        {
            title: "Our Products",
            text: "We offer a wide range of homemade, daily fresh, organic, and natural products, ensuring quality and freshness.",
            color: "bg-orange-600",
            icon: "🥕", // Sebze ikonu
            background: "bg-gradient-to-r from-orange-400 to-yellow-500" // Ürünleri vurgulayan renk geçişi
        },
        {
            title: "For Future",
            text: "We aim to support sustainable farming practices and innovate for a better future, helping farmers and the planet.",
            color: "bg-yellow-500",
            icon: "🌱", // Doğa ikonu
            background: "bg-gradient-to-r from-yellow-400 to-green-500" // Çevreyi temsil eden renk geçişi
        },
    ];


    return (
        <div
            className="flex flex-col items-center justify-start min-h-screen p-8 bg-gradient-to-b from-green-50 via-orange-50 to-white">

            {/* About Us Section */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 tracking-wider text-center">
                    About Us
                </h1>
                <div className="h-1 w-24 bg-orange-500 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Who We Are Section */}
            <div
                className="max-w-5xl bg-white border-l-8 border-green-700 shadow-xl rounded-2xl p-8 mb-16 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-green-800 mb-4">Who We Are</h2>
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        We are four entrepreneurial women who embarked on a journey with a dream to create a market that
                        emphasizes natural products, promotes healthy living, and blends traditional flavors with modern
                        touches.
                    </p>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        At TapTaze Market, our mission is to offer reliable, additive-free, and natural products to our
                        customers. By collaborating with local producers, we aim to contribute both to the environment
                        and to society.
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
                        className={`relative flex flex-col items-center justify-center w-48 h-48 text-white rounded-full cursor-pointer ${item.color}`} // Arka plan rengi burada düz renk olarak kullanılıyor
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
                        {/* İkonu aşağıya taşıdım */}
                        <div className="text-5xl mt-3">{item.icon}</div>
                    </motion.div>
                ))}
            </div>

            {/* Metinler, açılan baloncuğun altında */}
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
                                backgroundColor: "#F5F5DC", //creme background
                            }}
                        >
                            {item.text}
                        </motion.div>
                    )
                ))}
            </div>


            <div className="h-16"></div>


            {/* Başarılarımız Alanı */}
            <div className="max-w-6xl bg-white border-l-8 border-orange-500 shadow-xl rounded-2xl p-10 mb-20">
                <h2 className="text-3xl font-bold text-orange-600 mb-10 text-center">What Have We Achieved?</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-700 text-lg">

                    {/* Başarı 1 */}
                    <div className="flex flex-col items-center text-center p-4 bg-[#fefae0] rounded-xl shadow-md">
                        <div className="text-4xl mb-3">😊</div>
                        <h3 className="font-semibold text-xl mb-1">Over 10,000 Happy Customers</h3>
                        <p>Our dedication to quality and service has helped us earn the trust of thousands.</p>
                    </div>

                    {/* Başarı 2 */}
                    <div className="flex flex-col items-center text-center p-4 bg-[#fefae0] rounded-xl shadow-md">
                        <div className="text-4xl mb-3">🤝</div>
                        <h3 className="font-semibold text-xl mb-1">Partnership with 50+ Local Producers</h3>
                        <p>We support local farmers and artisans by creating a sustainable supply chain.</p>
                    </div>

                    {/* Başarı 3 */}
                    <div className="flex flex-col items-center text-center p-4 bg-[#fefae0] rounded-xl shadow-md">
                        <div className="text-4xl mb-3">🌍</div>
                        <h3 className="font-semibold text-xl mb-1">Zero-Waste Policy Implementation</h3>
                        <p>We've reduced plastic usage by 80% through eco-friendly packaging and recycling programs.</p>
                    </div>

                    {/* Başarı 4 */}
                    <div className="flex flex-col items-center text-center p-4 bg-[#fefae0] rounded-xl shadow-md">
                        <div className="text-4xl mb-3">🧘‍♀️</div>
                        <h3 className="font-semibold text-xl mb-1">Community Wellness Workshops</h3>
                        <p>We’ve organized 30+ workshops promoting healthy living and conscious nutrition.</p>
                    </div>

                    {/* Başarı 5 */}
                    <div className="flex flex-col items-center text-center p-4 bg-[#fefae0] rounded-xl shadow-md">
                        <div className="text-4xl mb-3">🥬</div>
                        <h3 className="font-semibold text-xl mb-1">100% Natural Product Line</h3>
                        <p>Every product on our shelves is free from additives, GMOs, and artificial preservatives.</p>
                    </div>

                    {/* Başarı 6 */}
                    <div className="flex flex-col items-center text-center p-4 bg-[#fefae0] rounded-xl shadow-md">
                        <div className="text-4xl mb-3">📈</div>
                        <h3 className="font-semibold text-xl mb-1">Growing Brand Recognition</h3>
                        <p>Our brand has been featured in 10+ local magazines and food blogs.</p>
                    </div>

                </div>
            </div>

            {/* Amaçlarımız (Our Purpose) */}
            <div className="max-w-6xl bg-white border-l-8 border-green-600 shadow-xl rounded-2xl p-10 mb-20">
                <h2 className="text-3xl font-bold text-green-700 mb-10 text-center">Our Purpose</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-700 text-lg">

                    <div className="flex flex-col items-center text-center p-4 bg-[#edf6f9] rounded-xl shadow-md">
                        <div className="text-4xl mb-3">💚</div>
                        <h3 className="font-semibold text-xl mb-1">Promoting Healthy Living</h3>
                        <p>We aim to inspire healthier lifestyles through organic and additive-free products.</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4 bg-[#edf6f9] rounded-xl shadow-md">
                        <div className="text-4xl mb-3">🌱</div>
                        <h3 className="font-semibold text-xl mb-1">Supporting Sustainable Agriculture</h3>
                        <p>We collaborate with farmers who use eco-friendly and ethical farming practices.</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4 bg-[#edf6f9] rounded-xl shadow-md">
                        <div className="text-4xl mb-3">🏡</div>
                        <h3 className="font-semibold text-xl mb-1">Strengthening Local Economy</h3>
                        <p>We invest in local producers and help them reach wider markets through our platform.</p>
                    </div>

                </div>
            </div>

            {/* Customer Testimonials */}
            <div className="max-w-6xl bg-white border-l-8 border-orange-500 shadow-xl rounded-2xl p-10 mb-20">
                <h2 className="text-3xl font-bold text-orange-600 mb-10 text-center">Customer Testimonials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-700 text-lg">
                    {/* Testimonial 1 */}
                    <div className="flex flex-col items-center text-center p-4 bg-[#fefae0] rounded-xl shadow-md">
                        <div className="text-4xl mb-3">💬</div>
                        <p>"The quality of products is unmatched. I'm so glad to be a loyal customer!"</p>
                        <p className="mt-2 font-semibold">– Emily R.</p>
                    </div>
                    {/* Testimonial 2 */}
                    <div className="flex flex-col items-center text-center p-4 bg-[#fefae0] rounded-xl shadow-md">
                        <div className="text-4xl mb-3">💬</div>
                        <p>"Great customer service and fresh, organic products every time!"</p>
                        <p className="mt-2 font-semibold">– Michael T.</p>
                    </div>
                    {/* Testimonial 3 */}
                    <div className="flex flex-col items-center text-center p-4 bg-[#fefae0] rounded-xl shadow-md">
                        <div className="text-4xl mb-3">💬</div>
                        <p>"Amazing variety of local products. Highly recommend this place!"</p>
                        <p className="mt-2 font-semibold">– Sarah W.</p>
                    </div>
                </div>
            </div>

            {/* Müşteri Memnuniyet Oranı */}
            <div className="flex flex-col items-center justify-center mb-20">
                <div className="text-3xl font-bold text-green-800 mb-4 text-center">Customer Satisfaction</div>

                {/* Memnuniyet Oranları */}
                <div className="flex justify-center gap-12 mb-6">

                    {/* 98% Memnuniyet Oranı */}
                    <div className="flex flex-col items-center">
                        <div
                            className="w-36 h-36 flex items-center justify-center rounded-full bg-gradient-to-tr from-green-500 to-orange-400 shadow-lg mb-4">
                            <div className="text-white text-4xl font-extrabold">98%</div>
                        </div>
                        <p className="text-gray-600 text-center max-w-xs">
                            We are proud to have achieved a <span className="font-semibold text-green-700">98% satisfaction rate</span> thanks
                            to our commitment to freshness, service, and community trust.
                        </p>
                    </div>

                    {/* 95% Memnuniyet Oranı */}
                    <div className="flex flex-col items-center">
                        <div
                            className="w-36 h-36 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 shadow-lg mb-4">
                            <div className="text-white text-4xl font-extrabold">95%</div>
                        </div>
                        <p className="text-gray-600 text-center max-w-xs">
                            Our <span className="font-semibold text-blue-700">95% customer loyalty rate</span> shows
                            that people love coming back for more.
                        </p>
                    </div>

                    {/* 92% Memnuniyet Oranı */}
                    <div className="flex flex-col items-center">
                        <div
                            className="w-36 h-36 flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-pink-400 shadow-lg mb-4">
                            <div className="text-white text-4xl font-extrabold">92%</div>
                        </div>
                        <p className="text-gray-600 text-center max-w-xs">
                            With a <span className="font-semibold text-purple-700">92% positive feedback</span>, our
                            customers continue to express satisfaction with the quality and service we provide.
                        </p>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default AboutUs;