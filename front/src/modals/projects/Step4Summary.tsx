import React from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { User } from "../../interfaces/user";
import type { Project } from "../../interfaces/project";
import { noImage } from "../../utils/images";

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
  formValues: FormData;
  selectedClient?: User;
}

const Step4Summary: React.FC<StepProps> = ({ formValues, selectedClient }) => {
  const image = noImage;
  return (
    <div className="flex flex-col gap-4 h-full pr-2 w-full overflow-auto">
      <div className="flex flex-row justify-between items-center mb-4 border-b-2 h-14">
        <h1 className="text-xl w-fit font-bold font-inter flex">
          Project summary
        </h1>
      </div>

      {formValues.image && (
        <div className="flex justify-center">
          <img
            src={formValues.image}
            alt="Project preview"
            className="max-h-48 rounded-lg object-cover"
          />
        </div>
      )}
      {!formValues.image && (
        <div className="flex justify-center">
          <img
            src={image}
            alt="Project preview"
            className="max-h-48 rounded-lg object-cover"
          />
        </div>
      )}

      <div className="grid-cols-2 flex flex-row gap-2">
        <p className="font-semibold text-gray-700">Title:</p>
        <p className="text-gray-900">{formValues.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:w-full">
        <div>
          <p className="font-semibold text-gray-700">Status:</p>
          <p className="text-gray-900 capitalize">
            {formValues.status.replace("_", " ")}
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Budget:</p>
          <p className="text-gray-900">{formValues.budget}€</p>
        </div>

        <div className="col-span-2">
          <p className="font-semibold text-gray-700 underline">Description:</p>
          <p className="text-gray-900 h-30 overflow-y-auto">
            {formValues.description}
          </p>
        </div>

        <div className="flex flex-row col-span-2 justify-between items-center mb-4 border-b-1 h-14">
          <h1 className="text-lg w-fit font-bold font-inter flex">
            General Informations
          </h1>
        </div>

        {formValues.project_type && (
          <>
            <div>
              <p className="font-semibold text-gray-700">Project Reference:</p>
              <p className="text-gray-900">{formValues.number_Project}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Project Type:</p>
              <p className="text-gray-900">{formValues.project_type}</p>
            </div>
          </>
        )}

        <div>
          <p className="font-semibold text-gray-700">Start Date:</p>
          <p className="text-gray-900">
            {formValues.start_date
              ? new Date(formValues.start_date).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">End Date:</p>
          <p className="text-gray-900">
            {formValues.end_Date
              ? new Date(formValues.end_Date).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="flex flex-row col-span-2 justify-between items-center mb-4 border-b-1 h-14 md:w-full">
            <h1 className="text-lg w-fit font-bold font-inter flex">Client</h1>
          </div>

          <div className="md:flex md:flex-row md:gap-2 md:w-full">
            {formValues.individual_id && selectedClient && (
              <div className="col-span-2 md:w-1/2 md:gap-2">
                <p className="font-semibold text-gray-700">Client:</p>
                <p className="text-gray-900">
                  {selectedClient.profile.firstName}{" "}
                  {selectedClient.profile.lastName}
                </p>
                <p className="text-gray-500 text-sm">{selectedClient.email}</p>
              </div>
            )}
            {formValues.address && (
              <div className="col-span-2 md:w-1/2 md:gap-2">
                <p className="font-semibold text-gray-700">Address:</p>
                <p className="text-gray-900 flex flex-col">
                  {formValues.address},
                  <span className="flex">
                    {formValues.postal_code} {formValues.city}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4Summary;
