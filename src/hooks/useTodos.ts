import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Todo, FilterType, SortType } from '../types/todo';
import { generateId, validateTaskText } from '../utils/helpers';

interface UseTodosReturn {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: FilterType;
  sort: SortType;
  activeCount: number;
  completedCount: number;
  totalCount: number;
  addTodo: (text: string) => boolean;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: FilterType) => void;
  setSort: (sort: SortType) => void;
  clearCompleted: () => void;
  reorderTodos: (fromIndex: number, toIndex: number) => void;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos-app-data', []);
  const [filter, setFilter] = useLocalStorage<FilterType>('todos-app-filter', 'all');
  const [sort, setSort] = useLocalStorage<SortType>('todos-app-sort', 'newest');

  // Добавление задачи
  const addTodo = useCallback((text: string): boolean => {
    const validatedText = validateTaskText(text);
    if (!validatedText) return false;

    const newTodo: Todo = {
      id: generateId(),
      text: validatedText,
      completed: false,
      createdAt: Date.now(),
      order: 0,
    };

    setTodos((prev) => {
      // Новая задача получает минимальный order (будет первой)
      const minOrder = prev.length > 0 ? Math.min(...prev.map((t) => t.order)) - 1 : 0;
      return [{ ...newTodo, order: minOrder }, ...prev];
    });

    return true;
  }, [setTodos]);

  // Переключение статуса
  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, [setTodos]);

  // Удаление задачи
  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, [setTodos]);

  // Очистка завершенных
  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, [setTodos]);

  // Перестановка задач (Drag & Drop)
  const reorderTodos = useCallback((fromIndex: number, toIndex: number) => {
    setTodos((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      // Обновляем order для всех задач
      return updated.map((todo, index) => ({ ...todo, order: index }));
    });
  }, [setTodos]);

  // Мемоизированные счетчики
  const activeCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);
  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos]);
  const totalCount = todos.length;

  // Фильтрация + сортировка
  const filteredTodos = useMemo(() => {
    let result = [...todos];

    // Фильтрация
    switch (filter) {
      case 'active':
        result = result.filter((t) => !t.completed);
        break;
      case 'completed':
        result = result.filter((t) => t.completed);
        break;
    }

    // Сортировка
    switch (sort) {
      case 'newest':
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        result.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'manual':
        result.sort((a, b) => a.order - b.order);
        break;
    }

    return result;
  }, [todos, filter, sort]);

  return {
    todos,
    filteredTodos,
    filter,
    sort,
    activeCount,
    completedCount,
    totalCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
    setSort,
    clearCompleted,
    reorderTodos,
  };
}