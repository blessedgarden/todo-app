import { useCallback } from 'react';
import { FilterType, SortType } from '../types/todo';

interface FilterBarProps {
  filter: FilterType;
  sort: SortType;
  activeCount: number;
  completedCount: number;
  totalCount: number;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (sort: SortType) => void;
  onClearCompleted: () => void;
}

const FILTERS: { value: FilterType; label: string; icon: string }[] = [
  { value: 'all', label: 'Все', icon: '📋' },
  { value: 'active', label: 'Активные', icon: '🔵' },
  { value: 'completed', label: 'Готовые', icon: '✅' },
];

const SORTS: { value: SortType; label: string }[] = [
  { value: 'newest', label: '↓ Новые' },
  { value: 'oldest', label: '↑ Старые' },
  { value: 'manual', label: '✋ Вручную' },
];

export function FilterBar({
  filter,
  sort,
  completedCount,
  totalCount,
  onFilterChange,
  onSortChange,
  onClearCompleted,
}: FilterBarProps) {
  const getCount = useCallback(
    (f: FilterType) => {
      switch (f) {
        case 'all': return totalCount;
        case 'active': return totalCount - completedCount;
        case 'completed': return completedCount;
      }
    },
    [totalCount, completedCount]
  );

  if (totalCount === 0) return null;

  return (
    <div className="fade-in mb-4 space-y-3">
      {/* Фильтры */}
      <div
        className="flex items-center gap-1 p-1.5 rounded-2xl"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow)',
        }}
      >
        {FILTERS.map(({ value, label, icon }) => {
          const isActive = filter === value;
          const count = getCount(value);
          return (
            <button
              key={value}
              onClick={() => onFilterChange(value)}
              className="
                flex-1 py-2.5 px-3 rounded-xl
                text-sm font-semibold
                cursor-pointer
                transition-all duration-200
                flex items-center justify-center gap-1.5
              "
              style={{
                background: isActive ? 'var(--accent)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: isActive ? 'var(--shadow)' : 'none',
                transform: isActive ? 'scale(1)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span className="text-xs">{icon}</span>
              <span>{label}</span>
              <span
                className="
                  text-xs px-1.5 py-0.5 rounded-full
                  font-bold min-w-[20px] text-center
                "
                style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--bg-tertiary)',
                  color: isActive ? '#ffffff' : 'var(--text-tertiary)',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Сортировка + очистить */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1">
          <span
            className="text-xs font-medium mr-1"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Сортировка:
          </span>
          {SORTS.map(({ value, label }) => {
            const isActive = sort === value;
            return (
              <button
                key={value}
                onClick={() => onSortChange(value)}
                className="
                  px-3 py-1.5 rounded-lg
                  text-xs font-semibold
                  cursor-pointer
                  transition-all duration-200
                "
                style={{
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
                  border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="
              px-3 py-1.5 rounded-lg
              text-xs font-semibold
              cursor-pointer
              transition-all duration-200
            "
            style={{
              color: 'var(--danger)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            🗑 Очистить готовые ({completedCount})
          </button>
        )}
      </div>
    </div>
  );
}