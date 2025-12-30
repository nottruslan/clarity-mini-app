import { useState, useEffect } from 'react';
import { Category } from '../../utils/storage';

export interface FilterOptions {
  type?: 'income' | 'expense' | 'all';
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

interface TransactionFiltersProps {
  categories: Category[];
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClose: () => void;
}

export default function TransactionFilters({
  categories,
  filters,
  onFiltersChange,
  onClose
}: TransactionFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Отслеживаем открытие клавиатуры
  useEffect(() => {
    let keyboardVisible = false;
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        keyboardVisible = viewportHeight < windowHeight - 150;
        setIsKeyboardVisible(keyboardVisible);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      handleViewportChange();
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
    };
  }, []);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      type: 'all',
      category: undefined,
      minAmount: undefined,
      maxAmount: undefined,
      searchQuery: undefined
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onClose();
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
        paddingBottom: isKeyboardVisible ? '20px' : 'calc(20px + env(safe-area-inset-bottom))',
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
            Фильтры
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

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Тип транзакции */}
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              color: 'var(--tg-theme-text-color)'
            }}>
              Тип
            </div>
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              {(['all', 'income', 'expense'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setLocalFilters({ ...localFilters, type })}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: `2px solid ${localFilters.type === type ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
                    backgroundColor: localFilters.type === type
                      ? 'rgba(51, 144, 236, 0.1)'
                      : 'var(--tg-theme-bg-color)',
                    color: 'var(--tg-theme-text-color)',
                    fontSize: '14px',
                    fontWeight: localFilters.type === type ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {type === 'all' ? 'Все' : type === 'income' ? 'Доходы' : 'Расходы'}
                </button>
              ))}
            </div>
          </div>

          {/* Категория */}
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              color: 'var(--tg-theme-text-color)'
            }}>
              Категория
            </div>
            <select
              value={localFilters.category || ''}
              onChange={(e) => setLocalFilters({ 
                ...localFilters, 
                category: e.target.value || undefined 
              })}
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
              <option value="">Все категории</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Сумма */}
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              color: 'var(--tg-theme-text-color)'
            }}>
              Сумма
            </div>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <input
                type="number"
                placeholder="От"
                value={localFilters.minAmount || ''}
                onChange={(e) => setLocalFilters({ 
                  ...localFilters, 
                  minAmount: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '2px solid var(--tg-theme-secondary-bg-color)',
                  backgroundColor: 'var(--tg-theme-bg-color)',
                  color: 'var(--tg-theme-text-color)',
                  fontSize: '16px'
                }}
              />
              <span style={{ color: 'var(--tg-theme-hint-color)' }}>—</span>
              <input
                type="number"
                placeholder="До"
                value={localFilters.maxAmount || ''}
                onChange={(e) => setLocalFilters({ 
                  ...localFilters, 
                  maxAmount: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '2px solid var(--tg-theme-secondary-bg-color)',
                  backgroundColor: 'var(--tg-theme-bg-color)',
                  color: 'var(--tg-theme-text-color)',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          {/* Поиск */}
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              color: 'var(--tg-theme-text-color)'
            }}>
              Поиск
            </div>
            <input
              type="text"
              placeholder="По описанию или категории"
              value={localFilters.searchQuery || ''}
              onChange={(e) => setLocalFilters({ 
                ...localFilters, 
                searchQuery: e.target.value || undefined 
              })}
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

          {/* Кнопки */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '8px'
          }}>
            <button
              onClick={handleReset}
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
              Сбросить
            </button>
            <button
              onClick={handleApply}
              className="tg-button"
              style={{
                flex: 1
              }}
            >
              Применить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

