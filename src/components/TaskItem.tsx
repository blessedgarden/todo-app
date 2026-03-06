import { useState, useCallback, useRef, memo, type DragEvent } from 'react';
import { Todo } from '../types/todo';
import { formatDate } from '../utils/helpers';

interface TaskItemProps {
  todo: Todo;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd: () => void;
  isDragEnabled: boolean;
}

export const TaskItem = memo(function TaskItem({
  todo,
  index,
  onToggle,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragEnabled,
}: TaskItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleDelete = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onDelete(todo.id), 300);
  }, [onDelete, todo.id]);

  const handleToggle = useCallback(() => {
    if (!todo.completed) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 400);
    }
    onToggle(todo.id);
  }, [onToggle, todo.id, todo.completed]);

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(true);
      onDragOver(e, index);
    },
    [onDragOver, index]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragOver(false);
    onDragEnd();
  }, [onDragEnd]);

  return (
    <div
      ref={itemRef}
      draggable={isDragEnabled}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragEnd}
      className={`
        group flex items-center gap-4 px-5 py-4 rounded-2xl
        transition-all duration-200
        ${isExiting ? 'task-exit' : 'task-enter'}
        ${isDragEnabled ? 'cursor-grab active:cursor-grabbing' : ''}
      `}
      style={{
        background: 'var(--bg-secondary)',
        border: `1px solid ${isDragOver ? 'var(--accent)' : 'var(--border-color)'}`,
        boxShadow: isDragOver ? 'var(--shadow-lg)' : 'var(--shadow)',
        opacity: todo.completed ? 0.7 : 1,
        animationDelay: `${index * 50}ms`,
        borderTopWidth: isDragOver ? '3px' : '1px',
        borderTopColor: isDragOver ? 'var(--accent)' : 'var(--border-color)',
      }}
    >
      {/* Drag handle */}
      {isDragEnabled && (
        <div
          className="
            flex flex-col gap-0.5 opacity-0 group-hover:opacity-40
            transition-opacity duration-200 shrink-0
          "
          style={{ color: 'var(--text-tertiary)' }}
        >
          <div className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full" style={{ background: 'currentColor' }} />
            <span className="w-1 h-1 rounded-full" style={{ background: 'currentColor' }} />
          </div>
          <div className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full" style={{ background: 'currentColor' }} />
            <span className="w-1 h-1 rounded-full" style={{ background: 'currentColor' }} />
          </div>
          <div className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full" style={{ background: 'currentColor' }} />
            <span className="w-1 h-1 rounded-full" style={{ background: 'currentColor' }} />
          </div>
        </div>
      )}

      {/* Кастомный чекбокс */}
      <button
        onClick={handleToggle}
        aria-label={todo.completed ? 'Отметить как невыполненное' : 'Отметить как выполненное'}
        className="
          shrink-0 w-6 h-6 rounded-full
          flex items-center justify-center
          cursor-pointer
          transition-all duration-200
          hover:scale-110
        "
        style={{
          border: `2px solid ${todo.completed ? 'var(--success)' : 'var(--border-color)'}`,
          background: todo.completed ? 'var(--success)' : 'transparent',
        }}
      >
        {todo.completed && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={justCompleted ? 'checkmark-animate' : ''}
          >
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Текст и дата */}
      <div className="flex-1 min-w-0">
        <p
          className="text-base leading-snug break-words transition-all duration-300"
          style={{
            color: todo.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
            textDecoration: todo.completed ? 'line-through' : 'none',
          }}
        >
          {todo.text}
        </p>
        <p
          className="text-xs mt-1 font-medium"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {formatDate(todo.createdAt)}
        </p>
      </div>

      {/* Кнопка удаления */}
      <button
        onClick={handleDelete}
        aria-label="Удалить задачу"
        className="
          shrink-0 w-9 h-9 rounded-xl
          flex items-center justify-center
          cursor-pointer
          opacity-0 group-hover:opacity-100
          transition-all duration-200
          hover:scale-110 active:scale-90
        "
        style={{
          background: 'transparent',
          color: 'var(--danger)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 4L12 12M12 4L4 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
});