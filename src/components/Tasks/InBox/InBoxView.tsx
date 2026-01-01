import { useState } from 'react';
import { Task } from '../../../utils/storage';
import InBoxItem from './InBoxItem';

interface InBoxViewProps {
  tasks: Task[];
  onTaskEdit: (id: string, text: string) => void;
  onTaskDelete: (id: string) => void;
}

export default function InBoxView({
  tasks,
  onTaskEdit,
  onTaskDelete
}: InBoxViewProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const sortedTasks = [...tasks].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
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
                InBox
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
                  Здесь отображаются задачи без дат и времени.
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

