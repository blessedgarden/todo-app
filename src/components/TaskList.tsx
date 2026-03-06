import { useCallback, useRef, type DragEvent } from 'react';
import { Todo, SortType } from '../types/todo';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  todos: Todo[];
  sort: SortType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function TaskList({ todos, sort, onToggle, onDelete, onReorder }: TaskListProps) {
  const dragIndexRef = useRef<number | null>(null);
  const isDragEnabled = sort === 'manual';

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>, index: number) => {
      dragIndexRef.current = index;
      e.dataTransfer.effectAllowed = 'move';
      // Делаем элемент полупрозрачным
      const target = e.currentTarget;
      setTimeout(() => {
        target.style.opacity = '0.4';
        target.style.transform = 'scale(1.02)';
      }, 0);
    },
    []
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      const from = dragIndexRef.current;
      if (from === null || from === index) return;

      onReorder(from, index);
      dragIndexRef.current = index;
    },
    [onReorder]
  );

  const handleDragEnd = useCallback(() => {
    dragIndexRef.current = null;
    // Убираем стили — React перерисует
  }, []);

  // Пустое состояние
  if (todos.length === 0) {
    return (
      <div
        className="fade-in text-center py-16 rounded-2xl"
        style={{
          background: 'var(--bg-secondary)',
          border: '2px dashed var(--border-color)',
        }}
      >
        <div className="text-5xl mb-4">
          {sort === 'manual' ? '✋' : '📝'}
        </div>
        <p
          className="text-lg font-semibold mb-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          Здесь пока пусто
        </p>
        <p
          className="text-sm"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Добавьте свою первую задачу выше
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {isDragEnabled && (
        <p
          className="text-xs font-medium text-center py-2 rounded-xl mb-1"
          style={{
            color: 'var(--accent)',
            background: 'var(--accent-light)',
          }}
        >
          ✋ Перетаскивайте задачи для изменения порядка
        </p>
      )}
      {todos.map((todo, index) => (
        <TaskItem
          key={todo.id}
          todo={todo}
          index={index}
          onToggle={onToggle}
          onDelete={onDelete}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          isDragEnabled={isDragEnabled}
        />
      ))}
    </div>
  );
}