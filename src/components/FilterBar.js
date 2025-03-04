import { useState } from "react";
import { Grid3x3GapFill, GridFill } from "react-bootstrap-icons";

const FilterBar = ({ columns, setColumns, setSortOption }) => {
    const [selected, setSelected] = useState(false);

    const toggleSelection = () => {
        setSelected(!selected);
    };

    return (
        <div className="flex items-center justify-between border rounded-lg px-4 py-2 mb-4">
            <div className="flex gap-2">
                <button
                    onClick={() => setColumns(3)}
                    className={`p-2 rounded ${columns === 3 ? "bg-green-600 text-white" : "bg-gray-200"}`}
                >
                    <Grid3x3GapFill size={20} />
                </button>

                <button
                    onClick={() => setColumns(4)}
                    className={`p-2 rounded ${columns === 4 ? "bg-green-600 text-white" : "bg-gray-200"}`}
                >
                    <div className="w-6 h-6 grid grid-cols-4 gap-0.25">
                        {/* 4x4 grid için */}
                        {[...Array(16)].map((_, index) => (
                            <div
                                key={index}
                                className={`w-1 h-1 ${columns === 4 ? "bg-white" : "bg-black"} rounded`} // 4x4 ise beyaz, 3x3 ise siyah
                            ></div>
                        ))}
                    </div>
                </button>
            </div>

            <div className="relative">
                <select onChange={(e) => setSortOption(e.target.value)}
                        className="border rounded-lg px-4 py-2 bg-white text-gray-600">
                    <option value="default">Sort</option>
                    <option value="price-asc">Low to High</option>
                    <option value="price-desc">High to Low</option>
                    <option value="name-asc">A to Z</option>
                    <option value="name-desc">Z to A</option>
                </select>
            </div>
        </div>
    );
};

export default FilterBar;
