import React from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { User } from "../../interfaces/user";
import type { Project } from "../../interfaces/project";

type FormData = Omit<Project, "id">;

interface StepProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  isDragging?: boolean;
  setIsDragging?: React.Dispatch<React.SetStateAction<boolean>>;
  handleDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clients?: User[];
  isLoading?: boolean;
  formValues?: FormData;
  selectedClient?: User;
}

const Step3: React.FC<StepProps> = ({
  register,
  errors,
  clients,
  isLoading,
}) => {
  console.log("🚀 ~ Step3 ~ clients:", clients);
  return (
    <div className="w-full h-full">
      <div className="flex flex-row justify-between items-center mb-4 border-b-2 h-14">
        <h1 className="text-xl w-fit font-bold font-inter flex">Client</h1>
      </div>

      <div className="flex flex-col mb-4">
        <label htmlFor="individual_id" className="text-xl">
          Select client
        </label>
        <select
          id="individual_id"
          {...register("individual_id", { required: "Client is required" })}
          className="border rounded p-2 h-full"
        >
          <option value="">Select a client</option>
          {isLoading && <option disabled>Loading clients...</option>}
          {clients?.map((client: User) => (
            <option key={client.id} value={client.id}>
              {client.profile.firstName} {client.profile.lastName} (
              {client.email})
            </option>
          ))}
        </select>
        {errors.individual_id && (
          <span className="text-red-500 text-sm">
            {errors.individual_id.message}
          </span>
        )}
      </div>

      <div className="flex flex-col mb-4">
        <label htmlFor="address" className="text-xl">
          Address
        </label>
        <input
          type="text"
          id="address"
          {...register("address")}
          className="border rounded p-2"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col flex-1">
          <label htmlFor="postal_code" className="text-xl">
            Postal Code
          </label>
          <input
            type="text"
            id="postal_code"
            {...register("postal_code")}
            className="border rounded p-2"
          />
        </div>

        <div className="flex flex-col flex-1">
          <label htmlFor="city" className="text-xl">
            City
          </label>
          <input
            type="text"
            id="city"
            {...register("city")}
            className="border rounded p-2"
          />
        </div>
      </div>
    </div>
  );
};

export default Step3;
