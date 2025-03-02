import { useCart } from "./CartContext";

export default function Cart() {
    const { cart, increaseQuantity, decreaseQuantity } = useCart();

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">My Cart</h2>

            {cart.length === 0 ? (
                <p>Cart is Empty.</p>
            ) : (
                <ul className="space-y-4">
                    {cart.map((item) => (
                        <li key={item.id} className="flex justify-between items-center border p-3 rounded-md">
                            <div>
                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                <p className="text-gray-600">{item.price} TL</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => decreaseQuantity(item.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md">
                                    -
                                </button>
                                <span className="text-lg font-semibold">{item.quantity}</span>
                                <button
                                    onClick={() => increaseQuantity(item.id)}
                                    className="bg-green-500 text-white px-3 py-1 rounded-md">
                                    +
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
