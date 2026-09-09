import { useParams } from "react-router-dom";
import {
  useDeleteShoppingLine,
  useGetShoppingLineByTask,
  useUpdateShoppingLine,
} from "../hooks/use-shoppingLine.service";
import { IoIosAddCircle, IoIosSave } from "react-icons/io";
import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import AddShoppingLine from "../modals/AddShoppingLine";
import VerifDeleteModal from "../modals/VerifDelete";
import type { ShoppingLine } from "../interfaces/shopping_line";

const ShoppingLines = () => {
  const { id } = useParams();
  const { data: shopping_lines } = useGetShoppingLineByTask(Number(id));
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isVerifDeleteModalOpen, setIsVerifDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedQuantity, setEditedQuantity] = useState<number>(0);
  const [editedPrice, setEditedPrice] = useState<number>(0);
  const deleteShopMutation = useDeleteShoppingLine();
  const updateShopMutation = useUpdateShoppingLine();

  const handleDeleteShop = async (id: number) => {
    deleteShopMutation.mutate(id, {
      onSuccess: () => {
        setIsVerifDeleteModalOpen(false);
      },
    });
  };

  const handleEditClick = (sl: ShoppingLine) => {
    if (editingId === sl.id) {
      updateShopMutation.mutate({
        id: sl.id,
        quantity: editedQuantity,
        unit_price: editedPrice,
      });
      setEditingId(null);
    } else {
      setEditingId(sl.id);
      setEditedQuantity(sl.quantity);
      setEditedPrice(sl.unit_price);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-row justify-between mt-8 mx-6 sm:mx-8 border-b-2">
          <h1 className="text-xl sm:text-2xl font-bold font-inter flex flex-col sm:flex-row items-start sm:items-center gap-2">
            Shopping List:{" "}
            <span className="text-sm sm:text-base italic sm:ml-6">
              {shopping_lines?.[0]?.task?.name ?? ""}
            </span>
          </h1>
          <div className="flex flex-row mx-4 sm:mx-6">
            <IoIosAddCircle
              size={25}
              className="cursor-pointer"
              onClick={() => setIsShopModalOpen(true)}
            />
          </div>
        </div>

        {shopping_lines && shopping_lines.length > 0 ? (
          <ul className="flex flex-col h-full justify-start mx-4 sm:mx-8 md:mx-16 my-4 sm:my-8 py-2 sm:py-6 px-2 sm:px-6 rounded-2xl inset-shadow-sm shadow-xl overflow-y-auto gap-2 sm:gap-4">
            {shopping_lines.map((sl) => {
              const isEditing = editingId === sl.id;

              return (
                <li
                  key={sl.id}
                  className="flex items-center justify-between w-full hover:bg-gray-50 px-2 rounded-xl transition"
                >
                  <div className="flex items-center gap-3 md:gap-8">
                    <span className="min-w-[12px] min-h-[12px] w-3 h-3 rounded-full bg-yellow-400 mr-2 sm:mr-4"></span>

                    <span className="text-gray-800 font-medium">
                      {sl.article?.name}
                    </span>

                    {/* PRICE */}
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedPrice}
                        onChange={(e) => setEditedPrice(Number(e.target.value))}
                        className="input input-sm w-24"
                      />
                    ) : (
                      <span className="text-gray-800 font-medium">
                        {sl.unit_price}{" "}
                        <span className="italic">(€/unit)</span>
                      </span>
                    )}

                    {/* QUANTITY */}
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedQuantity}
                        onChange={(e) =>
                          setEditedQuantity(Number(e.target.value))
                        }
                        className="input input-sm w-20"
                      />
                    ) : (
                      <span className="text-gray-800 font-medium">
                        {sl.quantity}{" "}
                        <span className="italic">(unit)</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-row gap-2">
                    {!isEditing ? (
                      <MdEdit
                        className="mx-2 sm:mx-6 cursor-pointer"
                        size={25}
                        onClick={() => handleEditClick(sl)}
                      />
                    ) : (
                      <IoIosSave
                        className="mx-2 sm:mx-6 cursor-pointer"
                        size={25}
                        onClick={() => handleEditClick(sl)}
                      />
                    )}

                    <MdDelete
                      className="text-red-500 cursor-pointer"
                      size={25}
                      onClick={() => setIsVerifDeleteModalOpen(true)}
                    />
                  </div>

                  {isVerifDeleteModalOpen && (
                    <VerifDeleteModal
                      itemToDelete="shopping line"
                      idItem={sl.id}
                      isOpen={isVerifDeleteModalOpen}
                      onClose={() => setIsVerifDeleteModalOpen(false)}
                      onSubmit={handleDeleteShop}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
            No shopping lines yet.
          </div>
        )}
      </div>

      {isShopModalOpen && (
        <AddShoppingLine
          idTask={Number(id)}
          isOpen={isShopModalOpen}
          onClose={() => setIsShopModalOpen(false)}
        />
      )}
    </>
  );
};

export default ShoppingLines;

