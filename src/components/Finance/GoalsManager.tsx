import { useState } from 'react';
import { Goal, generateId } from '../../utils/storage';
import GradientButton from '../Wizard/GradientButton';

interface GoalsManagerProps {
  goals: Goal[];
  onAdd: (goal: Goal) => void;
  onUpdate: (id: string, updates: Partial<Goal>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function GoalsManager({
  goals,
  onAdd,
  onUpdate,
  onDelete,
  onClose
}: GoalsManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
    icon: '🎯',
    description: ''
  });

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.targetAmount) return;

    const goal: Goal = {
      id: editingGoal?.id || generateId(),
      name: formData.name.trim(),
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline ? new Date(formData.deadline).getTime() : undefined,
      icon: formData.icon || '🎯',
      description: formData.description.trim() || undefined,
      createdAt: editingGoal?.createdAt || Date.now()
    };

    if (editingGoal) {
      onUpdate(goal.id, goal);
    } else {
      onAdd(goal);
    }

    setShowAddForm(false);
    setEditingGoal(null);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '0',
      deadline: '',
      icon: '🎯',
      description: ''
    });
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
      icon: goal.icon || '🎯',
      description: goal.description || ''
    });
    setShowAddForm(true);
  };

  const icons = ['🎯', '💰', '🏠', '🚗', '✈️', '💍', '📱', '💻', '🎓', '🏥', '🎁', '🎮'];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'var(--tg-theme-bg-color)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        padding: '20px',
        paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
        maxHeight: '80vh',
        overflowY: 'auto' as const,
        WebkitOverflowScrolling: 'touch' as any
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600'
          }}>
            Финансовые цели
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'var(--tg-theme-secondary-bg-color)',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {!showAddForm ? (
          <>
            {goals.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--tg-theme-hint-color)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
                <p>У вас пока нет финансовых целей</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                  Создайте первую цель для отслеживания накоплений
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {goals.map(goal => (
                  <div
                    key={goal.id}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span style={{ fontSize: '20px' }}>{goal.icon || '🎯'}</span>
                        <span style={{ fontSize: '16px', fontWeight: '600' }}>{goal.name}</span>
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)' }}>
                        {goal.currentAmount.toLocaleString('ru-RU')} / {goal.targetAmount.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(goal)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--tg-theme-button-color)',
                          backgroundColor: 'transparent',
                          color: 'var(--tg-theme-button-color)',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Удалить цель "${goal.name}"?`)) {
                            onDelete(goal.id);
                          }
                        }}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#f44336',
                          color: 'white',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <GradientButton onClick={() => setShowAddForm(true)}>
              + Создать цель
            </GradientButton>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                Иконка:
              </label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '12px'
              }}>
                {icons.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setFormData({ ...formData, icon })}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      border: formData.icon === icon ? '2px solid var(--tg-theme-button-color)' : '1px solid var(--tg-theme-secondary-bg-color)',
                      backgroundColor: formData.icon === icon ? 'rgba(51, 144, 236, 0.1)' : 'transparent',
                      fontSize: '20px',
                      cursor: 'pointer'
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                Название цели:
              </label>
              <input
                type="text"
                className="wizard-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: Новая машина"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                Целевая сумма (₽):
              </label>
              <input
                type="number"
                className="wizard-input"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                placeholder="1000000"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                Текущая сумма (₽):
              </label>
              <input
                type="number"
                className="wizard-input"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                Срок (опционально):
              </label>
              <input
                type="date"
                className="wizard-input"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                Описание (опционально):
              </label>
              <textarea
                className="wizard-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Дополнительная информация о цели"
                rows={3}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <GradientButton
                onClick={handleSubmit}
                disabled={!formData.name.trim() || !formData.targetAmount}
              >
                {editingGoal ? 'Сохранить' : 'Создать'}
              </GradientButton>
              <GradientButton
                variant="secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingGoal(null);
                  setFormData({
                    name: '',
                    targetAmount: '',
                    currentAmount: '0',
                    deadline: '',
                    icon: '🎯',
                    description: ''
                  });
                }}
              >
                Отмена
              </GradientButton>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

