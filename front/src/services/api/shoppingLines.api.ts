import type { Article } from "../../interfaces/article";
import type { Category } from "../../interfaces/category";
import type { ShoppingLine } from "../../interfaces/shopping_line";
import { api } from "../../utils/axios.client";

export class ShoppingLinesApi {
  static categories: Category[] = [
    {
      id: 1, name: "Matériaux",
      articles: []
    },
    {
      id: 2, name: "Plomberie",
      articles: []
    },
    {
      id: 3, name: "Électricité",
      articles: []
    },
    {
      id: 4, name: "Menuiserie",
      articles: []
    },
    {
      id: 5, name: "Isolation",
      articles: []
    },
  ];

  static async getAll(): Promise<ShoppingLine[]> {
    const { data } = await api.get<ShoppingLine[]>("/shopping-lines");
    return data;
  }

  static async getAllByTask(idTask: number): Promise<ShoppingLine[]> {
    const { data } = await api.get<ShoppingLine[]>(`/shopping-lines/task/${idTask}`);
    return data;
  }

  static async getById(id: number): Promise<ShoppingLine> {
    const { data } = await api.get<ShoppingLine>(`/shopping-lines/${id}`);
    return data;
  }

  static async create(shoppingLine: Omit<ShoppingLine, "id">): Promise<ShoppingLine> {
    const { data } = await api.post<ShoppingLine>("/shopping-lines", shoppingLine);
    return data;
  }

  static async updateShoppingLine(shoppingLine: ShoppingLine): Promise<ShoppingLine> {
    const { data } = await api.patch<ShoppingLine>(
      `/shopping-lines/${shoppingLine.id}`,
      shoppingLine
    );
    return data;
  }

  static async deleteShoppingLine(id: number): Promise<ShoppingLine> {
    const { data } = await api.delete<ShoppingLine>(`/shopping-lines/${id}`);
    return data;
  }

  // Categories et Articles restent en fake en attendant ton backend Articles
  static async getAllCategories(): Promise<Category[]> {
    return ShoppingLinesApi.categories;
  }

  static async getAllArticles(categoryId: number): Promise<Article[]> {
    const { data } = await api.get<Article[]>(`/articles?categoryId=${categoryId}`);
    return data;
  }
}