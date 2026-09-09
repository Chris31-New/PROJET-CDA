import type { Profile } from "../../interfaces/user";
import { useForm } from "react-hook-form";
import { useCreateProfile, useUpdateProfile } from "../../hooks/use-user.service";
import { useAuthStore } from "../../store/auth.store";
import { useEffect } from "react";

type ProfileModalProps = {
    isOpen: boolean;
    onClose: () => void;
    isProfileExists: boolean;
    userProfileInfos: Omit<Profile, "userId"> | null;
}

const ProfileModal = ({ isOpen, onClose, isProfileExists, userProfileInfos }: ProfileModalProps) => {
    const user = useAuthStore((state) => state.user);
    const createProfileMutation = useCreateProfile();
    const updateProfileMutation = useUpdateProfile();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Profile>({
        defaultValues: {
            firstName: "",
            lastName: "",
            phone: ""
        }
    })

    useEffect(() => {
        if (userProfileInfos) {
            reset({
                firstName: userProfileInfos.firstName,
                lastName: userProfileInfos.lastName,
                phone: userProfileInfos.phone,
            });
        }
    }, [userProfileInfos, reset]);

    if (!isOpen) return null;

    const submitForm = (data: Profile) => {
        const payload = {
            userId: user && user.id,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone
        }

        if (isProfileExists) {
            updateProfileMutation.mutate(payload, {
                onSuccess: () => {
                    onClose();
                },
                onError: (error) => {
                    console.error(error)
                }
            })
        } else {
            createProfileMutation.mutate(payload, {
                onSuccess: () => {
                    onClose();
                },
                onError: (error) => {
                    console.error(error)
                }
            })
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lg">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-black">
                        {isProfileExists ? "Update Profile" : "Create Profile"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-gray-500 hover:text-black"
                    >
                        Close
                    </button>
                </div>

                <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4">
                    <div>
                        <input
                            type="text"
                            id="firstName"
                            placeholder="First name"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                            {...register("firstName", {
                                required: "First name is required",
                            })}
                        />
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            id="lastName"
                            placeholder="Last name"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                            {...register("lastName", {
                                required: "Last name is required",
                            })}
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            id="phone"
                            placeholder="Phone"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                            {...register("phone", {
                                required: "Phone is required",
                            })}
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="rounded-xl bg-black px-4 py-3 text-white transition hover:opacity-90 create-profile"
                    >
                        Save profile
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ProfileModal