import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductStorage from "../helpers/ProductStorage";
import Sidebar from "../components/Sidebar"; 

const EditProductPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        price: "",
        category: "",
        image: "",
    });

    const [categories, setCategories] = useState([]); 

    useEffect(() => {
     
        setCategories(ProductStorage.getCategories());

     
        const productId = parseInt(id, 10);
        if (!isNaN(productId)) {
            const allProducts = ProductStorage.getProducts();
            const foundProduct = allProducts.find((p) => p.id === productId);
            if (foundProduct) {
                setProduct(foundProduct);
            }
        }
    }, [id]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProduct({ ...product, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        ProductStorage.updateProduct(product);
        alert("Product updated successfully!");
        navigate("/admin/updateproducts");
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Content */}
            <div className="flex-1 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Update Product</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Product Name */}
                        <div>
                            <label className="block text-gray-600 text-sm font-medium">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                            />
                        </div>

                        {/* Price Input */}
                        <div>
                            <label className="block text-gray-600 text-sm font-medium">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                min="0"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                            />
                        </div>

                        {/* Category Selection */}
                        <div>
                            <label className="block text-gray-600 text-sm font-medium">Category</label>
                            <select
                                name="category"
                                value={product.category}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                            >
                                <option value="" disabled>Select Category</option> 
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-gray-600 text-sm font-medium">Product Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                            />
                        </div>

                        {/* Image Preview */}
                        {product.image && (
                            <div className="flex justify-center">
                                <img
                                    src={product.image}
                                    alt="Product"
                                    className="w-40 h-40 object-cover rounded-lg shadow-md"
                                />
                            </div>
                        )}

                        {/* Update Button */}
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
                        >
                            Update
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProductPage;
