import { useState } from "react";
import ListTasks from "../components/ListTasks";
import { HiAdjustments } from "react-icons/hi";
import { IoIosAddCircle } from "react-icons/io";
import type { Task } from "../interfaces/task";
import AddTasks from "../modals/tasks/AddTasks";
import EditTasks from "../modals/tasks/EditTasks";
import FilterTasks from "../modals/tasks/FilterTasks";
import {
  useCreateTask,
  useDeleteTask,
  useGetAllTasks,
  useUpdateTask,
} from "../hooks/use-task.service";
import VerifDeleteModal from "../modals/VerifDelete";

const Tasks = () => {
  const { data: tasks, isLoading, error } = useGetAllTasks();

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterTaskModal, setFilterTaskModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [isVerifDeleteModalOpen, setIsVerifDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const addTaskMutation = useCreateTask();

  const handleAddTask = (newTaskData: Omit<Task, "id">) => {
    addTaskMutation.mutate(newTaskData);
  };

  const editTaskMutation = useUpdateTask();

  const editTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditTaskModalOpen(true);
  };

  const handleEditTask = async (task: Task) => {
    editTaskMutation.mutate(task, {
      onSuccess: () => {
        setIsEditTaskModalOpen(false);
        setSelectedTask(null);
      },
    });
  };

  const tasksFilter = (filter: string[]) => {
    console.log(filter);
    setSelectedFilter(filter);
    setFilterTaskModal(false);
  };

  const deleteTaskMutation = useDeleteTask();

  const handleDeleteTask = async (id: number) => {
    deleteTaskMutation.mutate(id, {
      onSuccess: () => {
        setIsVerifDeleteModalOpen(false);
      },
    });
  };

  const filteredTasks =
    selectedFilter.length > 0
      ? tasks?.filter((task) => selectedFilter.includes(task.status))
      : tasks;

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;

  return (
    <div className="flex flex-col h-full pt-8 px-6 sm:px-8">
      <div className="flex border-b-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-inter">All Tasks</h1>
          <HiAdjustments
            size={30}
            className="rounded-sm hover:bg-gray-200 hover:cursor-pointer transition-colors duration-300 ease-in-out"
            onClick={() => setFilterTaskModal(true)}
          />
        </div>
        <div className="ml-auto">
          <IoIosAddCircle
            className="hover:cursor-pointer"
            onClick={() => setIsAddTaskModalOpen(true)}
            size={30}
          />
        </div>
      </div>

      <div className="flex flex-col h-full overflow-y-auto gap-3 py-5 ">
        {filteredTasks?.map((task) => (
          <ListTasks
            key={task.id}
            task={task}
            onEdit={() => editTask(task)}
            onDelete={() => {
              setTaskToDelete(task);
              setIsVerifDeleteModalOpen(true);
            }}
          />
        ))}
      </div>

      <AddTasks
        isOpen={isAddTaskModalOpen}
        tasks={tasks || []}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={handleAddTask} // <-- ici la mutation
      />

      <EditTasks
        isOpen={isEditTaskModalOpen}
        onClose={() => setIsEditTaskModalOpen(false)}
        task={selectedTask}
        onSubmit={handleEditTask}
      />

      <FilterTasks
        isOpen={filterTaskModal}
        onClose={() => setFilterTaskModal(false)}
        onSubmit={tasksFilter}
        selectedFilter={selectedFilter}
      />

      {isVerifDeleteModalOpen && taskToDelete && (
        <VerifDeleteModal
          itemToDelete="task"
          idItem={taskToDelete.id}
          isOpen={isVerifDeleteModalOpen}
          onClose={() => {
            setIsVerifDeleteModalOpen(false);
            setTaskToDelete(null);
          }}
          onSubmit={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default Tasks;
