import { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCloudStorage } from '../../hooks/useCloudStorage';
import Quadrant from './Quadrant';
import { type CoveyTask } from '../../utils/storage';

interface CoveyMatrixViewProps {
  storage: ReturnType<typeof useCloudStorage>;
  onEdit: (task: CoveyTask) => void;
}

export default function CoveyMatrixView({ storage, onEdit }: CoveyMatrixViewProps) {
  const [showCompleted, setShowCompleted] = useState(false);

  const tasks = storage.coveyMatrixData?.tasks || [];
  const completedTasks = storage.coveyMatrixData?.completedTasks || [];

  // Группируем задачи по квадрантам
  const q1Tasks = tasks.filter((t: CoveyTask) => t.quadrant === 'q1' && !t.completed);
  const q2Tasks = tasks.filter((t: CoveyTask) => t.quadrant === 'q2' && !t.completed);
  const q3Tasks = tasks.filter((t: CoveyTask) => t.quadrant === 'q3' && !t.completed);
  const q4Tasks = tasks.filter((t: CoveyTask) => t.quadrant === 'q4' && !t.completed);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const overQuadrant = over.data.current?.quadrant as 'q1' | 'q2' | 'q3' | 'q4' | undefined;
    const overTaskId = over.id as string;
    const overTask = tasks.find((t: CoveyTask) => t.id === overTaskId);

    // Если перетащили на другой квадрант
    if (overQuadrant) {
      const task = tasks.find((t: CoveyTask) => t.id === taskId);
      if (task && task.quadrant !== overQuadrant) {
        storage.moveCoveyTask(taskId, overQuadrant);
      }
      return;
    }

    // Если перетащили на другую задачу (сортировка внутри квадранта)
    if (overTask) {
      const task = tasks.find((t: CoveyTask) => t.id === taskId);
      if (task && task.quadrant === overTask.quadrant && task.id !== overTask.id) {
        const quadrantTasks = tasks
          .filter((t: CoveyTask) => t.quadrant === task.quadrant && !t.completed)
          .sort((a: CoveyTask, b: CoveyTask) => (a.order || 0) - (b.order || 0));
        
        const fromIndex = quadrantTasks.findIndex((t: CoveyTask) => t.id === taskId);
        const toIndex = quadrantTasks.findIndex((t: CoveyTask) => t.id === overTaskId);

        if (fromIndex !== -1 && toIndex !== -1) {
          const newTasks = [...quadrantTasks];
          const [removed] = newTasks.splice(fromIndex, 1);
          newTasks.splice(toIndex, 0, removed);

          // Обновляем order для всех задач в квадранте
          newTasks.forEach((t, index) => {
            if (t.id === taskId || t.order !== index) {
              storage.updateCoveyTask(t.id, { order: index });
            }
          });
        }
      }
    }
  };

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* Матрица 2x2 */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '8px',
          padding: '12px',
          overflow: 'hidden'
        }}>
          <SortableContext items={q1Tasks.map((t: CoveyTask) => t.id)} strategy={verticalListSortingStrategy}>
            <Quadrant
              quadrant="q1"
              title="Важно и срочно"
              tasks={q1Tasks}
              storage={storage}
              onEdit={onEdit}
            />
          </SortableContext>
          
          <SortableContext items={q3Tasks.map((t: CoveyTask) => t.id)} strategy={verticalListSortingStrategy}>
            <Quadrant
              quadrant="q3"
              title="Не важно, но срочно"
              tasks={q3Tasks}
              storage={storage}
              onEdit={onEdit}
            />
          </SortableContext>
          
          <SortableContext items={q2Tasks.map((t: CoveyTask) => t.id)} strategy={verticalListSortingStrategy}>
            <Quadrant
              quadrant="q2"
              title="Важно, но не срочно"
              tasks={q2Tasks}
              storage={storage}
              onEdit={onEdit}
            />
          </SortableContext>
          
          <SortableContext items={q4Tasks.map((t: CoveyTask) => t.id)} strategy={verticalListSortingStrategy}>
            <Quadrant
              quadrant="q4"
              title="Не важно и не срочно"
              tasks={q4Tasks}
              storage={storage}
              onEdit={onEdit}
            />
          </SortableContext>
        </div>

        {/* Секция выполненных задач */}
        {completedTasks.length > 0 && (
          <div style={{
            borderTop: '1px solid var(--tg-theme-secondary-bg-color)',
            padding: '12px',
            backgroundColor: 'var(--tg-theme-secondary-bg-color)',
            maxHeight: showCompleted ? '200px' : 'auto',
            overflow: showCompleted ? 'auto' : 'hidden'
          }}>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              style={{
                width: '100%',
                padding: '8px',
                border: 'none',
                background: 'transparent',
                color: 'var(--tg-theme-text-color)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>Выполненные задачи ({completedTasks.length})</span>
              <span>{showCompleted ? '▼' : '▶'}</span>
            </button>
            {showCompleted && (
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {completedTasks.map((task: CoveyTask) => (
                  <div
                    key={task.id}
                    style={{
                      padding: '8px',
                      fontSize: '14px',
                      color: 'var(--tg-theme-hint-color)',
                      textDecoration: 'line-through'
                    }}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DndContext>
    </div>
  );
}

