import { FaCircleUser } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useGetCompany } from "../../hooks/use-company.service";
import { useAddCompanyToProject, useRemoveCompanyFromProject } from "../../hooks/use-project.service";
import { useState } from "react";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  alreadyLinkedIds: number[];
}

export const AddCompanyModal = ({
  isOpen,
  onClose,
  projectId,
  alreadyLinkedIds,
}: AddCompanyModalProps) => {
  const { data: companies, isLoading } = useGetCompany();
  const addCompaniesMutation = useAddCompanyToProject();
  const removeCompanyMutation = useRemoveCompanyFromProject();

  // Initialise avec les companies déjà liées
  const [selectedIds, setSelectedIds] = useState<number[]>(alreadyLinkedIds);
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filtered = companies?.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    // IDs à ajouter (sélectionnés mais pas encore liés)
    const toAdd = selectedIds.filter((id) => !alreadyLinkedIds.includes(id));
    // IDs à supprimer (liés mais décochés)
    const toRemove = alreadyLinkedIds.filter((id) => !selectedIds.includes(id));

    const promises = [
      ...(toAdd.length
        ? [addCompaniesMutation.mutateAsync({ projectId, companyIds: toAdd })]
        : []),
      ...toRemove.map((companyId) =>
        removeCompanyMutation.mutateAsync({ projectId, companyId })
      ),
    ];

    await Promise.all(promises);
    onClose();
  };

  const isPending = addCompaniesMutation.isPending || removeCompanyMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold font-inter">Manage companies</h2>
          <IoClose
            size={22}
            className="cursor-pointer text-gray-500 hover:text-gray-800 transition"
            onClick={onClose}
          />
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b">
          <input
            type="text"
            placeholder="Search a company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-1">
          {isLoading && (
            <p className="text-sm text-gray-400 text-center py-6">Loading...</p>
          )}
          {filtered?.map((company) => {
            const selected = selectedIds.includes(company.id);
            const wasLinked = alreadyLinkedIds.includes(company.id);

            return (
              <div
                key={company.id}
                onClick={() => toggle(company.id)}
                className={`
                  flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer
                  ${selected ? "bg-amber-50 border border-amber-400" : "hover:bg-gray-50"}
                  ${wasLinked && !selected ? "opacity-50" : ""}
                `}
              >
                <div className="flex items-center gap-3">
                  <FaCircleUser size={28} className="text-gray-300" />
                  <div>
                    <p className="font-medium text-sm">{company.name}</p>
                    <p className="text-xs text-gray-400">
                      {company.specialities?.map((s) => s.speciality?.name).join(", ") ?? ""}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  readOnly
                  checked={selected}
                  className="accent-amber-500 w-4 h-4"
                />
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {selectedIds.length} selected
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="px-4 py-2 text-sm bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};