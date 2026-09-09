import type { Category } from "./category";

export interface Article {
  id: number;
  name: string;
  category?: Category;
  category_id: number;
}
