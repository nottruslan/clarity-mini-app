import { useState } from 'react';
import { Habit } from '../../utils/storage';
import EditHistoryModal from './EditHistoryModal';

interface HabitItemProps {
  habit: Habit;
  onCheck: (value?: number) => void;
  onUpdate: (updates: Partial<Habit>) => void;
  onHistoryUpdate: (history: Habit['history']) => void;
  onDelete: () => void;
  onOpenDetails: () => void;
  onOpenMenu: () => void;
  onEdit: () => void;
}

export default function HabitItem({ 
  habit, 
  onCheck, 
  onUpdate, 
  onHistoryUpdate, 
  onDelete,
  onOpenDetails,
  onOpenMenu,
  onEdit
}: HabitItemProps) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string>('');

  const today = new Date().toISOString().split('T')[0];
  const isTodayCompleted = habit.history[today]?.completed || false;



  return (
    <>
      <div
        className="list-item"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer'
        }}
        onClick={onOpenDetails}
      >
        {/* Иконка */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          flexShrink: 0
        }}>
          {habit.icon || '🔥'}
        </div>

        {/* Основная информация */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            minWidth: 0
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: '500',
              color: 'var(--tg-theme-text-color)',
              wordBreak: 'break-word'
            }}
          >
            {habit.name}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '12px',
            color: 'var(--tg-theme-hint-color)'
          }}>
            <span>
              🔥 {habit.streak} {habit.streak === 1 ? 'день' : habit.streak < 5 ? 'дня' : 'дней'}
            </span>
            {isTodayCompleted && (
              <span style={{ color: '#4caf50' }}>✓ Сегодня</span>
            )}
          </div>
        </div>

        {/* Упрощенный индикатор уровня */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: 'var(--tg-theme-hint-color)',
          flexShrink: 0
        }}>
          <span>LVL</span>
          <span style={{
            fontWeight: '600',
            color: 'var(--tg-theme-text-color)'
          }}>
            {habit.level || 1}
          </span>
        </div>

        {/* Кнопка меню */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenMenu();
          }}
          style={{
            padding: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            color: 'var(--tg-theme-hint-color)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ⋯
        </button>
      </div>

      {showHistoryModal && (
        <EditHistoryModal
          habit={habit}
          onSave={onHistoryUpdate}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedHistoryDate('');
          }}
          initialDate={selectedHistoryDate}
        />
      )}
    </>
  );
}
