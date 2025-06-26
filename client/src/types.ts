export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  trashed: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
