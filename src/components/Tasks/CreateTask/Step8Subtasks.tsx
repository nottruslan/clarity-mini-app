import { useState, useRef } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';
import { Subtask, generateId } from '../../../utils/storage';

interface Step8SubtasksProps {
  onNext: (subtasks: Subtask[]) => void;
  onBack: () => void;
}

export default function Step8Subtasks({ onNext, onBack }: Step8SubtasksProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddSubtask = () => {
    const trimmed = newSubtaskText.trim();
    if (trimmed) {
      const newSubtask: Subtask = {
        id: generateId(),
        text: trimmed,
        completed: false
      };
      setSubtasks(prev => [...prev, newSubtask]);
      setNewSubtaskText('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(prev =>
      prev.map(subtask =>
        subtask.id === id
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      )
    );
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(subtask => subtask.id !== id));
  };

  const handleNext = () => {
    inputRef.current?.blur();
    onNext(subtasks);
  };

  return (
    <WizardSlide
      icon="✓"
      title="Подзадачи"
      description="Добавьте подзадачи (чек-лист) (необязательно)"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton
            variant="secondary"
            onClick={onBack}
          >
            Назад
          </GradientButton>
          <GradientButton
            onClick={handleNext}
          >
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        {/* Добавление новой подзадачи */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Название подзадачи"
            value={newSubtaskText}
            onChange={(e) => setNewSubtaskText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddSubtask();
              }
            }}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid var(--tg-theme-secondary-bg-color)',
              backgroundColor: 'var(--tg-theme-bg-color)',
              color: 'var(--tg-theme-text-color)',
              fontSize: '16px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleAddSubtask}
            disabled={!newSubtaskText.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              background: newSubtaskText.trim()
                ? 'var(--tg-theme-button-color)'
                : 'var(--tg-theme-secondary-bg-color)',
              color: newSubtaskText.trim()
                ? 'var(--tg-theme-button-text-color)'
                : 'var(--tg-theme-hint-color)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: newSubtaskText.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Добавить
          </button>
        </div>

        {/* Список подзадач */}
        {subtasks.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '300px',
            overflowY: 'auto' as const
          }}>
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--tg-theme-secondary-bg-color)'
                }}
              >
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => handleToggleSubtask(subtask.id)}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    textDecoration: subtask.completed ? 'line-through' : 'none',
                    opacity: subtask.completed ? 0.6 : 1,
                    color: 'var(--tg-theme-text-color)'
                  }}
                >
                  {subtask.text}
                </span>
                <button
                  onClick={() => handleDeleteSubtask(subtask.id)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--tg-theme-destructive-text-color)',
                    color: '#ffffff',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </WizardSlide>
  );
}

