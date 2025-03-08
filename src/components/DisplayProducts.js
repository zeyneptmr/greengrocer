import React from "react";

const DisplayProducts = ({ products }) => {
   
    const getCategoryKey = (category) => category.toLowerCase();

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
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-40 h-40 object-contain mx-auto" 
                                    />
                                    <h3 className="text-lg font-semibold text-gray-800 mt-2">{product.name}</h3>
                                    <p className="text-gray-600 text-md">{product.price} TL</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
            
            {/* Show message if no products */}
            {products.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">No products found matching your search criteria</p>
                </div>
            )}
        </div>
    );
};

export default DisplayProducts;