import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import type { Task, TaskStatus } from "../../interfaces/task";
import { useGetCompany } from "../../hooks/use-company.service";
import { useGetSpecialities } from "../../hooks/use-speciality.service";
import { useGetProjects } from "../../hooks/use-project.service";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null | undefined;
  onSubmit: (data: Task) => void;
}

const EditTasks = ({ isOpen, onClose, task, onSubmit }: ModalProps) => {
  const { data: companies } = useGetCompany();
  const { data: specialities } = useGetSpecialities();
  const { data: projects } = useGetProjects();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TO_DO");
  const [statusNote, setStatusNote] = useState("");
  const [projectId, setProjectId] = useState<number>(0);
  const [companyId, setCompanyId] = useState<number | undefined>();
  const [specialityId, setSpecialityId] = useState<number>(0);

  useEffect(() => {
    if (!task) return;
    setName(task.name);
    setDescription(task.description);
    setStartDate(new Date(task.start_date).toISOString().slice(0, 10));
    setEndDate(new Date(task.end_date).toISOString().slice(0, 10));
    setStatus(task.status);
    setStatusNote(task.status_note);
    setProjectId(task.project_id);
    setCompanyId(task.company_id);
    setSpecialityId(task.speciality_id ?? 0);
  }, [task]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task) return;

    const updatedTask: Task = {
      id: task.id,
      name,
      description,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      status,
      status_note: statusNote,
      project_id: projectId,
      company_id: companyId || undefined,
      speciality_id: specialityId,
    };

    onSubmit(updatedTask);
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-2xl">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          <IoIosClose size={22} />
        </button>

        <h1 className="text-2xl font-bold text-center mb-6">Edit Task</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered"
              required
            />
          </div>

          {/* Status */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="select select-bordered"
            >
              <option value="TO_DO">To do</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="BLOCKED">Blocked</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered"
              required
            />
          </div>

          {/* Dates */}
          <div className="flex gap-4">
            <div className="form-control w-1/2">
              <label className="label">
                <span className="label-text">Start Date</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control w-1/2">
              <label className="label">
                <span className="label-text">End Date</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input input-bordered"
                required
              />
            </div>
          </div>

          {/* Project */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Project</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(Number(e.target.value))}
              className="select select-bordered"
              required
            >
              <option disabled value={0}>Select a project</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Speciality */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Speciality</span>
            </label>
            <select
              value={specialityId}
              onChange={(e) => setSpecialityId(Number(e.target.value))}
              className="select select-bordered"
              required
            >
              <option disabled value={0}>Select a speciality</option>
              {specialities?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Company */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Company (optional)</span>
            </label>
            <select
              value={companyId ?? ""}
              onChange={(e) =>
                setCompanyId(e.target.value ? Number(e.target.value) : undefined)
              }
              className="select select-bordered"
            >
              <option value="">None</option>
              {companies?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status note */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Status Note</span>
            </label>
            <textarea
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              className="textarea textarea-bordered"
            />
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-warning">
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default EditTasks;