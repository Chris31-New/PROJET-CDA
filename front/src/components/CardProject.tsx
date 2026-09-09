import { Link } from "react-router";
import type { Project } from "../interfaces/project";

interface IProps {
  project: Project;
}
const CardProject = ({ project }: IProps) => {
  return (
    <Link to={`/projects/${project.id}`}>
      <div
        className="
    min-w-34 h-34 md:min-w-60 md:h-60
    relative
    rounded-2xl overflow-hidden bg-red-200
    "
      >
        <img
          key={project.id}
          src={project.image}
          alt={project.name}
          className="w-34 md:w-64 h-34 md:h-64 object-cover rounded-2xl shadow-md"
        />
        <div className="absolute inset-0 flex justify-center items-start">
          <div className="w-full md:w-64 h-1/2 md:h-1/3 rounded-2xl bg-amber-600/80 px-4 py-2">
            <h2 className="text-white text-lg font-semibold">{project.name}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardProject;
