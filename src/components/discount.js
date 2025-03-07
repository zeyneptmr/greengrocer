import { allproducts } from "../data/products";
import ProductStorage from '../helpers/ProductStorage';

export const getDiscountedProducts = () => {
    const storedDate = localStorage.getItem("discountDate");
    const today = new Date().toDateString();

    // Eğer indirimli ürünler ve tarih zaten varsa, onları kullan
    if (storedDate === today) {
        const storedProducts = JSON.parse(localStorage.getItem("discountedProducts"));
        if (storedProducts) return storedProducts;
    }

    // Eğer ürünler daha önce localStorage'a kaydedilmediyse, kaydediyoruz
    ProductStorage.initializeProducts();

    // Ürünleri karıştırıyoruz ve ilk 10'u seçiyoruz
    const shuffled = ProductStorage.getProducts().sort(() => Math.random() - 0.5);
    const selectedProducts = shuffled.slice(0, 10).map(product => ({
        ...product,
        discountedPrice: (product.price * 0.85).toFixed(2) // %15 indirimli fiyat
    }));

    // İndirimli ürünleri ve tarih bilgisini localStorage'a kaydediyoruz
    localStorage.setItem("discountedProducts", JSON.stringify(selectedProducts));
    localStorage.setItem("discountDate", today);

    return selectedProducts;
};
