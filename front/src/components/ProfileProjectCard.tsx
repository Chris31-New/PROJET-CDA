import { ProfileProjectBadge } from "./ProfileProjectBadge";

type ProfileProjectCardProps = {
    project: {
        id: number;
        name: string;
        image: string;
    };
};

export const ProfileProjectCard = ({ project }: ProfileProjectCardProps ) => {
    return (
        <article className="relative overflow-hidden rounded-2xl bg-[#f8f8f8] shadow-sm transition-all duration-200 md:rounded-[22px] md:hover:-translate-y-1 md:hover:shadow-md">
            <div className="relative">
                <ProfileProjectBadge
                    name={project.name}
                    className="absolute left-1/2 top-3 z-10 -translate-x-1/2 px-4 py-1.5 md:top-4 md:px-5 md:py-2"
                />

                <img
                    src={project.image}
                    alt={project.name}
                    draggable={false}
                    className="h-30 w-full rounded-2xl object-cover shadow-sm md:h-48 md:rounded-none md:shadow-none xl:h-52"
                />
            </div>

            <div className="hidden space-y-2 p-4 md:block xl:p-5">
                <h3 className="text-base font-semibold text-black">{project.name}</h3>
                <p className="text-sm leading-relaxed text-gray-600">
                    Clean project card layout for tablet and desktop display.
                </p>
            </div>
        </article>
    );
};
