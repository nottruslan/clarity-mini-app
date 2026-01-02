import { useState, useMemo } from 'react';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { type CoveyTask } from '../../utils/storage';
import QuadrantTaskItem from './QuadrantTaskItem';
import EmptyState from '../EmptyState';

interface QuadrantViewProps {
  quadrant: 'q1' | 'q2' | 'q3' | 'q4';
  storage: any;
  onEdit: (task: CoveyTask) => void;
  onCreateTask: (quadrant: 'q1' | 'q2' | 'q3' | 'q4') => void;
}

const quadrantInfo = {
  q1: {
    title: 'Важно и срочно',
    description: 'Дела, требующие немедленного внимания. Критические задачи и кризисы.',
    color: { bg: 'rgba(255, 87, 87, 0.1)', border: 'rgba(255, 87, 87, 0.3)' }
  },
  q2: {
    title: 'Важно, но не срочно',
    description: 'Стратегические задачи. Планирование, развитие, важные проекты. Фокус на этот квадрант!',
    color: { bg: 'rgba(76, 175, 80, 0.1)', border: 'rgba(76, 175, 80, 0.3)' }
  },
  q3: {
    title: 'Не важно, но срочно',
    description: 'Отвлекающие дела. Прерванные дела, некоторые звонки, неважные встречи.',
    color: { bg: 'rgba(255, 193, 7, 0.1)', border: 'rgba(255, 193, 7, 0.3)' }
  },
  q4: {
    title: 'Не важно и не срочно',
    description: 'Бесполезная деятельность. Пожиратели времени, лишняя активность.',
    color: { bg: 'rgba(158, 158, 158, 0.1)', border: 'rgba(158, 158, 158, 0.3)' }
  }
};

type StatusFilter = 'all' | 'active' | 'completed';

