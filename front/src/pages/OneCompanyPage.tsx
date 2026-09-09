import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiLocationMarker, HiPhone, HiMail, HiArrowLeft } from 'react-icons/hi';
import { useGetCompanyId } from '../hooks/use-company.service';

const OneCompanyPage = () => {
  const { id } = useParams<{ id: string }>();;
  const { data: company, isLoading, isError } = useGetCompanyId(id!);

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-10 h-10 border-4 border-[#FFCC00] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isError || !company) return (
    <div className="flex justify-center items-center min-h-screen text-red-500 font-semibold">
      Error during fetching company data. Please try again later.
    </div>
  );

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <div className="relative overflow-hidden border-b border-black py-8 px-6 m-5 bg-white rounded-2xl shadow-md">
        <div className="relative max-w-7xl mx-auto">

          {/* Back button */}
          <Link
            to="/all-companies"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-6 transition-colors"
          >
            <HiArrowLeft size={40} className=" py-2 bg-gradient-to-r from-[#FFCC00] to-[#FFA500] text-gray-900 font-bold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-lg"  />
            Back
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            <div className="w-24 h-24 bg-amber-50 rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0 border-2 border-amber-200">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="text-4xl font-black text-[#FFA500]">
                  {company.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-gray-900">{company.name}</h1>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-bold">
                  {company.type}
                </span>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl">{company.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left column */}
        <div className=" bg-white md:col-span-2 space-y-6">

          {/* Image */}
          {company.image && (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-gray-100">
              <img
                src={company.image}
                alt={company.name}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Specialities */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-4">Specialities</h2>
            <div className="flex flex-wrap gap-2">
              {(company.specialities ?? []).map((item, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-amber-50 text-amber-800 rounded-xl text-sm font-semibold border border-amber-200"
                >
                  {item.speciality.name}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-4">Contact</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-600">
                <HiLocationMarker className="text-[#FFA500] flex-shrink-0 mt-1" size={20} />
                <span className="text-sm">{company.address}, {company.city}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <HiPhone className="text-[#FFA500] flex-shrink-0" size={20} />
                <span className="text-sm font-medium">{company.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <HiMail className="text-[#FFA500] flex-shrink-0" size={20} />
                <span className="text-sm">{company.email}</span>
              </div>
            </div>
          </div>

          {/* Infos */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-4">Informations</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500 font-medium">SIREN</span>
                <span className="text-sm font-bold text-gray-900">{company.siren}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500 font-medium">Employees</span>
                <span className="text-sm font-bold text-gray-900">👥 {company.employeeCount}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500 font-medium">Type</span>
                <span className="text-sm font-bold text-gray-900">{company.type}</span>
              </div>
            </div>
          </div>

          {/* CTA
          <button className="w-full py-4 bg-gradient-to-r from-[#FFCC00] to-[#FFA500] text-gray-900 font-bold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-lg">
            Contact Company
          </button> */}

        </div>
      </div>
    </div>
  );
};

export default OneCompanyPage;