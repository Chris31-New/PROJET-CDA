import { useEffect, useRef, useState } from "react";
import { HiAdjustments } from "react-icons/hi";
import { IoIosAddCircle } from "react-icons/io";
import CardProject from "../components/CardProject";
import type { Project } from "../interfaces/project";
import {
  useGetOwnProjects,
  useGetProjects,
} from "../hooks/use-project.service";
import ProjectModal from "../modals/projects/ProjectModal";

const HomePage = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const { data: projects } = useGetProjects();
  const { data: OwnProjects, isLoading, error } = useGetOwnProjects();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false); //useState qui gère si ma modale doit être ouverte ou fermée

  const scrollToProject = (index: number) => {
    if (!carouselRef.current) return;

    const cardWidth = 100;
    const maxScrollLeft =
      carouselRef.current.scrollWidth - carouselRef.current.clientWidth;

    carouselRef.current.scrollTo({
      left: Math.min(index * cardWidth, maxScrollLeft),
      behavior: "smooth",
    });

    setCurrentIndex(index);
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (!carouselRef.current) return;
      const { scrollWidth, clientWidth } = carouselRef.current;
      setHasOverflow(scrollWidth > clientWidth);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [projects]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row justify-between mt-8 mx-6 border-b-2">
        <h1 className="text-2xl w-2/3 font-bold font-inter flex ">
          My Projects
        </h1>
        <div className="flex flex-row  gap-8 md:gap-16">
          <HiAdjustments size={25} />
          <IoIosAddCircle
            size={25}
            onClick={() => setIsProjectModalOpen(true)}
          />
        </div>
      </div>
      <div
        ref={carouselRef}
        className="flex flex-row h-1/2 sm:h-full overflow-auto mx-6 mt-6 gap-4 px-4 scroll-smooth"
        onScroll={(e) => {
          const el = e.currentTarget;
          const scrollLeft = el.scrollLeft;
          const maxScrollLeft = el.scrollWidth - el.clientWidth;
          const cardWidth = 100;
          if (scrollLeft >= maxScrollLeft - 5 && projects) {
            setCurrentIndex(projects.length - 1);
          } else {
            setCurrentIndex(Math.floor(scrollLeft / cardWidth));
          }
        }}
      >
        {isLoading && (
          <div className="flex justify-center items-center min-h-[50vh]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <span>{error.message}</span>
          </div>
        )}

        {OwnProjects &&
          OwnProjects.map((project: Project) => (
            <CardProject project={project} />
          ))}
      </div>
      <div className="flex justify-center gap-2 mt-2">
        {hasOverflow &&
          projects &&
          projects.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToProject(index)}
              className={`
        w-3 h-3 rounded-full transition-all
        ${currentIndex === index ? "bg-amber-500 scale-125" : "bg-gray-300"}
      `}
            />
          ))}
      </div>
      <div className="flex flex-row justify-between mt-6 mx-6 border-b-2">
        <h1 className="text-2xl w-2/3 font-bold font-inter flex ">
          What others do
        </h1>
      </div>
      <div className="flex flex-wrap gap-4 my-2 pl-6 pb-6 overflow-y-auto">
        {projects &&
          projects.map((project: Project) => <CardProject project={project} />)}
      </div>
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
