import { useState, useEffect, useCallback } from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('todo-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('todo-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = useCallback(() => setIsDark((prev) => !prev), []);

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      title={isDark ? 'Светлая тема' : 'Тёмная тема'}
      style={{
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        boxShadow: 'var(--shadow)',
      }}
      className="
        relative w-14 h-14 rounded-2xl
        flex items-center justify-center
        cursor-pointer
        hover:scale-110 active:scale-95
        transition-transform duration-200
        text-2xl
      "
    >
      <span
        className="transition-transform duration-500"
        style={{
          display: 'inline-block',
          transform: isDark ? 'rotate(360deg)' : 'rotate(0deg)',
        }}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}