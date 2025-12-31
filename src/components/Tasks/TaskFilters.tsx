import { useState, useEffect } from 'react';
import { TaskCategory } from '../../utils/storage';
import { TaskFilterOptions, TaskSortOption } from '../../hooks/useTaskFilters';

interface TaskFiltersProps {
  categories: TaskCategory[];
  filters: TaskFilterOptions;
  sortBy?: TaskSortOption;
  onFiltersChange: (filters: TaskFilterOptions) => void;
  onSortChange?: (sortBy: TaskSortOption) => void;
  onClose: () => void;
}

export default function TaskFilters({
  categories,
  filters,
  sortBy = 'time',
  onFiltersChange,
  onSortChange,
  onClose
}: TaskFiltersProps) {
  const [localFilters, setLocalFilters] = useState<TaskFilterOptions>(filters);
  const [localSortBy, setLocalSortBy] = useState<TaskSortOption>(sortBy);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

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
    if (onSortChange) {
      onSortChange(localSortBy);
    }
    onClose();
  };

  const handleReset = () => {
    const resetFilters: TaskFilterOptions = {
      status: 'all',
      priority: 'all',
      categoryId: undefined,
      energyLevel: 'all',
      dateFilter: 'all',
      searchQuery: undefined
    };
    setLocalFilters(resetFilters);
    setLocalSortBy('time');
    onFiltersChange(resetFilters);
    if (onSortChange) {
      onSortChange('time');
    }
    onClose();
  };

  const toggleTag = (tagId: string) => {
    const currentTagIds = localFilters.tagIds || [];
    const newTagIds = currentTagIds.includes(tagId)
      ? currentTagIds.filter(id => id !== tagId)
      : [...currentTagIds, tagId];
    setLocalFilters({ ...localFilters, tagIds: newTagIds.length > 0 ? newTagIds : undefined });
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
    }}
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}
    >
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
      }}
      onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--tg-theme-text-color)'
          }}>
            Фильтры и сортировка
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: 'var(--tg-theme-hint-color)',
              cursor: 'pointer',
              padding: 0,
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* Сортировка */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--tg-theme-text-color)',
            marginBottom: '12px'
          }}>
            Сортировка
          </label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {(['time', 'priority', 'status', 'category', 'date-created', 'energy-level'] as TaskSortOption[]).map(option => (
              <button
                key={option}
                onClick={() => setLocalSortBy(option)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: localSortBy === option
                    ? 'var(--tg-theme-button-color)'
                    : 'var(--tg-theme-secondary-bg-color)',
                  color: localSortBy === option
                    ? 'var(--tg-theme-button-text-color)'
                    : 'var(--tg-theme-text-color)',
                  fontSize: '14px',
                  fontWeight: localSortBy === option ? '600' : '400',
                  cursor: 'pointer'
                }}
              >
                {option === 'time' && 'По времени'}
                {option === 'priority' && 'По приоритету'}
                {option === 'status' && 'По статусу'}
                {option === 'category' && 'По категории'}
                {option === 'date-created' && 'По дате создания'}
                {option === 'energy-level' && 'По энергозатратности'}
              </button>
            ))}
          </div>
        </div>

        {/* Статус */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--tg-theme-text-color)',
            marginBottom: '12px'
          }}>
            Статус
          </label>
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            {(['all', 'todo', 'in-progress', 'completed'] as const).map(status => (
              <button
                key={status}
                onClick={() => setLocalFilters({ ...localFilters, status })}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: localFilters.status === status
                    ? 'var(--tg-theme-button-color)'
                    : 'var(--tg-theme-secondary-bg-color)',
                  color: localFilters.status === status
                    ? 'var(--tg-theme-button-text-color)'
                    : 'var(--tg-theme-text-color)',
                  fontSize: '14px',
                  fontWeight: localFilters.status === status ? '600' : '400',
                  cursor: 'pointer'
                }}
              >
                {status === 'all' && 'Все'}
                {status === 'todo' && 'К выполнению'}
                {status === 'in-progress' && 'В процессе'}
                {status === 'completed' && 'Выполнено'}
              </button>
            ))}
          </div>
        </div>

        {/* Приоритет */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--tg-theme-text-color)',
            marginBottom: '12px'
          }}>
            Приоритет
          </label>
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            {(['all', 'low', 'medium', 'high'] as const).map(priority => (
              <button
                key={priority}
                onClick={() => setLocalFilters({ ...localFilters, priority })}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: localFilters.priority === priority
                    ? 'var(--tg-theme-button-color)'
                    : 'var(--tg-theme-secondary-bg-color)',
                  color: localFilters.priority === priority
                    ? 'var(--tg-theme-button-text-color)'
                    : 'var(--tg-theme-text-color)',
                  fontSize: '14px',
                  fontWeight: localFilters.priority === priority ? '600' : '400',
                  cursor: 'pointer'
                }}
              >
                {priority === 'all' && 'Все'}
                {priority === 'low' && 'Низкий'}
                {priority === 'medium' && 'Средний'}
                {priority === 'high' && 'Высокий'}
              </button>
            ))}
          </div>
        </div>

        {/* Категория */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--tg-theme-text-color)',
            marginBottom: '12px'
          }}>
            Категория
          </label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <button
              onClick={() => setLocalFilters({ ...localFilters, categoryId: undefined })}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: !localFilters.categoryId
                  ? 'var(--tg-theme-button-color)'
                  : 'var(--tg-theme-secondary-bg-color)',
                color: !localFilters.categoryId
                  ? 'var(--tg-theme-button-text-color)'
                  : 'var(--tg-theme-text-color)',
                fontSize: '14px',
                fontWeight: !localFilters.categoryId ? '600' : '400',
                cursor: 'pointer'
              }}
            >
              Все
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setLocalFilters({ ...localFilters, categoryId: cat.id })}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: localFilters.categoryId === cat.id
                    ? cat.color || 'var(--tg-theme-button-color)'
                    : 'var(--tg-theme-secondary-bg-color)',
                  color: localFilters.categoryId === cat.id
                    ? '#ffffff'
                    : 'var(--tg-theme-text-color)',
                  fontSize: '14px',
                  fontWeight: localFilters.categoryId === cat.id ? '600' : '400',
                  cursor: 'pointer'
                }}
              >
                {cat.icon && <span style={{ marginRight: '4px' }}>{cat.icon}</span>}
                {cat.name}
              </button>
            ))}
          </div>
        </div>


        {/* Энергозатратность */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--tg-theme-text-color)',
            marginBottom: '12px'
          }}>
            Энергозатратность
          </label>
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            {(['all', 'low', 'medium', 'high'] as const).map(energy => (
              <button
                key={energy}
                onClick={() => setLocalFilters({ ...localFilters, energyLevel: energy })}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: localFilters.energyLevel === energy
                    ? 'var(--tg-theme-button-color)'
                    : 'var(--tg-theme-secondary-bg-color)',
                  color: localFilters.energyLevel === energy
                    ? 'var(--tg-theme-button-text-color)'
                    : 'var(--tg-theme-text-color)',
                  fontSize: '14px',
                  fontWeight: localFilters.energyLevel === energy ? '600' : '400',
                  cursor: 'pointer'
                }}
              >
                {energy === 'all' && 'Все'}
                {energy === 'low' && 'Низкая'}
                {energy === 'medium' && 'Средняя'}
                {energy === 'high' && 'Высокая'}
              </button>
            ))}
          </div>
        </div>

        {/* Фильтр по дате */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--tg-theme-text-color)',
            marginBottom: '12px'
          }}>
            Дата
          </label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {(['all', 'today', 'tomorrow', 'this-week', 'overdue'] as const).map(dateFilter => (
              <button
                key={dateFilter}
                onClick={() => setLocalFilters({ ...localFilters, dateFilter })}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: localFilters.dateFilter === dateFilter
                    ? 'var(--tg-theme-button-color)'
                    : 'var(--tg-theme-secondary-bg-color)',
                  color: localFilters.dateFilter === dateFilter
                    ? 'var(--tg-theme-button-text-color)'
                    : 'var(--tg-theme-text-color)',
                  fontSize: '14px',
                  fontWeight: localFilters.dateFilter === dateFilter ? '600' : '400',
                  cursor: 'pointer'
                }}
              >
                {dateFilter === 'all' && 'Все'}
                {dateFilter === 'today' && 'Сегодня'}
                {dateFilter === 'tomorrow' && 'Завтра'}
                {dateFilter === 'this-week' && 'Эта неделя'}
                {dateFilter === 'overdue' && 'Просроченные'}
              </button>
            ))}
          </div>
        </div>

        {/* Поиск */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--tg-theme-text-color)',
            marginBottom: '12px'
          }}>
            Поиск
          </label>
          <input
            type="text"
            placeholder="Поиск по названию или описанию..."
            value={localFilters.searchQuery || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, searchQuery: e.target.value || undefined })}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid var(--tg-theme-secondary-bg-color)',
              backgroundColor: 'var(--tg-theme-bg-color)',
              color: 'var(--tg-theme-text-color)',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>

        {/* Кнопки действий */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={handleReset}
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              background: 'var(--tg-theme-secondary-bg-color)',
              color: 'var(--tg-theme-text-color)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Сбросить
          </button>
          <button
            onClick={handleApply}
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              background: 'var(--tg-theme-button-color)',
              color: 'var(--tg-theme-button-text-color)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );
}

