const ProductCard = ({ product }) => {
    return (
        <div className="border rounded-lg p-4 shadow-lg">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded" />
            <h3 className="font-bold mt-2">{product.name}</h3>
            <p className="text-green-600 font-semibold">{product.price} TL</p>
            <button className="bg-orange-500 text-white p-2 rounded mt-2 w-full">
                Sepete Ekle
            </button>
        </div>
    );
};

export default ProductCard;
