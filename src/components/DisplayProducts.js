import React from "react";

const DisplayProducts = ({ products }) => {
    // Group products by category
    const categories = [...new Set(products.map(product => product.category))];

    return (
        <div className="p-6">
            {categories.map(category => (
                <div key={category} className="mb-10">
                    <h2 className="text-2xl font-bold text-green-700 mb-4 capitalize">{category}</h2>
                    
                    <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-200 p-2">
                        {products
                            .filter(product => product.category === category)
                            .map(product => (
                                <div key={product.id} className="min-w-[200px] bg-white shadow-lg rounded-lg p-4">
                                    <img src={product.image} alt={product.name} className="w-40 h-40 object-contain mx-auto" />
                                    <h3 className="text-lg font-semibold text-gray-800 mt-2">{product.name}</h3>
                                    <p className="text-gray-600 text-md">{product.price} TL</p>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DisplayProducts;