export default function QuadrantView({ quadrant, storage, onEdit, onCreateTask }: QuadrantViewProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const allTasks = storage.coveyMatrixData?.tasks || [];
  const completedTasks = storage.coveyMatrixData?.completedTasks || [];

  // Получаем все задачи квадранта (активные + выполненные)
  const quadrantTasks = useMemo(() => {
    const active = allTasks.filter((t: CoveyTask) => t.quadrant === quadrant && !t.completed);
    const completed = completedTasks.filter((t: CoveyTask) => t.quadrant === quadrant);
    return { active, completed, all: [...active, ...completed] };
  }, [allTasks, completedTasks, quadrant]);

  // Фильтруем по статусу
  const filteredTasks = useMemo(() => {
    switch (statusFilter) {
      case 'active':
        return quadrantTasks.active;
      case 'completed':
        return quadrantTasks.completed;
      default:
        return quadrantTasks.all;
    }
  }, [statusFilter, quadrantTasks]);

  // Сортируем по order
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a: CoveyTask, b: CoveyTask) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return (a.order || 0) - (b.order || 0);
    });
  }, [filteredTasks]);

  const info = quadrantInfo[quadrant];
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
    const overTaskId = over.id as string;

    // Проверяем, что это задача (не квадрант)
    const overTask = allTasks.find((t: CoveyTask) => t.id === overTaskId) || 
                     completedTasks.find((t: CoveyTask) => t.id === overTaskId);

    if (!overTask || overTask.quadrant !== quadrant) return;

    const task = allTasks.find((t: CoveyTask) => t.id === taskId) || 
                 completedTasks.find((t: CoveyTask) => t.id === taskId);

    if (!task || task.quadrant !== quadrant || task.id === overTask.id) return;

    // Сортируем только активные задачи квадранта
    const quadrantActiveTasks = allTasks
      .filter((t: CoveyTask) => t.quadrant === quadrant && !t.completed)
      .sort((a: CoveyTask, b: CoveyTask) => (a.order || 0) - (b.order || 0));

    // Если обе задачи активные, делаем сортировку
    if (!task.completed && !overTask.completed) {
      const fromIndex = quadrantActiveTasks.findIndex((t: CoveyTask) => t.id === taskId);
      const toIndex = quadrantActiveTasks.findIndex((t: CoveyTask) => t.id === overTaskId);

      if (fromIndex !== -1 && toIndex !== -1) {
        const newTasks = [...quadrantActiveTasks];
        const [removed] = newTasks.splice(fromIndex, 1);
        newTasks.splice(toIndex, 0, removed);

        // Обновляем order для всех задач в квадранте
        newTasks.forEach((t: CoveyTask, index: number) => {
          if (t.id === taskId || t.order !== index) {
            storage.updateCoveyTask(t.id, { order: index });
          }
        });
      }
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: info.color.bg
    }}>
      {/* Header с описанием и счетчиком */}
      <div style={{
        padding: '16px',
        borderBottom: `3px solid ${info.color.border}`,
        backgroundColor: 'var(--tg-theme-bg-color)'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          margin: '0 0 8px 0',
          color: 'var(--tg-theme-text-color)'
        }}>
          {info.title}
        </h2>
        <p style={{
          fontSize: '14px',
          color: 'var(--tg-theme-hint-color)',
          margin: '0 0 12px 0',
          lineHeight: '1.5'
        }}>
          {info.description}
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '12px'
        }}>
          <span style={{
            fontSize: '14px',
            color: 'var(--tg-theme-hint-color)',
            fontWeight: '500'
          }}>
            Задач: {quadrantTasks.active.length}
          </span>
          
          {/* Фильтр по статусу */}
          <div style={{
            display: 'flex',
            gap: '4px',
            backgroundColor: 'var(--tg-theme-secondary-bg-color)',
            borderRadius: '8px',
            padding: '2px'
          }}>
            <button
              onClick={() => setStatusFilter('all')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: statusFilter === 'all' 
                  ? 'var(--tg-theme-button-color)' 
                  : 'transparent',
                color: statusFilter === 'all'
                  ? 'var(--tg-theme-button-text-color)'
                  : 'var(--tg-theme-text-color)',
                fontSize: '12px',
                fontWeight: statusFilter === 'all' ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Все
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: statusFilter === 'active' 
                  ? 'var(--tg-theme-button-color)' 
                  : 'transparent',
                color: statusFilter === 'active'
                  ? 'var(--tg-theme-button-text-color)'
                  : 'var(--tg-theme-text-color)',
                fontSize: '12px',
                fontWeight: statusFilter === 'active' ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Активные
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: statusFilter === 'completed' 
                  ? 'var(--tg-theme-button-color)' 
                  : 'transparent',
                color: statusFilter === 'completed'
                  ? 'var(--tg-theme-button-text-color)'
                  : 'var(--tg-theme-text-color)',
                fontSize: '12px',
                fontWeight: statusFilter === 'completed' ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Выполненные
            </button>
          </div>
        </div>
      </div>

      {/* Список задач */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom))'
      }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {sortedTasks.length === 0 ? (
            <EmptyState
              message={
                statusFilter === 'active' 
                  ? 'Нет активных задач в этом квадранте'
                  : statusFilter === 'completed'
                  ? 'Нет выполненных задач в этом квадранте'
                  : 'Нет задач в этом квадранте'
              }
            />
          ) : (
            <SortableContext 
              items={sortedTasks.map((t: CoveyTask) => t.id)} 
              strategy={verticalListSortingStrategy}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sortedTasks.map((task: CoveyTask) => (
                  <QuadrantTaskItem
                    key={task.id}
                    task={task}
                    storage={storage}
                    onEdit={onEdit}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </DndContext>
      </div>

      {/* FAB кнопка */}
      <button
        onClick={() => onCreateTask(quadrant)}
        className="fab"
        style={{
          position: 'fixed',
          bottom: 'calc(20px + env(safe-area-inset-bottom))',
          right: '20px',
          zIndex: 10001
        }}
      >
        +
      </button>
    </div>
  );
}

