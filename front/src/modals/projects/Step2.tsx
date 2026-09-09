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

const Step2: React.FC<StepProps> = ({ register, errors }) => {
  return (
    <div className="w-full h-full">
      <div className="flex flex-row justify-between items-center mb-4 md:mb-16 border-b-2 h-14 md:mx-6">
        <h1 className="text-xl w-fit font-bold font-inter flex">
          General informations
        </h1>
      </div>

      <div className="md:flex md:flex-row md:gap-8 md:m-6 md:mb-16">
        <div className="flex flex-col md:gap-2 md:w-1/3">
          <label htmlFor="number_Project" className="text-xl">
            Number Project
          </label>
          <input
            type="text"
            id="number_Project"
            {...register("number_Project")}
            className="border rounded p-2"
          />
        </div>

        <div className="flex flex-col md:gap-2 md:w-1/3">
          <label htmlFor="project_type" className="text-xl">
            Project Type
          </label>
          <input
            type="text"
            id="project_type"
            {...register("project_type")}
            className="border rounded p-2"
          />
        </div>

        <div className="flex flex-col md:gap-2 md:w-1/3">
          <label htmlFor="budget" className="text-xl">
            Budget
          </label>
          <input
            type="number"
            id="budget"
            {...register("budget", {
              required: "Budget is required",
              min: { value: 0, message: "Budget must be positive" },
            })}
            className="border rounded p-2"
          />
          {errors.budget && (
            <span className="text-red-500 text-sm">
              {errors.budget.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:m-6">
        <div className="flex flex-col flex-1">
          <label htmlFor="start_date" className="text-xl">
            Start Date
          </label>
          <input
            type="date"
            id="start_date"
            {...register("start_date")}
            className="border rounded p-2"
          />
        </div>

        <div className="flex flex-col flex-1">
          <label htmlFor="end_Date" className="text-xl">
            End Date
          </label>
          <input
            type="date"
            id="end_Date"
            {...register("end_Date")}
            className="border rounded p-2"
          />
        </div>
      </div>
    </div>
  );
};

export default Step2;
