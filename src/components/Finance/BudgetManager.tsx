import { useState } from 'react';
import { Budget, Category, Transaction } from '../../utils/storage';

interface BudgetManagerProps {
  budgets: Budget[];
  categories: Category[];
  transactions: Transaction[];
  onBudgetAdd: (budget: Budget) => void;
  onBudgetUpdate: (budget: Budget) => void;
  onBudgetDelete: (categoryId: string) => void;
  onClose: () => void;
}

export default function BudgetManager({
  budgets,
  categories,
  transactions,
  onBudgetAdd,
  onBudgetUpdate,
  onBudgetDelete,
  onClose
}: BudgetManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    limit: '',
    period: 'month' as 'month' | 'year'
  });

  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleSave = () => {
    const category = categories.find(c => c.id === formData.categoryId);
    if (!category || !formData.limit) return;

    const budget: Budget = {
      ...(editingBudget?.id && { id: editingBudget.id }),
      categoryId: formData.categoryId,
      categoryName: category.name,
      limit: parseFloat(formData.limit),
      period: formData.period
    };

    if (editingBudget) {
      onBudgetUpdate(budget);
    } else {
      onBudgetAdd(budget);
    }

    setFormData({ categoryId: '', limit: '', period: 'month' });
    setShowAddForm(false);
    setEditingBudget(null);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.categoryId,
      limit: budget.limit.toString(),
      period: budget.period
    });
    setShowAddForm(true);
  };

  const getBudgetSpent = (budget: Budget): number => {
    const now = new Date();
    const start = new Date();
    const end = new Date();

    if (budget.period === 'month') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
    } else {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
    }

    return transactions
      .filter(t => 
        t.category === budget.categoryName &&
        t.type === 'expense' &&
        t.date >= start.getTime() &&
        t.date <= end.getTime()
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

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
            Бюджет
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

        {!showAddForm ? (
          <>
            {budgets.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--tg-theme-hint-color)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
                <div style={{ marginBottom: '24px' }}>
                  У вас пока нет установленных бюджетов
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="tg-button"
                >
                  Добавить бюджет
                </button>
              </div>
            ) : (
              <>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  {budgets.map((budget) => {
                    const spent = getBudgetSpent(budget);
                    const percentage = (spent / budget.limit) * 100;
                    const isOver = spent > budget.limit;

                    return (
                      <div
                        key={budget.categoryId}
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                          border: isOver ? '2px solid #f44336' : '2px solid transparent'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px'
                        }}>
                          <div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              marginBottom: '4px'
                            }}>
                              {budget.categoryName}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: 'var(--tg-theme-hint-color)'
                            }}>
                              {budget.period === 'month' ? 'Месячный' : 'Годовой'} лимит
                            </div>
                          </div>
                          <div style={{
                            display: 'flex',
                            gap: '8px'
                          }}>
                            <button
                              onClick={() => handleEdit(budget)}
                              style={{
                                padding: '6px 12px',
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
                              onClick={() => onBudgetDelete(budget.categoryId)}
                              style={{
                                padding: '6px 12px',
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
                        <div style={{
                          marginBottom: '8px'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '14px',
                            marginBottom: '4px'
                          }}>
                            <span style={{
                              color: isOver ? '#f44336' : 'var(--tg-theme-text-color)'
                            }}>
                              {formatCurrency(spent)} / {formatCurrency(budget.limit)}
                            </span>
                            <span style={{
                              color: isOver ? '#f44336' : 'var(--tg-theme-hint-color)',
                              fontWeight: '600'
                            }}>
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                          <div style={{
                            width: '100%',
                            height: '8px',
                            backgroundColor: 'var(--tg-theme-bg-color)',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${Math.min(percentage, 100)}%`,
                              height: '100%',
                              backgroundColor: isOver ? '#f44336' : '#4caf50',
                              borderRadius: '4px',
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                        </div>
                        {isOver && (
                          <div style={{
                            fontSize: '12px',
                            color: '#f44336',
                            fontWeight: '600'
                          }}>
                            ⚠️ Превышен на {formatCurrency(spent - budget.limit)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="tg-button"
                  style={{ width: '100%' }}
                >
                  + Добавить бюджет
                </button>
              </>
            )}
          </>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Категория
              </div>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '2px solid var(--tg-theme-secondary-bg-color)',
                  backgroundColor: 'var(--tg-theme-bg-color)',
                  color: 'var(--tg-theme-text-color)',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                <option value="">Выберите категорию</option>
                {expenseCategories
                  .filter(c => !budgets.find(b => b.categoryId === c.id) || editingBudget?.categoryId === c.id)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Лимит (₽)
              </div>
              <input
                type="number"
                placeholder="Введите лимит"
                value={formData.limit}
                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '2px solid var(--tg-theme-secondary-bg-color)',
                  backgroundColor: 'var(--tg-theme-bg-color)',
                  color: 'var(--tg-theme-text-color)',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Период
              </div>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                {(['month', 'year'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setFormData({ ...formData, period })}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: `2px solid ${formData.period === period ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
                      backgroundColor: formData.period === period
                        ? 'rgba(51, 144, 236, 0.1)'
                        : 'var(--tg-theme-bg-color)',
                      color: 'var(--tg-theme-text-color)',
                      fontSize: '14px',
                      fontWeight: formData.period === period ? '600' : '500',
                      cursor: 'pointer'
                    }}
                  >
                    {period === 'month' ? 'Месяц' : 'Год'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingBudget(null);
                  setFormData({ categoryId: '', limit: '', period: 'month' });
                }}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: '2px solid var(--tg-theme-secondary-bg-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--tg-theme-text-color)',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minHeight: '44px'
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="tg-button"
                disabled={!formData.categoryId || !formData.limit}
                style={{
                  flex: 1
                }}
              >
                {editingBudget ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

