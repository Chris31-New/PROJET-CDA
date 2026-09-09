import { IoIosClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import {
  useCreateShoppingLine,
  useGetCategories,
  useGetArticlesByCategory,
} from "../hooks/use-shoppingLine.service";
import { useEffect, useState } from "react";
import type { Article } from "../interfaces/article";

type FormData = {
  category_id: number | null;
  article_id: number | null;
  quantity: number;
  unit_price: number;
};

const EMPTY_FORM: FormData = {
  category_id: null,
  article_id: null,
  quantity: 0,
  unit_price: 0,
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  idTask: number;
}

const AddShoppingLine = ({ isOpen, idTask, onClose }: ModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: EMPTY_FORM,
  });
  console.log("🚀 ~ AddShoppingLine ~ errors:", errors);

  const selectedCategory = watch("category_id");
  const selectedArticle = watch("article_id");

  const createShopMutation = useCreateShoppingLine();

  const { data: categories } = useGetCategories();

  const [articles, setArticles] = useState<Article[] | undefined>([]);

  const { data: fetchedArticles } = useGetArticlesByCategory(selectedCategory!);

  useEffect(() => {
    if (selectedCategory && fetchedArticles) {
      setArticles(fetchedArticles);
    } else {
      setArticles([]);
    }
  }, [selectedCategory, fetchedArticles]);

  const handleFormSubmit = (data: FormData) => {
    const dataToCreate = {
      article_id: Number(data.article_id)!,
      task_id: idTask,
      quantity: Number(data.quantity),
      unit_price: Number(data.unit_price),
    };

    createShopMutation.mutate(dataToCreate, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-4xl h-[80vh] overflow-y-auto">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          <IoIosClose size={22} />
        </button>

        <h1 className="text-3xl text-center font-bold mt-4 mb-6">
          New Shopping line
        </h1>

        <form
          className="w-full flex flex-col items-center gap-6 p-6"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          {/* CATEGORY */}
          <div className="w-full flex flex-col items-start">
            <label>Choose Category</label>

            <select
              className="select select-bordered w-full"
              {...register("category_id", { required: true })}
            >
              <option value=""></option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* ARTICLE */}
          {selectedCategory && (
            <div className="w-full flex flex-col items-start">
              <label>Choose Article</label>

              <select
                className="select select-bordered w-full"
                {...register("article_id", { required: true })}
              >
                <option value=""></option>
                {articles?.map((article) => (
                  <option key={article.id} value={article.id}>
                    {article.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* UNIT PRICE */}
          {selectedArticle && (
            <div className="w-full flex flex-col items-start">
              <label>Unit price</label>

              <input
                type="number"
                className="input input-bordered w-full"
                {...register("unit_price", { required: true })}
              />
            </div>
          )}

          {/* QUANTITY */}
          {selectedArticle && (
            <div className="w-full flex flex-col items-start">
              <label>Quantity</label>

              <input
                type="number"
                className="input input-bordered w-full"
                {...register("quantity", { required: true })}
              />
            </div>
          )}

          <button
            type="submit"
            className="px-6 py-2 mt-4 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-500 transition-colors"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddShoppingLine;
