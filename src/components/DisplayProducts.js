import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";
import { getImageFromPath } from "../helpers/imageHelper";

const DisplayProducts = ({ products }) => {

    const { language } = useContext(LanguageContext);
    const { t } = useTranslation("displayproducts");

    const importAll = (r) => {
        let images = {};
        r.keys().forEach((item) => {
          images[item.replace('./', '')] = r(item);
        });
        return images;
    };

    const formatPrice = (price) => {
        if (typeof price === "number") {
            return price.toFixed(2); 
        }
        return parseFloat(price).toFixed(2); 
    };

    const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));


    const getTranslatedCategory = (category) => {
        const key = category.toLowerCase().replace(/\s+/g, '');
        return t(`categories.${key}`, category);  // Çeviri yoksa orijinali kullan
    };
    // Helper function to get category key
    const getCategoryKey = (category) => category.toLowerCase();
    
    // Get unique categories
    const uniqueCategories = [];
    const categoryMap = new Map();
    
    products.forEach(product => {
        const lowerCaseCategory = getCategoryKey(product.category);
        if (!categoryMap.has(lowerCaseCategory)) {
            categoryMap.set(lowerCaseCategory, product.category);
            uniqueCategories.push(product.category);
        }
    });
    
    return (
        <div className="p-6">
            {uniqueCategories.map(category => {
                // Filter products by category
                const categoryProducts = products.filter(
                    product => getCategoryKey(product.category) === getCategoryKey(category)
                );
                
                return (
                    <div key={getCategoryKey(category)} className="mb-10">
                        <h2 className="text-2xl font-bold text-green-700 mb-4 capitalize text-left">{getTranslatedCategory(category)}</h2>
                        
                        <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-200 p-2">
                            {categoryProducts.map(product => (
                                <div
                                    key={product.id}
                                    id={`product-${product.id}`}
                                    className="min-w-[200px] bg-white shadow-lg rounded-lg p-4 transition-all duration-300"
                                >
                                    <img
                                        src={getImageFromPath(product.imagePath, images)}
                                        alt={product.translatedName}
                                        className="w-40 h-40 object-contain mx-auto"
                                    />
                                    <h3 className="text-lg font-semibold text-gray-800 mt-2">{product.translatedName}</h3>
                                    <p className="text-gray-600 text-md">{formatPrice(product.price)} TL</p>
                                    <p className="text-gray-500 text-sm">{t("stock")}: {product.stock}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DisplayProducts;