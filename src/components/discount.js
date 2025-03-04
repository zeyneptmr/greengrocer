import { allproducts } from "../data/products";  // 'allproducts' olarak import et


// Günlük rastgele 10 ürün belirleme fonksiyonu
export const getDiscountedProducts = () => {
    const storedDate = localStorage.getItem("discountDate");
    const today = new Date().toDateString();

    if (storedDate === today) {
        const storedProducts = JSON.parse(localStorage.getItem("discountedProducts"));
        if (storedProducts) return storedProducts;
    }

    // Eğer yeni bir günse, yeni ürünleri belirle
    const shuffled = allproducts.sort(() => Math.random() - 0.5);
    const selectedProducts = shuffled.slice(0, 10).map(product => ({
        ...product,
        discountedPrice: (product.price * 0.75).toFixed(2) // %25 indirimli fiyat
    }));

    localStorage.setItem("discountedProducts", JSON.stringify(selectedProducts));
    localStorage.setItem("discountDate", today);

    return selectedProducts;
};
