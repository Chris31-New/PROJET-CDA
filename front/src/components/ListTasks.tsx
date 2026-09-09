import { MdDeleteForever, MdEdit } from "react-icons/md";
import type { Task } from "../interfaces/task";
import { Link } from "react-router-dom";

interface ITaskProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const ListTasks = ({ task, onEdit, onDelete }: ITaskProps) => {
  return (
    <div className="shadow-sm/50 shadow-black rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <div className={`${task.status} rounded-4xl w-3 h-3 lg:w-5 lg:h-5`} />
        <Link to={`/tasks/${task.id}`}>
          <h1 className="text-xl font-medium lg:text-3xl">{task.name}</h1>
        </Link>
        <div className="ml-auto flex">
          <MdEdit size={30} onClick={onEdit} />
          <MdDeleteForever size={30} color="#F24822" onClick={onDelete} />
        </div>
      </div>
      <h2 className="font-medium text-gray-600">{task.company_id}</h2>
      <p>{task.description}</p>
    </div>
  );
};

export default ListTasks;
