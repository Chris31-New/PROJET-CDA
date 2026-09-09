import type { Article } from "./article";

export interface Category {
  id: number;
  name: string;
  articles: Article[];
}
