import { IoIosClose } from "react-icons/io";
import { MdWarning } from "react-icons/md";

interface ModalProps {
  itemToDelete: string;
  idItem: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: number) => void;
}

const VerifDeleteModal = ({
  itemToDelete,
  idItem,
  isOpen,
  onClose,
  onSubmit,
}: ModalProps) => {
  const confirmDelete = () => {
    onSubmit(idItem);
  };

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <IoIosClose size={18} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center gap-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-error/20">
            <MdWarning className="text-error" size={28} />
          </div>

          <div>
            <h3 className="font-bold text-lg">Delete {itemToDelete}</h3>
            <p className="py-2 text-sm opacity-70">
              Are you sure you want to delete this {itemToDelete}? This action
              cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="modal-action w-full flex gap-3">
            <button onClick={onClose} className="btn btn-outline flex-1">
              Cancel
            </button>

            <button
              onClick={confirmDelete}
              className="flex-1 py-2 rounded-lg bg-red-400 text-white font-semibold hover:bg-red-700 transition shadow-md"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default VerifDeleteModal;
