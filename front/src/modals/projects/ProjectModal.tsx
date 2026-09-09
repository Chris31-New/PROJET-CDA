import { IoIosClose } from "react-icons/io";
import type { Project } from "../../interfaces/project";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetClients } from "../../hooks/use-user.service";
import type { User } from "../../interfaces/user";
import {
  useCreateProject,
  useUpdateProject,
} from "../../hooks/use-project.service";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4Summary from "./Step4Summary";
import { noImage } from "../../utils/images";

interface ModalProps {
  projectInfos?: Project;
  isOpen: boolean;
  onClose: () => void;
}

type FormData = Omit<Project, "id">;

const EMPTY_FORM: FormData = {
  number_Project: "",
  name: "",
  description: "",
  image: "",
  start_date: "",
  end_Date: "",
  budget: 0,
  individual_id: "",
  site_manager_id: "",
  project_type: "RENOVATION",
  address: "",
  postal_code: "",
  city: "",
  status: "PLANNED",
};

const stepsComponents = [Step1, Step2, Step3, Step4Summary];

const ProjectModal = ({ isOpen, onClose, projectInfos }: ModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: EMPTY_FORM,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { data: clients, isLoading } = useGetClients();
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const steps = [1, 2, 3, 4];
  const totalSteps = steps.length;

  const CurrentStepComponent = stepsComponents[currentStep - 1];

  useEffect(() => {
    if (projectInfos) {
      console.log("🚀 ~ ProjectModal ~ projectInfos:", projectInfos);
      reset({
        number_Project: projectInfos.number_Project,
        name: projectInfos.name,
        description: projectInfos.description,
        image: projectInfos.image,
        start_date: new Date(projectInfos.start_date)
          .toISOString()
          .split("T")[0],
        end_Date: new Date(projectInfos.end_Date).toISOString().split("T")[0],
        budget: projectInfos.budget,
        individual_id: projectInfos.individual_id,
        project_type: projectInfos.project_type,
        address: projectInfos.addressRef?.address,
        postal_code: projectInfos.addressRef?.postal_code,
        city: projectInfos.addressRef?.city,
        status: projectInfos.status,
      });
    } else {
      reset(EMPTY_FORM);
    }
    setCurrentStep(1);
  }, [projectInfos, reset, isOpen]);

  const handleFormSubmit = (data: FormData) => {
    if (!data.image) {
      data.image = noImage;
    }

    if (projectInfos) {
      console.log("🚀 ~ handleFormSubmit ~ data:", data);

      updateProjectMutation.mutate(
        { ...data, id: projectInfos.id },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      createProjectMutation.mutate(data, {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error("Error creating project:", error);
        },
      });
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["image", "name", "description"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  //to do faire une fonction pour le code qui verifie image pour éviter répétitions
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setValue("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setValue("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const formValues = watch();
  const selectedClient = clients?.find(
    (client: User) => String(client.id) === String(formValues.individual_id),
  );

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-4xl h-[90vh] overflow-y-auto">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          <IoIosClose size={22} />
        </button>

        <h1 className="text-3xl text-center font-bold mb-6">
          {projectInfos ? "Update Project" : "New Project"}
        </h1>

        {/* Progress indicator */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              {/* Cercle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step
                    ? "bg-amber-400 text-white"
                    : "bg-gray-300"
                }`}
              >
                {step}
              </div>

              {/* Ligne sauf pour le dernier cercle */}
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-1 ${
                    currentStep > step ? "bg-amber-400" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form
          className="flex flex-col gap-3 h-[78%] w-full px-10 py-4 md:mt-16 justify-between"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <CurrentStepComponent
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            handleFileInput={handleFileInput}
            clients={clients}
            isLoading={isLoading}
            formValues={formValues}
            selectedClient={selectedClient}
          />

          {/* Navigation*/}
          <div className="flex justify-between mt-6 md:mt-16">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors"
              >
                Previous
              </button>
            )}

            {currentStep < totalSteps && (
              <button
                key="next"
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-500 transition-colors"
              >
                Next
              </button>
            )}

            {currentStep === totalSteps && (
              <button
                key="submit"
                type="submit"
                className="px-6 py-2 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-500 transition-colors"
              >
                {projectInfos ? "Update Project" : "Create Project"}
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default ProjectModal;
