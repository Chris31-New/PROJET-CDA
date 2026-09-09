import {
  useDeleteProject,
  useGetProjectById,
} from "../hooks/use-project.service";
import { useNavigate, useParams } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
import ScrollBarCustom from "../components/ScrollBarCustom";
import type { TaskStatus } from "../interfaces/task";
import type { ProjectStatus } from "../interfaces/project";
import ProjectModal from "../modals/projects/ProjectModal";
import { useState } from "react";
import VerifDeleteModal from "../modals/VerifDelete";
import { AddCompanyModal } from "../modals/projects/AddCompanyModal";

const OneProject = () => {
  const { id } = useParams();
  const { data: project } = useGetProjectById(Number(id));
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isVerifDeleteModalOpen, setIsVerifDeleteModalOpen] = useState(false);
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);

  const deleteProjectMutation = useDeleteProject();

  const navigate = useNavigate();
  const handleDeleteProject = async (id: number) => {
    deleteProjectMutation.mutate(id, {
      onSuccess: () => {
        setIsVerifDeleteModalOpen(false);
        navigate("/");
      },
    });
  };
  const statusLabel: Record<TaskStatus, string> = {
    TO_DO: "To do",
    DONE: "Done",
    IN_PROGRESS: "In progress",
    BLOCKED: "Blocked",
  };
  const statusLabelProject: Record<ProjectStatus, string> = {
    PLANNED: "Planned",
    COMPLETED: "Completed",
    IN_PROGRESS: "In progress",
    BLOCKED: "Blocked",
    CANCELLED: "Cancelled",
  };

  return (
    <div>
      {project && (
        <div className="flex flex-col h-full">
          <div className="flex flex-row justify-between mt-8 mx-6 border-b-2">
            <div className="flex flex-row w-full items-start gap-4">
              <h1 className="text-2xl w-fit font-bold font-inter flex ">
                {project && project.name}
              </h1>
              <span
                className={`
            px-3 py-1 text-sm font-semibold rounded-full
            ${project.status}
          `}
              >
                {statusLabelProject[project.status]}
              </span>
            </div>
            <div className="flex flex-row  gap-4 md:gap-16">
              <MdEdit size={25} onClick={() => setIsProjectModalOpen(true)} />
              <MdDelete
                className="text-red-500"
                size={25}
                onClick={() => setIsVerifDeleteModalOpen(true)}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center md:ml-8">
            <img
              key={project.id}
              src={project.image}
              alt={project.name}
              className="w-64 md:w-80 h-40 md:h-60 mx-6 mt-6 object-cover rounded-2xl shadow-md"
            />
            <div className="flex flex-col px-8 mt-6 w-full items-start md:mx-20">
              <h2 className="font-semibold underline">Description</h2>
              <p>{project.description}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start mb-4">
            <div className="flex flex-col w-full md:w-1/2 ">
              <div className="flex flex-row justify-between items-center mt-6 mx-6 border-b-2 h-14">
                <h1 className="text-xl md:text-2xl w-fit font-bold font-inter flex ">
                  Tasks list
                </h1>
                <button className="flex items-center text-sm md:text-base justify-center px-2 py-1 bg-amber-500 text-white font-semibold rounded-lg m-2">
                  See all tasks
                </button>
              </div>
              <ScrollBarCustom className="scrollbar-Y flex flex-col h-30  md:h-60 items-start mx-6 my-4 py-2 md:py-6 px-4 md:px-6 rounded-2xl inset-shadow-sm shadow-xl overflow-y-auto gap-2">
                {project.tasks &&
                  project.tasks?.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between w-full hover:bg-gray-50 px-2 rounded-xl transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>

                        <span className="text-gray-800 font-medium">
                          {task.name}
                        </span>
                      </div>

                      <span
                        className={`
            px-3 py-1 text-sm font-semibold rounded-full
            ${task.status}
          `}
                      >
                        {statusLabel[task.status]}
                      </span>
                    </li>
                  ))}
                {!project.tasks?.length && (
                  <div>This project has no tasks yet.</div>
                )}
              </ScrollBarCustom>
            </div>
            <div className="flex flex-col w-full  md:w-1/2 ">
              <div className="flex flex-row justify-between items-center mt-6 mx-6 border-b-2 h-14 ">
                <h1 className="text-xl md:text-2xl w-fit font-bold font-inter flex ">
                  Partner companies
                </h1>
                <button onClick={() => setIsAddCompanyModalOpen(true)} className="flex items-center text-sm md:text-base justify-center px-2 py-1 bg-amber-500 text-white font-semibold rounded-lg m-2">
                  Add company
                </button>
              </div>
              <ScrollBarCustom className="scrollbar-Y flex flex-col h-30 md:h-60 items-start mx-6 mt-4 mb-2 py-2 md:py-6 px-4 md:px- rounded-2xl inset-shadow-sm shadow-xl overflow-y-auto gap-2">
                {project.companies &&
                  project.companies?.map((company) => (
                    <li
                      key={company.company_id}
                      className="flex items-center justify-between w-full hover:bg-gray-50 px-2 rounded-xl transition"
                    >
                      <div className="flex flex-row w-full justify-between mr-6">
                        <div className="flex items-center gap-6">
                          <FaCircleUser size={25} className="text-gray-200" />
                          <div className=" font-medium">
                            {company.company?.name}
                          </div>
                        </div>
                        <div className=" font-semibold">
                          {company.company?.specialities
                            ?.map((s) => s.speciality?.name)
                            .join(", ") ?? ""}
                        </div>
                      </div>
                    </li>
                  ))}
                {!project.companies?.length && (
                  <div>This project has no companies yet.</div>
                )}
              </ScrollBarCustom>
            </div>
          </div>
        </div>
      )}
      {isProjectModalOpen && (
        <ProjectModal
          projectInfos={project}
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
        />
      )}
      {isVerifDeleteModalOpen && project && (
        <VerifDeleteModal
          itemToDelete="project"
          idItem={project.id}
          isOpen={isVerifDeleteModalOpen}
          onClose={() => setIsVerifDeleteModalOpen(false)}
          onSubmit={handleDeleteProject}
        />
      )}
      {isAddCompanyModalOpen && project && (
        <AddCompanyModal
          isOpen={isAddCompanyModalOpen}
          onClose={() => setIsAddCompanyModalOpen(false)}
          projectId={project.id}
          alreadyLinkedIds={project.companies?.map((c) => c.company_id) || []}
        />
      )}
    </div>
  );
};

export default OneProject;
