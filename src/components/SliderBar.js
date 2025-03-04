import { useState, useEffect } from "react";

const SlideBar = ({ items }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % items.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [items.length]);

    const handleLeftClick = () => {
        setCurrentSlide((prevSlide) => (prevSlide === 0 ? items.length - 1 : prevSlide - 1));
    };

    const handleRightClick = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % items.length);
    };

    return (
        <div className="relative mt-6 mb-4">
            <div className="absolute top-0 bottom-0 left-0 flex items-center justify-center z-10">
                <button onClick={handleLeftClick} className="text-white bg-black bg-opacity-50 p-2 rounded-full">
                    ←
                </button>
            </div>
            <div className="flex justify-center items-center">
                <img
                    src={items[currentSlide].image}
                    alt={items[currentSlide].name}
                    className="w-full h-[450px] object-cover"                />
            </div>
            <div className="absolute top-0 bottom-0 right-0 flex items-center justify-center z-10">
                <button onClick={handleRightClick} className="text-white bg-black bg-opacity-50 p-2 rounded-full">
                    →
                </button>
            </div>
        </div>
    );
};

export default SlideBar;
