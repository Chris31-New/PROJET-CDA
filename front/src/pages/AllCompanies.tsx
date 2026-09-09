import { useState } from "react";
import { HiSearch, HiFilter } from "react-icons/hi";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";
import {
    useGetCompany,
    useGetCompanyTypes,
} from "../hooks/use-company.service";
import CreateCompanyModal from "../modals/companies/CreateCompanyModal";
import { Link, Links } from "react-router-dom";

const AllCompanies = () => {
    const { data: companies = [], isLoading, isError } = useGetCompany();
    const { data: companyTypes = [] } = useGetCompanyTypes();

    const allTypes = ["all", ...companyTypes];

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredCompanies = companies.filter((company) => {
        const matchesSearch =
            company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType =
            selectedType === "all" || company.type === selectedType;
        return matchesSearch && matchesType;
    });

    if (isLoading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-10 h-10 border-4 border-[#FFCC00] border-t-transparent rounded-full animate-spin" />
            </div>
        );

    if (isError)
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500 font-semibold">
                Erreur lors du chargement des entreprises.
            </div>
        );

    return (
        <>
            <CreateCompanyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <div className="min-h-screen">
                {/* Header Section */}
                <div className="relative overflow-hidden border-b border-black border-t-black py-8 px-6 m-5">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto flex items-center justify-between">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-inter font-bold text-gray-900 mb-4 tracking-tight">
                                All the companies
                            </h1>
                            <p className="text-xl text-gray-800 font-medium max-w-2xl">
                                Discover all the {companies.length} companies in
                                our network.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-[#FFCC00] to-[#FFA500] text-gray-900 font-bold rounded-xl hover:shadow-lg transition-all text-sm md:text-base whitespace-nowrap"
                        >
                            <span className="text-lg">+</span>
                            <span className="hidden sm:inline">
                                Add company
                            </span>
                        </button>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="max-w-7xl mx-auto px-6 py-8 -mt-8 relative z-10">
                    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-amber-200/50">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search Bar */}
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/20 outline-none transition-all"
                                />
                            </div>

                            {/* Filter Button */}
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setIsFilterOpen(!isFilterOpen)
                                    }
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all font-semibold border-2 border-gray-200"
                                >
                                    <HiFilter size={20} />
                                    <span>Filtrer</span>
                                    <IoIosArrowDown
                                        className={`transform transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {/* Filter Dropdown */}
                                {isFilterOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-4 z-20">
                                        <h3 className="font-bold text-gray-900 mb-3">
                                            Type d'entreprise
                                        </h3>
                                        <div className="space-y-2">
                                            {allTypes.map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => {
                                                        setSelectedType(type);
                                                        setIsFilterOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                                                        selectedType === type
                                                            ? "bg-[#FFCC00] text-gray-900 font-semibold"
                                                            : "hover:bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    {type === "all"
                                                        ? "Tous les types"
                                                        : type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Active Filters */}
                        {selectedType !== "all" && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFCC00] text-gray-900 rounded-full font-semibold text-sm">
                                    {selectedType}
                                    <button
                                        onClick={() => setSelectedType("all")}
                                        className="hover:bg-[#FFA500] rounded-full p-1 transition-colors"
                                    >
                                        <IoIosClose size={18} />
                                    </button>
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                <div className="max-w-7xl mx-auto px-6 mt-6">
                    <p className="text-gray-600 font-medium">
                        {filteredCompanies.length} companies
                        {filteredCompanies.length !== 1 ? "s" : ""} found
                        {filteredCompanies.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {/* Companies Grid */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCompanies.map((company) => (
                            <div
                                key={company.id}
                                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#FFCC00]"
                            >
                                {/* Company Header */}
                                <div className="p-6 relative overflow-hidden">
                                    {company.image && (
                                        <img
                                            className="w-full h-40 object-cover rounded-2xl shadow-lg mb-4"
                                            src={company.image}
                                            alt={company.name}
                                        />
                                    )}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="relative flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center mb-4">
                                                <span className="text-2xl font-black text-[#FFA500]">
                                                    {company.name.charAt(0)}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-900 mb-1">
                                                {company.name}
                                            </h3>
                                            <span className="inline-block px-3 py-1 bg-white/80 text-gray-900 rounded-full text-sm font-bold">
                                                {company.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Body */}
                                <div className="p-6 space-y-4">
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {company.description}
                                    </p>

                                    {/* Specialties */}
                                    <div className="flex flex-wrap gap-2">
                                        {(company.specialities ?? []).map(
                                            (item, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-semibold border border-amber-200"
                                                >
                                                    {item.speciality.name}
                                                </span>
                                            ),
                                        )}
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-2 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <span className="text-sm">
                                                {company.address},{" "}
                                                {company.city}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <span className="text-sm font-medium">
                                                {company.phone}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <span className="text-sm">
                                                {company.email}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Employee Count */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <span className="text-xs text-gray-500 font-medium">
                                            👥 {company.employeeCount} employees
                                        </span>
                                    </div>

                                    {/* Action Button */}
                                    <Link
                                        to={`/companies/${company.id}`}
                                        className="w-full py-3 items-center justify-center flex gap-2 text-gray-600 hover:text-gray-900 font-semibold bg-gradient-to-r from-[#FFCC00] to-[#FFA500] text-gray-900 font-bold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                                    >
                                        View profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredCompanies.length === 0 && (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-4">
                                <HiSearch className="text-gray-400" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                No companies found
                            </h3>
                            <p className="text-gray-600">
                                Try modifying your search criteria
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedType("all");
                                }}
                                className="mt-6 px-6 py-3 bg-[#FFCC00] hover:bg-[#FFA500] text-gray-900 font-bold rounded-xl transition-colors"
                            >
                                Reset filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AllCompanies;
