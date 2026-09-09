import type { Article } from "./article";
import type { Task } from "./task";

export interface ShoppingLine {
  id: number;
  article?: Article;
  article_id?: number;
  task?: Task;
  task_id?: number;
  unit_price: number;
  quantity: number;
}
