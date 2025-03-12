import React, { useState } from "react";
import { MagnifyingGlassIcon, PencilIcon } from "@heroicons/react/24/outline";
import SearchModal from "./SearchModal";

import fetchData from "../utils/fetchData";
import { useNavigate } from "react-router-dom";

const ShowFines = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  // const [isSearchModalForFormOpen, setIsSearchModalForFormOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const isUser = localStorage.getItem("role") === "user";
  const navigate = useNavigate(); 

  const handleSearch = (formData) => {
    setSearchResults(formData);
  };

  const formatArabicDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-EG");
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
      {/* Buttons for both functionalities */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-center mb-8">
        <button
          className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                    text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all
                    flex items-center gap-3 transform hover:scale-105"
          onClick={() => setIsSearchModalOpen(true)}
        >
          <MagnifyingGlassIcon className="h-6 w-6 text-white/90 group-hover:text-white" />
          <span className="text-md font-semibold">البحث عن غرامة</span>
        </button>
        {isUser && 
        <button
          className="group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 
                    text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all
                    flex items-center gap-3 transform hover:scale-105"
          onClick={() => navigate("/fines/create")} 
        >
          <PencilIcon className="h-6 w-6 text-white/90 group-hover:text-white" />
          <span className="text-md font-semibold">تسجيل غرامة</span>
        </button>
        }
      </div>

      {/* Modal for searching and printing forms */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleSearch}
      />

      {/* {isUser && (
        <SearchModalForForm
          isOpen={isSearchModalForFormOpen}
          onClose={() => setIsSearchModalForFormOpen(false)}
          onSearch={handleSearch}
        />
      )} */}

      {/* Display the search results */}
      {searchResults && (
        <div className="space-y-8" dir="rtl">
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 shadow-lg">
            <h2 className="text-md font-bold text-gray-800 mb-6 border-b-2 border-blue-200 pb-4">
              تفاصيل الغرامة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries({
                "رقم قرار الحكم": searchResults.rulingDecisionNum,
                "تاريخ الإصدار": formatArabicDate(searchResults.dateOfOffence),
              }).map(([label, value]) => (
                <div key={label} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
                  <span className="block text-sm font-medium text-gray-500 mb-1">{label}</span>
                  <span className="block text-md font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchResults.vehicleImagePath && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">صورة المركبة</h3>
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={`http://localhost:5075${searchResults.vehicleImagePath}`}
                    alt="Car"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowFines;