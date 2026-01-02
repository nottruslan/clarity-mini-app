import { useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { type CoveyTask } from '../../utils/storage';
import QuadrantTaskItem from './QuadrantTaskItem';
import QuadrantTooltip from './QuadrantTooltip';

interface QuadrantProps {
  quadrant: 'q1' | 'q2' | 'q3' | 'q4';
  title: string;
  tasks: CoveyTask[];
  storage: any;
  onEdit?: (task: CoveyTask) => void;
}

const quadrantColors = {
  q1: { bg: 'rgba(255, 87, 87, 0.1)', border: 'rgba(255, 87, 87, 0.3)' },
  q2: { bg: 'rgba(76, 175, 80, 0.1)', border: 'rgba(76, 175, 80, 0.3)' },
  q3: { bg: 'rgba(255, 193, 7, 0.1)', border: 'rgba(255, 193, 7, 0.3)' },
  q4: { bg: 'rgba(158, 158, 158, 0.1)', border: 'rgba(158, 158, 158, 0.3)' }
};

const quadrantDescriptions = {
  q1: 'Дела, требующие немедленного внимания. Критические задачи и кризисы.',
  q2: 'Стратегические задачи. Планирование, развитие, важные проекты. Фокус на этот квадрант!',
  q3: 'Отвлекающие дела. Прерванные дела, некоторые звонки, неважные встречи.',
  q4: 'Бесполезная деятельность. Пожиратели времени, лишняя активность.'
};

export default function Quadrant({ quadrant, title, tasks, storage, onEdit }: QuadrantProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: `quadrant-${quadrant}`,
    data: {
      quadrant
    }
  });

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [tasks]);

  const colors = quadrantColors[quadrant];

  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isOver ? `${colors.bg}CC` : colors.bg,
        borderLeft: `3px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '12px',
        minHeight: '150px',
        transition: 'background-color 0.2s',
        overflow: 'hidden'
      }}
    >
      {/* Заголовок с tooltip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h3
          onClick={() => setShowTooltip(true)}
          style={{
            fontSize: '14px',
            fontWeight: '600',
            margin: 0,
            cursor: 'pointer',
            flex: 1,
            lineHeight: '1.3'
          }}
        >
          {title}
        </h3>
        <span style={{
          fontSize: '12px',
          color: 'var(--tg-theme-hint-color)',
          marginLeft: '8px',
          flexShrink: 0
        }}>
          {tasks.length}
        </span>
      </div>

      {/* Список задач */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {sortedTasks.length === 0 ? (
          <div style={{
            fontSize: '12px',
            color: 'var(--tg-theme-hint-color)',
            textAlign: 'center',
            padding: '16px 8px',
            fontStyle: 'italic'
          }}>
            {quadrantDescriptions[quadrant]}
          </div>
        ) : (
          <SortableContext items={sortedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {sortedTasks.map(task => (
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
      </div>

      {showTooltip && (
        <QuadrantTooltip
          quadrant={quadrant}
          title={title}
          description={quadrantDescriptions[quadrant]}
          onClose={() => setShowTooltip(false)}
        />
      )}
    </div>
  );
}

