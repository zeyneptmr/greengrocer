import React from "react";


const DisplayProducts = ({ products }) => {

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


    const getImageFromPath = (path) => {
        if (!path) return null;

        if (path.startsWith("data:image")) {
            return path;  // Doğrudan Base64 resmini döndür
        }

        const filename = path.split('/').pop();
        console.log("Filename extracted:", filename);

        const imagePath = Object.keys(images).find(key => key.includes(filename.split('.')[0]));  // Dosya adıyla eşleşen anahtar

        if (!imagePath) {
            console.error(`Resim bulunamadı: ${filename}`);
            return '/placeholder.png';  // Placeholder resim
        }

        console.log("Image path:", imagePath); // Bu noktada imagePath doğru olmalı
        return images[imagePath] || '/placeholder.png';
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
                        <h2 className="text-2xl font-bold text-green-700 mb-4 capitalize text-left">{category}</h2>
                        
                        <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-200 p-2">
                            {categoryProducts.map(product => (
                                <div
                                    key={product.id}
                                    id={`product-${product.id}`}
                                    className="min-w-[200px] bg-white shadow-lg rounded-lg p-4 transition-all duration-300"
                                >
                                    <img
                                        src={getImageFromPath(product.imagePath)}
                                        alt={product.productName}
                                        className="w-40 h-40 object-contain mx-auto"
                                    />
                                    <h3 className="text-lg font-semibold text-gray-800 mt-2">{product.productName}</h3>
                                    <p className="text-gray-600 text-md">{formatPrice(product.price)} TL</p>
                                    <p className="text-gray-500 text-sm">Stock: {product.stock}</p>
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