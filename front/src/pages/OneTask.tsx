import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useDeleteTask,
  useGetTaskById,
  useUpdateTask,
} from "../hooks/use-task.service";
import type { Task, TaskStatus } from "../interfaces/task";
import { MdDelete, MdEdit, MdExpandMore } from "react-icons/md";
import { useState } from "react";
import EditTasks from "../modals/tasks/EditTasks";
import { HiOutlineArrowRightCircle } from "react-icons/hi2";
import ScrollBarCustom from "../components/ScrollBarCustom";
import { useGetShoppingLineByTask } from "../hooks/use-shoppingLine.service";
import VerifDeleteModal from "../modals/VerifDelete";

const OneTask = () => {
  const { id } = useParams();
  const { data: task } = useGetTaskById(Number(id));
  const { data: shopping_lines } = useGetShoppingLineByTask(Number(id));
  const [isStatusNoteExpanded, setIsStatusNoteExpanded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isVerifDeleteModalOpen, setIsVerifDeleteModalOpen] = useState(false);

  const editTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleEditTask = async (task: Task) => {
    editTaskMutation.mutate(task, {
      onSuccess: () => {
        setIsTaskModalOpen(false);
      },
    });
  };
  const navigate = useNavigate();
  const handleDeleteTask = async (id: number) => {
    deleteTaskMutation.mutate(id, {
      onSuccess: () => {
        setIsVerifDeleteModalOpen(false);
        navigate("/tasks");
      },
    });
  };

  const statusLabel: Record<TaskStatus, string> = {
    "to-do": "To do",
    done: "Done",
    "in-progress": "In progress",
    blocked: "Blocked",
  };
  return (
    <div>
      {task && (
        <div className="flex flex-col h-full">
          <div className="flex flex-row justify-between mt-8 md:mt-16 mx-6 border-b-2 md:mx-16">
            <div className="flex w-full items-start gap-4">
              <h1 className="text-2xl font-bold font-inter">{task.name}</h1>
            </div>
            <div className="flex flex-row gap-4 md:gap-16">
              <MdEdit size={25} onClick={() => setIsTaskModalOpen(true)} />
              <MdDelete
                className="text-red-500"
                size={25}
                onClick={() => setIsVerifDeleteModalOpen(true)}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start mt-6 mx-8 justify-center md:justify-start md:ml-16 gap-2 md:gap-8 ">
            <p className="font-semibold">{task.company?.name}</p>
            <p className="italic">{task.speciality?.name}</p>
            <span
              className={`
                    px-3 py-1 text-sm font-semibold rounded-full
                    ${task.status}
                  `}
            >
              {statusLabel[task.status]}
            </span>
          </div>
          <div className="flex flex-col items-start mb-4 md:mt-8">
            <div className="flex flex-col md:flex-row md:w-full md:gap-8">
              <div className="flex flex-col w-full md:w-1/2  md:pl-8">
                <div className="flex flex-row justify-between items-center mt-4 mx-6 border-b-2 h-14">
                  <h1 className="text-xl md:text-2xl w-fit font-bold font-inter flex">
                    Status note
                  </h1>
                  <button
                    onClick={() => setIsStatusNoteExpanded((prev) => !prev)}
                    className="text-black hover:text-amber-500 transition"
                  >
                    <MdExpandMore
                      size={24}
                      className={`transform transition-transform mr-8 duration-200 ${
                        isStatusNoteExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 mt-2 mx-8 ${
                    isStatusNoteExpanded ? "h-auto" : "h-6 md:h-6"
                  }`}
                  style={{
                    WebkitLineClamp: isStatusNoteExpanded ? "unset" : 1,
                  }}
                >
                  <p
                    className={`text-gray-800 ${!isStatusNoteExpanded ? "truncate" : ""}`}
                  >
                    {task.status_note}
                  </p>
                </div>
              </div>
              <div className="flex flex-col w-full md:w-1/2  md:pr-8">
                <div className="flex flex-row justify-between items-center mt-6 mx-6 border-b-2 h-14">
                  <h1 className="text-xl md:text-2xl w-fit font-bold font-inter flex">
                    Description
                  </h1>
                  <button
                    onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                    className="text-black hover:text-amber-500 transition"
                  >
                    <MdExpandMore
                      size={24}
                      className={`transform transition-transform mr-8 duration-200 ${
                        isDescriptionExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 mt-2 mx-8 ${
                    isDescriptionExpanded ? "h-auto" : "h-6 md:h-6"
                  }`}
                >
                  <p
                    className={`text-gray-800 ${!isDescriptionExpanded ? "truncate" : ""}`}
                  >
                    {task.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full md:px-8 md:mt-8 ">
              <div className="flex flex-row justify-between items-center mt-6 mx-6 border-b-2 h-14 ">
                <h1 className="text-xl md:text-2xl w-fit font-bold font-inter flex ">
                  Shopping list
                </h1>
                <Link to={`/shoppingLines/${task.id}`}>
                  <HiOutlineArrowRightCircle
                    size={35}
                    className=" text-black hover:text-amber-500 transition mr-8"
                  />
                </Link>
              </div>
              <ScrollBarCustom className="scrollbar-Y flex flex-col h-30  md:h-60 items-start mx-4 md:mx-6 my-4 py-2 md:py-6 px-4 md:px-6 rounded-2xl inset-shadow-sm shadow-xl overflow-y-auto gap-2">
                {shopping_lines &&
                  shopping_lines?.map((sl) => (
                    <li
                      key={sl.id}
                      className="flex items-center justify-between w-full hover:bg-gray-50 px-2 rounded-xl transition"
                    >
                      <div className="flex items-center gap-3 md:gap-8">
                        <span className="min-w-[12px] min-h-[12px] w-3 h-3 rounded-full bg-yellow-400 mr-4"></span>

                        <span className="text-gray-800 font-medium">
                          {sl.article?.name}
                        </span>
                        <span className="text-gray-800 font-medium">
                          {sl.article?.category?.name}
                        </span>
                        <span className="text-gray-800 font-medium">
                          {sl.unit_price}{" "}
                          <span className=" italic">(€/unit)</span>
                        </span>
                        <span className="text-gray-800 font-medium">
                          {sl.quantity} <span className=" italic">(unit)</span>
                        </span>
                      </div>
                    </li>
                  ))}
              </ScrollBarCustom>
            </div>
          </div>
        </div>
      )}
      {isTaskModalOpen && (
        <EditTasks
          task={task}
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSubmit={handleEditTask}
        />
      )}
      {isVerifDeleteModalOpen && task && (
        <VerifDeleteModal
          itemToDelete="task"
          idItem={task.id}
          isOpen={isVerifDeleteModalOpen}
          onClose={() => setIsVerifDeleteModalOpen(false)}
          onSubmit={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default OneTask;
