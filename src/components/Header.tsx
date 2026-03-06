import { ThemeToggle } from './ThemeToggle';
import { pluralize } from '../utils/helpers';

interface HeaderProps {
  activeCount: number;
  totalCount: number;
}

export function Header({ activeCount, totalCount }: HeaderProps) {
  return (
    <header className="fade-in flex items-center justify-between mb-8">
      <div>
        <h1
          className="text-4xl font-extrabold tracking-tight mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          <span style={{ color: 'var(--accent)' }}>✦</span> Мои задачи
        </h1>
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {totalCount === 0 ? (
            'Нет задач — время отдыхать 🎉'
          ) : (
            <>
              {activeCount > 0 ? (
                <>
                  <span style={{ color: 'var(--accent)' }} className="font-bold">
                    {activeCount}
                  </span>
                  {' '}
                  {pluralize(activeCount, 'задача', 'задачи', 'задач')} осталось
                </>
              ) : (
                <span style={{ color: 'var(--success)' }}>
                  Все задачи выполнены! 🎯
                </span>
              )}
              <span className="mx-2">·</span>
              <span>всего {totalCount}</span>
            </>
          )}
        </p>
      </div>
      <ThemeToggle />
    </header>
  );
}