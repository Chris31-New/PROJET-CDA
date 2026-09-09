import React from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { Project } from "../../interfaces/project";
import type { User } from "../../interfaces/user";

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

const Step1: React.FC<StepProps> = ({
  register,
  errors,
  watch,
  setValue,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileInput,
}) => {
  const imageValue = watch("image");

  return (
    <div className="w-full h-full">
      <div className="md:flex md:flex-row md:gap-8 md:mb-16">
        <div className="flex flex-col md:gap-2 md:w-1/2">
          <label htmlFor="name" className="text-xl">
            Title Project
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Title is required" })}
            className="border rounded p-2"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col md:gap-2 md:w-1/2">
          <label htmlFor="status" className="text-xl">
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="border rounded p-2"
          >
            <option value="PLANNED">Planned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="md:w-full md:flex md:flex-row md:gap-8">
        <div className="flex flex-col md:gap-2 md:w-1/2 h-full">
          <label htmlFor="image" className="text-xl mb-2">
            Image
          </label>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-all duration-200
              ${isDragging ? "border-amber-400 bg-amber-50" : "border-gray-300 hover:border-amber-400"}
            `}
          >
            {imageValue ? (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={imageValue}
                  alt="Preview"
                  className="max-h-48 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => setValue("image", "")}
                  className="text-red-500 hover:text-red-700 underline"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-600">
                  Drag and drop an image here, or click to select
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="mt-2 px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-amber-500 cursor-pointer transition-colors"
                >
                  Choose File
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:gap-2 md:w-1/2 md:h-fit">
          <label htmlFor="description" className="text-xl">
            Description
          </label>
          <textarea
            id="description"
            {...register("description", {
              required: "Description is required",
            })}
            className="border rounded p-2 h-full"
          />
          {errors.description && (
            <span className="text-red-500 text-sm">
              {errors.description.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step1;
