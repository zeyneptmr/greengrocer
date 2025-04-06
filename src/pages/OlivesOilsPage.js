import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import SlideBar from "../components/SliderBar";
import olivesoils1 from '../assets/olivesoils1.jpg';
import olivesoils2 from '../assets/olivesoils2.jpg';

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

const OlivesOilsPage = () => {
    const [columns, setColumns] = useState(4);
    const [sortOption, setSortOption] = useState("default");
    const [olivesOils, setOlivesOils] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));

    const getImageFromPath = (path) => {
        if (!path) return null;

        if (path.startsWith("data:image")) {
            return path;
        }

        const filename = path.split('/').pop();
        const imagePath = Object.keys(images).find(key => key.includes(filename.split('.')[0]));

        if (!imagePath) {
            console.error(`Image not found: ${filename}`);
            return '/placeholder.png';
        }

        return images[filename] || '/placeholder.png';
    };

    useEffect(() => {
        const fetchOlivesOils = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8080/api/products');

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                const olivesOilsProducts = data.filter(product =>
                    product.category.toLowerCase() === "olivesoils"
                );

                setOlivesOils(olivesOilsProducts);
                setError(null);
            } catch (err) {
                setError('Failed to fetch products: ' + err.message);
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOlivesOils();
    }, []);

    useEffect(() => {
        if (olivesOils.length === 0) return;

        let sortedArray = [...olivesOils];

        if (sortOption === "price-asc") {
            sortedArray.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-desc") {
            sortedArray.sort((a, b) => b.price - a.price);
        } else if (sortOption === "name-asc") {
            sortedArray.sort((a, b) => a.productName.localeCompare(b.productName));
        } else if (sortOption === "name-desc") {
            sortedArray.sort((a, b) => b.productName.localeCompare(a.productName));
        }

        setOlivesOils(sortedArray);
    }, [sortOption]);

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = olivesOils.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(olivesOils.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const slideItems = [
        { image: olivesoils1, name: "olivesoils1" },
        { image: olivesoils2, name: "olivesoils2" },
    ];

    return (
        <div className="p-4 sm:p-6">
            <SlideBar items={slideItems} />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-orange-500 text-center mt-10 sm:mt-16 md:mt-20">
                Olives & Oils
            </h2>
            <FilterBar
                columns={columns}
                setColumns={setColumns}
                setSortOption={setSortOption}
            />

            {loading && <p className="text-center py-8">Loading products...</p>}
            {error && <p className="text-center text-red-500 py-8">{error}</p>}

            {!loading && !error && (
                <div>
                    <div className={`grid gap-4 
                        ${columns === 4 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"}
                        justify-items-center w-full`}>
                        {currentItems.length > 0 ? (
                            currentItems.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={{
                                        id: product.id,
                                        name: product.productName,
                                        price: formatPrice(product.price),
                                        image: getImageFromPath(product.imagePath),
                                        stock: product.stock,
                                        category: product.category
                                    }}
                                />
                            ))
                        ) : (
                            <p className="col-span-full text-center py-8">No olive oil products available</p>
                        )}
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex justify-center mt-8">
                        <button
                            className="px-4 py-2 mx-2 bg-gray-300 rounded"
                            onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : currentPage)}
                            disabled={currentPage === 1}
                        >
                            &lt; Previous
                        </button>
                        <span className="px-4 py-2">{currentPage} / {totalPages}</span>
                        <button
                            className="px-4 py-2 mx-2 bg-gray-300 rounded"
                            onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : currentPage)}
                            disabled={currentPage === totalPages}
                        >
                            Next &gt;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OlivesOilsPage;
