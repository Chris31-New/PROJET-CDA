import { IoIosClose } from "react-icons/io";
import type { Task } from "../../interfaces/task";
import { useGetProjects } from "../../hooks/use-project.service";
import { useGetCompany } from "../../hooks/use-company.service";
import { useGetSpecialities } from "../../hooks/use-speciality.service";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, "id">) => void;
  tasks: Task[];
}

const AddTasks = ({ isOpen, tasks, onClose, onSubmit }: ModalProps) => {
  const { data: projects } = useGetProjects();
  const { data: companies } = useGetCompany();
  const { data: specialities } = useGetSpecialities();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const dependencyValue = formData.get("dependencies");

    const newTaskData: Omit<Task, "id"> = {
      name: String(formData.get("title-task")),
      description: String(formData.get("description")),
      start_date: new Date(String(formData.get("start_date"))),
      end_date: new Date(String(formData.get("end_date"))),
      status: "TO_DO",
      status_note: "",
      project_id: Number(formData.get("project_id")),
      speciality_id: Number(formData.get("speciality_id")),
      company_id: Number(formData.get("company_id")) || undefined,
    };

    onSubmit(newTaskData);
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-2xl">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          <IoIosClose size={24} />
        </button>

        <h1 className="text-2xl font-bold text-center mb-6">New Task</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Task Title</span>
            </label>
            <input
              type="text"
              name="title-task"
              placeholder="Task name"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Task Description</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered"
              placeholder="Description"
              required
            />
          </div>

          {/* Projet */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Project</span>
            </label>
            <select
              name="project_id"
              className="select select-bordered"
              required
            >
              <option disabled selected hidden value="">
                Select a project
              </option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Start Date</span>
            </label>
            <input
              type="date"
              name="start_date"
              className="input input-bordered"
              required
            />
          </div>

          {/* End Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">End Date</span>
            </label>
            <input
              type="date"
              name="end_date"
              className="input input-bordered"
              required
            />
          </div>

          {/* Speciality */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Speciality</span>
            </label>
            <select
              name="speciality_id"
              className="select select-bordered"
              required
            >
              <option disabled selected hidden value="">
                Select a speciality
              </option>
              {specialities?.map((speciality) => (
                <option key={speciality.id} value={speciality.id}>
                  {speciality.name}
                </option>
              ))}
            </select>
          </div>

          {/* Company */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Company (optional)</span>
            </label>
            <select name="company_id" className="select select-bordered">
              <option value="">None</option>
              {companies?.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dependencies */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Depends on (optional)</span>
            </label>
            <select name="dependencies" className="select select-bordered">
              <option value="">None</option>
              {tasks?.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-warning">
              Submit
            </button>
          </div>
        </form>
      </div>

      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default AddTasks;