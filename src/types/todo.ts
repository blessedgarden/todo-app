export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  order: number;
}

export type FilterType = 'all' | 'active' | 'completed';

export type SortType = 'newest' | 'oldest' | 'manual';

export interface TodoState {
  todos: Todo[];
  filter: FilterType;
  sort: SortType;
}