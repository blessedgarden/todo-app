import { Header } from './components/Header';
import { AddTask } from './components/AddTask';
import { FilterBar } from './components/FilterBar';
import { TaskList } from './components/TaskList';
import { useTodos } from './hooks/useTodos';

function App() {
  const {
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
  } = useTodos();

  return (
    <div className="min-h-screen py-8 px-4 sm:py-12">
      <div className="max-w-xl mx-auto">
        <Header activeCount={activeCount} totalCount={totalCount} />

        <AddTask onAdd={addTodo} />

        <FilterBar
          filter={filter}
          sort={sort}
          activeCount={activeCount}
          completedCount={completedCount}
          totalCount={totalCount}
          onFilterChange={setFilter}
          onSortChange={setSort}
          onClearCompleted={clearCompleted}
        />

        <TaskList
          todos={filteredTodos}
          sort={sort}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onReorder={reorderTodos}
        />

        {/* Футер */}
        {totalCount > 0 && (
          <footer
            className="fade-in text-center mt-8 text-xs font-medium"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <p>Дважды проверяйте список — продуктивность начинается с порядка 🚀</p>
          </footer>
        )}
      </div>
    </div>
  );
}

export default App;