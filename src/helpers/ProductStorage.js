import React, { useEffect, useState } from 'react';
import UserSidebar from "../components/UserSidebar";
import managerIcon from "../assets/manager.svg";
import Sidebar from "../components/Sidebar";
import adminIcon from "../assets/admin.svg";
import AdminSearchBar from "../components/AdminSearchBar";
import ProductStorage from "../helpers/ProductStorage"; // Import ProductStorage
import DisplayProducts from "../components/DisplayProducts";

const InventoryPage = () => {

    // Fetch products from ProductStorage
    const getProductsFromStorage = () => {
        return ProductStorage.getProducts();
    };

    const [products, setProducts] = useState(getProductsFromStorage());
    const [filteredProducts, setFilteredProducts] = useState(products);

    // Update the product stock
    const updateProductStock = (productId, newStock) => {
        const updatedProduct = products.find(p => p.id === productId);
        if (updatedProduct) {
            updatedProduct.stock = newStock; // Assuming 'stock' is a property in your product
            ProductStorage.updateProduct(updatedProduct); // Update the product in storage
            setProducts(ProductStorage.getProducts()); // Update the state
        }
    };

    useEffect(() => {
        setProducts(ProductStorage.getProducts());
    }, []);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
                    <h1 className="text-2xl font-semibold text-gray-700">Product Inventory</h1>

                    <div className="flex items-center space-x-4">
                        <span className="text-gray-500">Manager Panel</span>
                        <img src={managerIcon} alt="Admin" className="rounded-full w-14 h-18"/>
                    </div>
                </header>

                {/* Admin Search Bar */}
                <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
                    <AdminSearchBar
                        products={products}
                        setFilteredProductsList={setFilteredProducts}
                    />
                </div>

                {/* Display Products */}
                <div className="p-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white p-4 mb-4 shadow-md rounded-md">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-gray-500">Category: {product.category}</p>
                            <p className="text-gray-500">Price: ${product.price}</p>
                            <div className="flex items-center mt-4">
                                <label className="mr-2 text-gray-600">Stock:</label>
                                <input
                                    type="number"
                                    value={product.stock || 0}
                                    onChange={(e) => updateProductStock(product.id, e.target.value)}
                                    className="border border-gray-300 p-2 rounded"
                                />
                            </div>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
};

export default InventoryPage;
