import { addWeeks, format, startOfWeek } from "date-fns";
import * as local from "date-fns/locale";
import { useEffect, useMemo, useRef, useState } from "react";
import { PlanningGrid } from "../components/PlanningGrid";
import { usePlanningItems } from "../hooks/domain/use-planningItems.service";
import { useGetOwnProjects } from "../hooks/use-project.service";
import { IoIosClose } from "react-icons/io";
import {
    useCreateCompanyUnavailability,
    useGetAllCompaniesUnavailabilities,
    useGetCompanyUnavailabilities,
    useUpdateCompanyUnavailability,
} from "../hooks/use-company-unavailabilities";
import type { PlanningItem } from "../interfaces/planning-item";
import { useAuthStore } from "../store/auth.store";
import { useGetCompany } from "../hooks/use-company.service";

const Planning = () => {
    const user = useAuthStore((state) => state.user);

    // TanStack / data hooks
    const { data: companies = [] } = useGetCompany();

    const companyId = companies.find((c) => c.userId === user?.id)?.id ?? null;

    const { data: projects = [], isLoading, error } = useGetOwnProjects();
    const { data: allCompaniesUnavailabilities = [] } =
        useGetAllCompaniesUnavailabilities(user?.role === "SITE_MANAGER");
    const { data: company_unavailabilities = [] } =
        useGetCompanyUnavailabilities(companyId, user?.role === "COMPANY");
    const createCompanyUnavailability = useCreateCompanyUnavailability();
    const updateCompanyUnavailability = useUpdateCompanyUnavailability();

    // Local state
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [weekStart, setWeekStart] = useState(
        startOfWeek(new Date(), { weekStartsOn: 1 })
    );
    const [formData, setFormData] = useState({
        start_unAv: "",
        end_unAv: "",
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [unavailabilityState, setUnavailabilityState] = useState<string>("create");
    const [selectedUnavailabilityId, setSelectedUnavailabilityId] = useState<number | "">("");

    const effectiveSelectedProjectId =
        selectedProjectId !== null && projects.some((p) => p.id === selectedProjectId)
            ? selectedProjectId
            : projects[0]?.id ?? null;

    const items = usePlanningItems(effectiveSelectedProjectId);

    // Refs
    const unavailabilityRef = useRef<HTMLDivElement>(null);

    // Constants / derived values
    const businessDaysOnly = true;

    const unavsAsPlanningItems: PlanningItem[] = useMemo(() => {
        if (user?.role === "SITE_MANAGER") {
            const selectedProject = projects.find((p) => p.id === effectiveSelectedProjectId);
            if (!selectedProject) return [];

            const companyIds = selectedProject.companies?.map((c) => c.company_id) ?? [];

            return allCompaniesUnavailabilities
                .filter((unAvs) => companyIds.includes(unAvs.company_id))
                .map((unAvs) => {
                    const company = companies.find((c) => c.id === unAvs.company_id);

                    return {
                        id: unAvs.id,
                        name: "Unavailability",
                        start_date: new Date(unAvs.start_date),
                        end_date: new Date(unAvs.end_date),
                        status: "UNAVAIBLE",
                        companyName: company?.name ?? "Unknown Company",
                    };
                });
        }

        if (user?.role === "COMPANY") {
            return company_unavailabilities.map((unAvs) => ({
                id: unAvs.id,
                name: "Unavailability",
                start_date: new Date(unAvs.start_date),
                end_date: new Date(unAvs.end_date),
                status: "UNAVAIBLE",
            }));
        }

        return [];
    }, [
        user?.role,
        projects,
        effectiveSelectedProjectId,
        allCompaniesUnavailabilities,
        company_unavailabilities,
        companies,
    ]);

    const gridItems = useMemo(() => {
        if (user?.role === "INDIVIDUAL") return items;
        return [...items, ...unavsAsPlanningItems];
    }, [user?.role, items, unavsAsPlanningItems]);

    const fields = [
        { name: "start_unAv", label: "Start" },
        { name: "end_unAv", label: "End" },
    ] as const;

    // Effects
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                unavailabilityRef.current &&
                !unavailabilityRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handlers
    const resetForm = () => {
        setFormData({
            start_unAv: "",
            end_unAv: "",
        });
        setFormError(null);
        setSelectedUnavailabilityId("");
    };

    const handleSelectUnavailability = (id: number) => {
        setSelectedUnavailabilityId(id);

        const selected = company_unavailabilities.find((u) => u.id === id);
        if (!selected) return;

        setFormData({
            start_unAv: new Date(selected.start_date).toISOString().slice(0, 10),
            end_unAv: new Date(selected.end_date).toISOString().slice(0, 10),
        });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (formError) setFormError(null);
    };

    const handleModal = (visible: boolean) => {
        setIsOpen(visible);
        resetForm();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { start_unAv, end_unAv } = formData;

        if (!start_unAv || !end_unAv) {
            return setFormError("Please enter a start date and an end date of your unavailability.");
        }

        if (start_unAv > end_unAv) {
            return setFormError("Your unavailability cannot start after ending.");
        }

        if (!companyId) {
            return setFormError("Company not found.");
        }

        try {
            if (unavailabilityState === "create") await createCompanyUnavailability.mutateAsync({
                company_id: companyId,
                start_date: new Date(start_unAv),
                end_date: new Date(end_unAv),
            });
            if (unavailabilityState === "update") {
                if (selectedUnavailabilityId === "") {
                    return setFormError("Please select an Unavailability to update");
                }

                await updateCompanyUnavailability.mutateAsync({
                    unavailability_id: selectedUnavailabilityId,
                    company_id: companyId,
                    start_date: new Date(start_unAv),
                    end_date: new Date(end_unAv),
                })
            }
        } catch (error) {
            setFormError("Cannot set the Unavailability");
            console.error(error);
        }
        handleModal(false);
    }

    return (
        <div className="relative">
            <div className="layout-container min-h-150">
                {/* Header + navigation */}
                <div className="flex flex-col items-center justify-between mb-4 lg:flex-row gap-5">
                    <div className="flex w-full justify-between lg:justify-start lg:max-w-[40%]">
                        <h2 className="text-2xl font-bold">Planning</h2>
                        {isLoading && <h1>Loading</h1>}
                        {error && <h1>Cannot load projects : {error.message}</h1>}
                        {!isLoading && !error && (
                            <select
                                className="border border-gray-200 rounded-lg px-3 py-2 max-w-[40%] min-w-[10%] lg:mx-5"
                                value={effectiveSelectedProjectId ?? ""}
                                onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                            >
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="flex w-full justify-between lg:justify-end lg:items-center gap-4">
                        <button
                            onClick={() => setWeekStart((d) => addWeeks(d, -1))}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                            ← Last Week
                        </button>
                        <span className="text-gray-600">
                            Week of {" "}
                            <span className="font-medium">
                                {format(weekStart, "dd MMM yyyy", { locale: local.enGB })}
                            </span>
                        </span>
                        <button
                            onClick={() => setWeekStart((d) => addWeeks(d, 1))}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                            Next Week →
                        </button>
                    </div>
                </div>
                {/* Planning */}
                <PlanningGrid
                    items={gridItems}
                    weekStart={weekStart}
                    businessDaysOnly={businessDaysOnly}
                />
                {/* Bouton de test en attendant le câblage avec le back */}
                {user?.role === "COMPANY" && (
                    <>
                        <button
                            className="border border-gray-200 px-3 py-2 mt-2 rounded-lg bg-gray-900 text-white"
                            onClick={() => {
                                setUnavailabilityState("create")
                                handleModal(true)
                            }}
                        >
                            Set an Unavailability
                        </button>
                        <button
                            className="border border-gray-200 px-3 py-2 mt-2 rounded-lg bg-gray-900 text-white"
                            onClick={() => {
                                setUnavailabilityState("update")
                                handleModal(true)
                            }}
                        >
                            Update an Unavailability
                        </button></>
                )}
            </div>
            {isOpen === true && (
                <div className="fixed left-0 top-0 w-full bg-black/50 flex justify-center h-full pt-20">
                    <div className="w-xl bg-white max-h-100 rounded-2xl relative flex flex-col items-center" ref={unavailabilityRef}>
                        <IoIosClose
                            className="hover:cursor-pointer absolute top-0 left-0"
                            onClick={() => setIsOpen(false)}
                            size={50}
                        />
                        <h1 className="text-3xl font-bold font-inter border-b-5 border-b-[#FDC700] mt-10">Unavailabilities</h1>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5 pt-5"
                        >
                            <div className={unavailabilityState === "update" ? "block" : "hidden"}>
                                <label htmlFor="selectedUnavailability" className="block font-inter mb-2">
                                    Select an Unavailability
                                </label>
                                <select
                                    id="selectedUnavailability"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    value={selectedUnavailabilityId}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        if (!value) {
                                            setSelectedUnavailabilityId("");
                                            return;
                                        }

                                        handleSelectUnavailability(Number(value));
                                    }}
                                >
                                    <option value="">Choose an unavailability</option>
                                    {company_unavailabilities.map((unAv) => {
                                        return (
                                            <option key={unAv.id} value={unAv.id}>
                                                {format(new Date(unAv.start_date), "dd/MM/yyyy")} - {format(new Date(unAv.end_date), "dd/MM/yyyy")}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>

                            {fields.map((field) => (
                                <div key={field.name} className="w-60 flex items-center">
                                    <label htmlFor={field.label} className="w-50">{field.label}</label>
                                    <input type="date" name={field.name} id={field.name} value={formData[field.name]} onChange={handleChange} />
                                </div>
                            ))}

                            <button
                                key="submit"
                                type="submit"
                                className="px-6 py-2 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-500 transition-colors"
                            >
                                {unavailabilityState === "create" ? "Set Unavailability" : "Update Unavailability"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Planning;