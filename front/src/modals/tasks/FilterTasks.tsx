import { useState } from "react";
import { IoIosClose } from "react-icons/io";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (status: string[]) => void;
    selectedFilter: string[]; 
}

const FilterTasks = ({ isOpen, onClose, onSubmit, selectedFilter }: ModalProps) => {
    if (!isOpen) return null;

    const [localFilter, setLocalFilter] = useState<string[]>(selectedFilter);

    const filters = ["to-do", "in-progress", "blocked", "done"];

    const applyFilters = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(localFilter);
        onClose(); 
    };

    const resetFilters = () => {
        setLocalFilter([]);
        onSubmit([]);
    };

    return (
        <div className="modal">
            <div className="modal-overlay" onClick={onClose} />
            <div className="modal-content min-w-50 max-w-100">
                <IoIosClose
                    className="hover:cursor-pointer absolute top-0 left-0"
                    onClick={onClose}
                    size={50}
                />
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl w-40/100 text-center font-medium font-inter mt-10 border-b-5 border-b-[#FDC700]">Filter</h1>
                    <form className="w-full flex flex-col items-center" onSubmit={applyFilters}>
                        <div className="flex flex-col gap-5 mb-2 mt-2">
                            {filters.map(filter => (
                                <label className="flex items-center gap-2 cursor-pointer" key={filter}>
                                    <input
                                        type="checkbox"
                                        name="status"
                                        value={filter}
                                        className="peer hidden"
                                        checked={localFilter.includes(filter)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setLocalFilter([...localFilter, filter]);
                                            } else {
                                                setLocalFilter(localFilter.filter(status => status !== filter));
                                            }
                                        }}
                                    />
                                    <span className="w-8 h-8 border-2 border-gray-600 rounded
                                             flex items-center justify-center
                                             peer-checked:bg-gray-600 peer-checked:border-black
                                             transition">
                                        <span className="w-2 h-3 border-white border-r-2 border-b-2 rotate-45 scale-0
                                               peer-checked:scale-100 transition"></span>
                                    </span>
                                    <span>
                                        {filter.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <div className="flex flex-row justify-between w-full">
                            <button
                                type="button"
                                className="text-xl font-medium font-inter w-30 p-2 bg-[#FFCC00] rounded-xl"
                                onClick={resetFilters}
                            >
                                Reset Filter
                            </button>
                            <button type="submit" className="text-xl font-medium font-inter w-30 p-2 bg-[#FFCC00] rounded-xl">
                                Filter
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FilterTasks;
