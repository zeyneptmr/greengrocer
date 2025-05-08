import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { LanguageContext } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";


const EditProductPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const { language } = useContext(LanguageContext);
    const { t } = useTranslation("editproduct"); // JSON namespace


    const importAll = (r) => {
        let images = {};
        r.keys().forEach((item) => {
          images[item.replace('./', '')] = r(item);
        });
        return images;
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null) return "";
        return parseFloat(price).toFixed(2);
    };

    const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));

    const getImageFromPath = (path) => {
        if (!path) return null;

        // Base64 kontrolü
        if (path.startsWith("data:image")) {
            return path;
        }

        const filename = path.split('/').pop();
        console.log("Filename extracted:", filename);

        const imagePath = Object.keys(images).find(key => key.includes(filename.split('.')[0]));

        if (!imagePath) {
            console.error(`Resim bulunamadı: ${filename}`);
            return '/placeholder.png';
        }

        console.log("Image path:", imagePath);
        return images[imagePath] || '/placeholder.png';
    };

    const [product, setProduct] = useState({
        productName: "",
        price: "",
        category: "",
        imagePath: "",
        stock: 0
    });

    const [categories, setCategories] = useState([]);

    const getTranslatedCategory = (category) => {
        const key = category.toLowerCase().replace(/\s+/g, "_");  // örn: Dairy Products -> dairy_products
        return t(`categories.${key}`, category); // Eğer çeviri bulunamazsa orijinal adı gösterir
    };

    useEffect(() => {
        fetchProduct();
        extractCategories();
    }, [id, language]);

   
    useEffect(() => {
        if (product.imagePath) {
            const imageUrl = getImageFromPath(product.imagePath);
            setPreviewImage(imageUrl);
        }
    }, [product.imagePath]);

    const extractCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/products');
            const uniqueCategories = [...new Set(response.data.map(product => product.category))];
            setCategories(uniqueCategories);
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError("Failed to load categories. Please try again later.");
        }
    };

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const productId = parseInt(id, 10);
            if (!isNaN(productId)) {
                const response = await axios.get(`http://localhost:8080/api/products/${productId}?language=${language}`);
                setProduct({
                    ...response.data,
                    productName: response.data.translatedName  // Burası önemli!
                });
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching product:", err);
            setError("Failed to load product. Please try again later.");
            setLoading(false);
        }
    };


    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            
            const newImagePath = `../assets/${file.name}`;
            setProduct({ ...product, imagePath: newImagePath });
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const productData = {
                ...product,
                translatedName: product.productName,  // yeni çeviri
                language: language                      // şu anki dil
            };

            // Ürünü güncelle
            await axios.put(`http://localhost:8080/api/products/${product.id}`, productData);

            alert(t("updateSuccess"));
            navigate("/admin/updateproducts");
        } catch (err) {
            console.error("Error updating product:", err);
            alert(t("updateError"));
        }
    };


    if (loading) return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-700">{t("loading")}</div>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex items-center justify-center">
                <div className="text-xl font-semibold text-red-600">{error}</div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Content */}
            <div className="flex-1 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">{t("updateProductTitle")}</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Product Name */}
                        <div>
                            <label className="block text-gray-600 text-sm font-medium">{t("productName")}</label>
                            <input
                                type="text"
                                name="productName"
                                value={product.productName}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                                required
                            />
                        </div>

                        {/* Price Input */}
                        <div>
                            <label className="block text-gray-600 text-sm font-medium">{t("price")}</label>
                            <input
                                type="number"
                                name="price"
                                value={formatPrice(product.price)}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                                required
                            />
                        </div>

                        {/* Category Selection */}
                        <div>
                            <label className="block text-gray-600 text-sm font-medium">{t("category")}</label>
                            <select
                                name="category"
                                value={product.category}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                                required
                            >
                                <option value="" disabled>{t("selectCategory")}</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>
                                        {getTranslatedCategory(cat)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-gray-600 text-sm font-medium mb-1">{t("productImage")}</label>

                            <div
                                className="relative border border-gray-300 rounded-md p-2 flex items-center justify-between">
                                    <span className="text-gray-700">
                                        {selectedFile ? selectedFile.name : t("noFileChosen")}
                                    </span>
                                    <label
                                        className="bg-green-500 text-white px-4 py-1.5 rounded-md cursor-pointer hover:bg-green-600 ml-4">
                                        {t("chooseFile")}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                            </div>
                        </div>


                        {/* Image Preview */}
                        {previewImage && (
                            <div className="flex justify-center">
                                <img
                                    src={previewImage}
                                    alt="Product Preview"
                                    className="w-40 h-40 object-cover rounded-lg shadow-md"
                                />
                            </div>
                        )}

                        {/* Update Button */}
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
                        >
                            {t("update_button")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProductPage;