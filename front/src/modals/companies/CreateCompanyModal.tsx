import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useGetSpecialities } from '../../hooks/use-speciality.service';
import { useCreateCompany } from '../../hooks/use-company.service';
import type { CreateCompanyPayload } from '../../interfaces/company';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCompanyModal = ({ isOpen, onClose }: Props) => {
  const { mutate: createCompany, isPending } = useCreateCompany();
  const { data: specialities = [] } = useGetSpecialities();
  const [specialitiesId, setSpecialitiesId] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCompanyPayload>();

  const handleSpecialityToggle = (id: number) => {
    setSpecialitiesId((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const onSubmit = (data: CreateCompanyPayload) => {
    createCompany(
      { ...data, specialitiesId },
      {
        onSuccess: () => {
          reset();
          setSpecialitiesId([]);
          onClose();
        },
      }
    );
  };

  if (!isOpen) return null;

  const fields: { label: string; name: keyof CreateCompanyPayload; type: string }[] = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Description', name: 'description', type: 'text' },
    { label: 'SIREN', name: 'siren', type: 'text' },
    { label: 'Address', name: 'address', type: 'text' },
    { label: 'City', name: 'city', type: 'text' },
    { label: 'Phone', name: 'phone', type: 'tel' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Logo URL', name: 'logo', type: 'url' },
    { label: 'Image URL', name: 'image', type: 'url' },
    { label: 'Employee Count', name: 'employeeCount', type: 'text' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Create company</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {fields.map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {label}
              </label>
              <input
                type={type}
                {...register(name, { required: `${label} is required` })}
                className={`w-full px-4 py-2 border-2 rounded-xl focus:border-[#FFCC00] outline-none transition-all ${
                  errors[name] ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
              )}
            </div>
          ))}

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
            <select
              {...register('type', { required: 'Type is required' })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#FFCC00] outline-none"
            >
              <option value="COMPANY">COMPANY</option>
              <option value="ARTISAN">ARTISAN</option>
              <option value="SUBCONTRACTOR">SUBCONTRACTOR</option>
            </select>
          </div>

          {/* Specialités */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Specialities
            </label>
            <div className="flex flex-wrap gap-2">
              {specialities.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSpecialityToggle(s.id)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold border transition-all ${
                    specialitiesId.includes(s.id)
                      ? 'bg-[#FFCC00] border-[#FFCC00] text-gray-900'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                reset();
                setSpecialitiesId([]);
                onClose();
              }}
              className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 bg-gradient-to-r from-[#FFCC00] to-[#FFA500] text-gray-900 font-bold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {isPending ? 'Creating...' : 'Create'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateCompanyModal;