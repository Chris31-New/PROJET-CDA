import User from "../assets/user.svg";
import Contact from "../assets/contact.svg";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ScrollBarCustom from "../components/ScrollBarCustom";
import { ProfileProjectCard } from "../components/ProfileProjectCard";
import { MdEdit } from "react-icons/md";
import { useState } from "react";
import type { ContactInfo } from "../types/profile.type";
import ProfileModal from "../modals/profile/ProfileModal";
import { useAuthStore } from "../store/auth.store";
import { useGetOwnProjects } from "../hooks/use-project.service";
import { useGetUserProfile } from "../hooks/use-user.service";
import type { Profile } from "../interfaces/user";

const SectionCard = ({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <section className={`rounded-3xl p-5 sm:p-6 lg:p-8 ${className}`}>
            {children}
        </section>
    );
};

const SectionTitle = ({
    title,
    rightContent,
}: {
    title: string;
    rightContent?: React.ReactNode;
}) => {
    return (
        <div className="flex items-end justify-between gap-4 border-b border-black pb-3">
            <h1 className="text-[2rem] font-normal text-black sm:text-[2.2rem] lg:text-[2.4rem]">
                {title}
            </h1>
            {rightContent}
        </div>
    );
};

const ContactCard = ({ label, value }: ContactInfo) => {
    return (
        <div className="rounded-2xl bg-[#f7f7f7] px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
            <p className="mt-1 wrap-break-words text-[0.95rem] text-black lg:text-[1rem]">
                {value}
            </p>
        </div>
    );
};

const UserProfile = () => {
    const user = useAuthStore((state) => state.user);

    const { data: projects } = useGetOwnProjects();
    const { data: userProfile } = useGetUserProfile(user?.id);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const contactInfos: ContactInfo[] = userProfile
        ? [
            { label: "Email", value: user?.email },
            { label: "Phone", value: userProfile?.phone },
        ]
        : [];

    const userProfileInfos: Omit<Profile, "userId"> | null = userProfile
        ? {
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            phone: userProfile.phone
        }
        : null

    const UserRoleToLowerCase = (user: string) => {
        switch (user) {
            case "INDIVIDUAL":
                return "Individual";
            case "SITE_MANAGER":
                return "Site Manager";
            case "COMPANY":
                return "Company";
            default:
                return "";
        }
    }

    return (
        <>
            <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
                <div className="mx-auto w-full max-w-350">
                    <div className="flex flex-col gap-8 lg:gap-10">
                        <SectionCard>
                            <div className="border-b border-black pb-3 flex justify-between items-center">
                                <h1 className="text-[2rem] font-normal text-black sm:text-[2.2rem] lg:text-[2.4rem]">
                                    My Profile
                                </h1>
                                {userProfile && (<MdEdit className="hover:cursor-pointer" size={25} onClick={() => setIsModalOpen(true)} />)}
                            </div>

                            {!userProfile ? (
                                <div className="mt-8 flex flex-col items-center justify-center gap-4 py-12 text-center">
                                    <img
                                        src={User}
                                        alt="Empty user profile"
                                        className="h-28 w-28 rounded-[22px] object-cover p-2 shadow-sm opacity-50"
                                    />
                                    <div>
                                        <h2 className="text-[1.2rem] font-semibold text-black">
                                            No profile yet
                                        </h2>
                                        <p className="mt-2 text-gray-600">
                                            Start by creating your profile.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(true)}
                                        className="rounded-xl bg-black px-5 py-3 text-white transition hover:opacity-90 create-profile"
                                    >
                                        Create my profile
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6 lg:gap-8">
                                    <div className="mx-auto sm:mx-0">
                                        <img
                                            src={User}
                                            alt="User profile"
                                            className="h-36 w-36 rounded-[22px] object-cover p-2 shadow-sm sm:h-44 sm:w-44 lg:h-52 lg:w-52"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex gap-2">
                                                <h2 className="text-[1.2rem] font-semibold leading-tight text-black sm:text-[1.35rem] lg:text-[1.6rem]">
                                                    {userProfile?.firstName}
                                                </h2>
                                                <h2 className="text-[1.2rem] font-semibold leading-tight text-black sm:text-[1.35rem] lg:text-[1.6rem]">
                                                    {userProfile?.lastName.toUpperCase()}
                                                </h2>
                                            </div>

                                            <p className="text-[0.95rem] text-gray-600 sm:text-[1rem] lg:text-[1.05rem]">
                                                {UserRoleToLowerCase(String(user?.role))}
                                            </p>
                                        </div>

                                        <div className="mt-5 flex w-fit items-center gap-3">
                                            <div className="flex items-center gap-2 border-b border-black pb-2">
                                                <img
                                                    src={Contact}
                                                    alt="Contact"
                                                    className="h-7 w-7 lg:h-8 lg:w-8"
                                                />
                                                <span className="text-[1rem] font-medium text-black lg:text-[1.05rem]">
                                                    Contact Me
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-3 lg:max-w-130">
                                            {contactInfos.map((info) => (
                                                <ContactCard
                                                    key={info.label}
                                                    label={info.label}
                                                    value={info.value}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </SectionCard>

                        {userProfile && (
                            <SectionCard>
                                <SectionTitle
                                    title="My Projects"
                                    rightContent={
                                        <p className="hidden text-sm text-gray-500 md:block">
                                            {projects?.length} projects
                                        </p>
                                    }
                                />

                                {/* MOBILE */}
                                <div className="mt-5 md:hidden">
                                    <ScrollBarCustom width="100%" height="280px" direction="x">
                                        <div className="grid auto-cols-[180px] grid-flow-col grid-rows-2 gap-4 select-none pb-4">
                                            {projects?.map((project) => (
                                                <ProfileProjectCard key={project.id} project={project} />
                                            ))}
                                        </div>
                                    </ScrollBarCustom>
                                </div>

                                {/* TABLET + DESKTOP */}
                                <div className="mt-6 hidden grid-cols-2 gap-5 md:grid xl:grid-cols-3 xl:gap-6">
                                    {projects?.map((project) => (
                                        <ProfileProjectCard key={project.id} project={project} />
                                    ))}
                                </div>
                            </SectionCard>
                        )}
                    </div>
                </div>
            </div>

            <ProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isProfileExists={userProfile !== null}
                userProfileInfos={userProfileInfos}
            />
        </>
    );
};

export default UserProfile;
