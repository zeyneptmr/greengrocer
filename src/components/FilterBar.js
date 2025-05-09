import { Grid3x3GapFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

const FilterBar = ({ columns, setColumns, setSortOption }) => {

    const { t } = useTranslation("filterbar");

    return (
        <div className="flex items-center justify-between border rounded-lg px-4 py-2 mb-4 flex-wrap">
            <div className="flex gap-2">
                <button
                    onClick={() => setColumns(3)}
                    className={`p-2 rounded ${columns === 3 ? "bg-green-600 text-white" : "bg-gray-200"}`}
                >
                    <Grid3x3GapFill size={20}/>
                </button>

                <button
                    onClick={() => setColumns(4)}
                    className={`p-2 rounded ${columns === 4 ? "bg-green-600 text-white" : "bg-gray-200"}`}
                >
                    <div className="w-6 h-6 grid grid-cols-4 gap-0.25">
                        {/* 4x4 grid */}
                        {[...Array(16)].map((_, index) => (
                            <div
                                key={index}
                                className={`w-1 h-1 ${columns === 4 ? "bg-white" : "bg-black"} rounded`} 
                            ></div>
                        ))}
                    </div>
                </button>
            </div>

            <div className="relative">
                <select onChange={(e) => setSortOption(e.target.value)}
                        className="border rounded-lg px-4 py-2 bg-white text-gray-600">
                    <option value="default">{t("sort")}</option>
                    <option value="price-asc">{t("lowToHigh")}</option>
                    <option value="price-desc">{t("highToLow")}</option>
                    <option value="name-asc">{t("aToZ")}</option>
                    <option value="name-desc">{t("zToA")}</option>
                </select>
            </div>
        </div>
    );
};

export default FilterBar;
