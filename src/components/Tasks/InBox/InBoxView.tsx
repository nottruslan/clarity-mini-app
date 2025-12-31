import { useState, useRef } from 'react';
import { Task, generateId } from '../../../utils/storage';
import InBoxItem from './InBoxItem';

interface InBoxViewProps {
  tasks: Task[];
  onTaskAdd: (task: Task) => void;
  onTaskEdit: (id: string, text: string) => void;
  onTaskDelete: (id: string) => void;
  onTaskMove: (id: string) => void;
}

export default function InBoxView({
  tasks,
  onTaskAdd,
  onTaskEdit,
  onTaskDelete,
  onTaskMove
}: InBoxViewProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTask = () => {
    const trimmed = newTaskText.trim();
    if (trimmed) {
      const newTask: Task = {
        id: generateId(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
        status: 'todo'
        // Без dueDate и startTime - это задачи InBox
      };
      onTaskAdd(newTask);
      setNewTaskText('');
      // Фокус обратно на input после добавления
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Инлайн-редактор для быстрого добавления */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
        backgroundColor: 'var(--tg-theme-bg-color)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end'
        }}>
          <input
            ref={inputRef}
            type="text"
            className="wizard-input"
            placeholder="Быстрая задача..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              marginTop: 0,
              fontSize: '16px'
            }}
          />
          <button
            onClick={handleAddTask}
            disabled={!newTaskText.trim()}
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              border: 'none',
              background: newTaskText.trim()
                ? 'var(--tg-theme-button-color)'
                : 'var(--tg-theme-secondary-bg-color)',
              color: newTaskText.trim()
                ? 'var(--tg-theme-button-text-color)'
                : 'var(--tg-theme-hint-color)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: newTaskText.trim() ? 'pointer' : 'not-allowed',
              whiteSpace: 'nowrap'
            }}
          >
            Добавить
          </button>
        </div>
      </div>

      {/* Список задач */}
      <div style={{
        flex: 1,
        overflowY: 'auto' as const,
        WebkitOverflowScrolling: 'touch' as any
      }}>
        {sortedTasks.length === 0 ? (
          <div style={{
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '24px'
          }}>
            <div style={{
              fontSize: '64px',
              color: 'var(--tg-theme-hint-color)',
              opacity: 0.6
            }}>
              📥
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxWidth: '320px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'var(--tg-theme-text-color)',
                margin: 0
              }}>
                InBox — быстрые задачи
              </h3>
              <div style={{
                fontSize: '15px',
                color: 'var(--tg-theme-hint-color)',
                lineHeight: '1.6',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--tg-theme-text-color)' }}>📥 InBox</strong> — пиши быстрые задачи без лишних шагов. Просто введи текст и нажми Enter.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--tg-theme-text-color)' }}>📋 Список</strong> — когда будет время, добавь задачу в список и отредактируй её (приоритет, дату, категорию).
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--tg-theme-text-color)' }}>📅 День</strong> — размести задачу в календаре на конкретный день и время.
                </p>
                <p style={{ margin: 0, marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--tg-theme-secondary-bg-color)' }}>
                  <strong style={{ color: 'var(--tg-theme-text-color)' }}>💡 Подсказка:</strong> Чтобы удалить задачу, проведи по ней пальцем влево.
                </p>
              </div>
            </div>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <InBoxItem
              key={task.id}
              task={task}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
              onMove={onTaskMove}
              isEditing={editingTaskId === task.id}
              onStartEdit={setEditingTaskId}
              onCancelEdit={() => setEditingTaskId(null)}
            />
          ))
        )}
      </div>
    </div>
  );
}

