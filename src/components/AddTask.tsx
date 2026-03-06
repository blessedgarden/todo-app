import { useState, useCallback, useRef, type KeyboardEvent, type FormEvent } from 'react';

interface AddTaskProps {
  onAdd: (text: string) => boolean;
}

export function AddTask({ onAdd }: AddTaskProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerShake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }, []);

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();

      const trimmed = text.trim();

      if (!trimmed) {
        setError('Введите текст задачи');
        triggerShake();
        inputRef.current?.focus();
        return;
      }

      if (trimmed.length > 200) {
        setError('Максимум 200 символов');
        triggerShake();
        return;
      }

      const success = onAdd(trimmed);
      if (success) {
        setText('');
        setError(null);
        inputRef.current?.focus();
      }
    },
    [text, onAdd, triggerShake]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (error) setError(null);
  }, [error]);

  return (
    <div className="fade-in mb-6">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Что нужно сделать?"
            maxLength={200}
            autoComplete="off"
            className="
              w-full px-5 py-4 rounded-2xl text-base
              outline-none
              placeholder:opacity-50
              transition-all duration-200
            "
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: `2px solid ${error ? 'var(--danger)' : 'var(--border-color)'}`,
              boxShadow: 'var(--shadow)',
              animation: isShaking ? 'shake 0.5s ease-in-out' : 'none',
            }}
          />
          {text.length > 0 && (
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono"
              style={{
                color: text.trim().length > 180 ? 'var(--danger)' : 'var(--text-tertiary)',
              }}
            >
              {text.trim().length}/200
            </span>
          )}
        </div>
        <button
          type="submit"
          aria-label="Добавить задачу"
          className="
            px-6 py-4 rounded-2xl
            font-semibold text-white text-base
            cursor-pointer
            hover:scale-105 active:scale-95
            transition-all duration-200
            flex items-center gap-2
            shrink-0
          "
          style={{
            background: 'var(--accent)',
            boxShadow: 'var(--shadow)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--accent)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">Добавить</span>
        </button>
      </form>

      {/* Ошибка валидации */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: error ? '40px' : '0',
          opacity: error ? 1 : 0,
        }}
      >
        <p
          className="text-sm mt-2 ml-2 font-medium"
          style={{ color: 'var(--danger)' }}
        >
          ⚠ {error}
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}