import { useState, useMemo } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import { type DiaryEntry } from '../utils/storage';
import DiaryEntryList from '../components/Diary/DiaryEntryList';
import DiaryEditScreen from '../components/Diary/DiaryEditScreen';
import DiaryEntryBottomSheet from '../components/Diary/DiaryEntryBottomSheet';

// #region agent log
const log = (location: string, message: string, data: any, hypothesisId?: string) => {
  const logEntry = {
    location,
    message,
    data,
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId: hypothesisId || 'A'
  };
  // Используем только console.log, чтобы избежать проблем с CORS
  // Добавляем несколько способов вывода для надежности
  console.log('🔍 DIARY_DEBUG', location, message, data);
  console.log('[DIARY_DEBUG_JSON]', JSON.stringify(logEntry));
  // Также выводим в alert для отладки (можно убрать позже)
  if (window.location.search.includes('debug=true')) {
    console.warn('DEBUG:', location, message, data);
  }
};
// #endregion

interface DiaryPageProps {
  storage: ReturnType<typeof useCloudStorage>;
}

export default function DiaryPage({ storage }: DiaryPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<DiaryEntry | null>(null);
  const [menuEntry, setMenuEntry] = useState<DiaryEntry | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [editKey, setEditKey] = useState<string | number>('');

  // Получаем сегодняшнюю дату (начало дня)
  const getTodayTimestamp = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  };

  // Фильтруем записи по выбранному месяцу
  const filteredEntries = useMemo(() => {
    let entries = storage.diary;

    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      entries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return (
          entryDate.getFullYear() === parseInt(year) &&
          entryDate.getMonth() + 1 === parseInt(month)
        );
      });
    }

    return entries;
  }, [storage.diary, selectedMonth]);

  const handleCreateClick = () => {
    // #region agent log
    log('DiaryPage.tsx:handleCreateClick', 'handleCreateClick called', {
      currentEditingEntry: editingEntry?.id || null,
      currentEditKey: editKey,
      diaryEntriesCount: storage.diary.length,
      diaryEntryIds: storage.diary.map(e => e.id)
    }, 'A');
    // #endregion
    
    // Всегда создаем новую запись - убираем ограничение на одну запись в день
    setEditingEntry(null);
    
    // Для новой записи используем уникальный ключ на основе timestamp
    const newKey = `new-${Date.now()}`;
    setEditKey(newKey);
    
    // #region agent log
    log('DiaryPage.tsx:handleCreateClick', 'creating new entry', {
      editKey: newKey,
      editingEntry: null,
      note: 'Always creating new entry, no limit per day'
    }, 'A');
    // #endregion
    
    setIsEditing(true);
    // #region agent log
    // Логируем после небольшой задержки, чтобы увидеть актуальное состояние
    setTimeout(() => {
      log('DiaryPage.tsx:handleCreateClick', 'state after setState (delayed)', {
        isEditing: true,
        note: 'This log shows state after React has processed setState calls'
      }, 'A');
    }, 0);
    // #endregion
  };

  const handleSave = async (entry: DiaryEntry) => {
    // #region agent log
    log('DiaryPage.tsx:handleSave', 'handleSave called', {
      entryId: entry.id,
      entryTitle: entry.title,
      entryContent: entry.content?.substring(0, 50),
      currentEditingEntryId: editingEntry?.id || null,
      isUpdate: editingEntry && editingEntry.id === entry.id,
      diaryEntriesCountBefore: storage.diary.length
    }, 'B');
    // #endregion
    
    if (editingEntry && editingEntry.id === entry.id) {
      // Обновляем существующую запись
      await storage.updateDiaryEntry(entry.id, entry);
      // #region agent log
      log('DiaryPage.tsx:handleSave', 'entry updated', {
        entryId: entry.id,
        diaryEntriesCountAfter: storage.diary.length
      }, 'B');
      // #endregion
    } else {
      // Создаём новую запись
      await storage.addDiaryEntry(entry);
      // #region agent log
      log('DiaryPage.tsx:handleSave', 'entry added', {
        entryId: entry.id,
        diaryEntriesCountAfter: storage.diary.length,
        newDiaryEntryIds: storage.diary.map(e => e.id)
      }, 'B');
      // #endregion
    }
    // Закрытие произойдет в DiaryEditScreen, там вызовется handleClose
  };

  const handleView = (entry: DiaryEntry) => {
    setViewingEntry(entry);
  };

  const handleOpenMenu = (entry: DiaryEntry) => {
    setMenuEntry(entry);
    setShowMenu(true);
  };

  const handleEditFromRead = () => {
    // #region agent log
    log('DiaryPage.tsx:handleEditFromRead', 'handleEditFromRead called', {
      viewingEntryId: viewingEntry?.id || null,
      viewingEntryTitle: viewingEntry?.title,
      viewingEntryContent: viewingEntry?.content?.substring(0, 50)
    }, 'A');
    // #endregion
    
    if (viewingEntry) {
      setEditingEntry(viewingEntry);
      setEditKey(viewingEntry.id);
      setViewingEntry(null);
      setIsEditing(true);
      // #region agent log
      log('DiaryPage.tsx:handleEditFromRead', 'switched to edit mode', {
        editingEntryId: viewingEntry.id,
        editKey: viewingEntry.id
      }, 'A');
      // #endregion
    }
  };

  const handleEdit = (entry: DiaryEntry) => {
    // #region agent log
    log('DiaryPage.tsx:handleEdit', 'handleEdit called', {
      entryId: entry.id,
      entryTitle: entry.title,
      entryContent: entry.content?.substring(0, 50),
      currentEditingEntry: editingEntry?.id || null,
      currentEditKey: editKey
    }, 'A');
    // #endregion
    
    setEditingEntry(entry);
    setEditKey(entry.id);
    setViewingEntry(null);
    setIsEditing(true);
    setShowMenu(false);
    setMenuEntry(null);
    
    // #region agent log
    log('DiaryPage.tsx:handleEdit', 'state updated', {
      editingEntryId: entry.id,
      editKey: entry.id,
      isEditing: true
    }, 'A');
    // #endregion
  };

  const handleDelete = async (entry: DiaryEntry) => {
    if (window.Telegram?.WebApp?.showConfirm) {
      window.Telegram.WebApp.showConfirm(
        'Вы уверены, что хотите удалить эту запись?',
        (confirmed: boolean) => {
          if (confirmed) {
            storage.deleteDiaryEntry(entry.id);
          }
        }
      );
    } else {
      if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
        await storage.deleteDiaryEntry(entry.id);
      }
    }
    setShowMenu(false);
    setMenuEntry(null);
  };

  const handleClose = () => {
    // #region agent log
    log('DiaryPage.tsx:handleClose', 'handleClose called', {
      currentEditingEntry: editingEntry?.id || null,
      currentEditKey: editKey,
      currentViewingEntry: viewingEntry?.id || null
    }, 'C');
    // #endregion
    
    setIsEditing(false);
    setEditingEntry(null);
    setViewingEntry(null);
    setEditKey('');
    
    // #region agent log
    log('DiaryPage.tsx:handleClose', 'state reset', {
      isEditing: false,
      editingEntry: null,
      viewingEntry: null,
      editKey: ''
    }, 'C');
    // #endregion
  };


  // Получаем список доступных месяцев для фильтрации
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    storage.diary.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthKey);
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [storage.diary]);

  const formatMonthOption = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const monthNames = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  // Если открыт экран просмотра, показываем его в режиме чтения
  if (viewingEntry) {
    return (
      <DiaryEditScreen
        entry={viewingEntry}
        onSave={handleSave}
        onClose={handleClose}
        readOnly={true}
        onEditRequest={handleEditFromRead}
      />
    );
  }

  // Если открыт экран редактирования, показываем его
  if (isEditing) {
    // #region agent log
    log('DiaryPage.tsx:render', 'rendering DiaryEditScreen', {
      editKey,
      editingEntryId: editingEntry?.id || null,
      editingEntryTitle: editingEntry?.title || null,
      editingEntryContent: editingEntry?.content?.substring(0, 50) || null,
      isNewEntry: editingEntry === null
    }, 'A');
    // #endregion
    
    return (
      <DiaryEditScreen
        key={editKey}
        entry={editingEntry}
        onSave={handleSave}
        onClose={handleClose}
      />
    );
  }

  // Иначе показываем список записей
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        paddingBottom: 'calc(100px + env(safe-area-inset-bottom))'
      }}
    >
      {/* Фильтр по месяцам */}
      {availableMonths.length > 0 && (
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
            backgroundColor: 'var(--tg-theme-bg-color)'
          }}
        >
          <select
            value={selectedMonth || ''}
            onChange={(e) => setSelectedMonth(e.target.value || null)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid var(--tg-theme-secondary-bg-color)',
              borderRadius: '8px',
              backgroundColor: 'var(--tg-theme-bg-color)',
              color: 'var(--tg-theme-text-color)',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            <option value="">Все месяцы</option>
            {availableMonths.map(monthKey => (
              <option key={monthKey} value={monthKey}>
                {formatMonthOption(monthKey)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Список записей */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingTop: '16px'
        }}
      >
        <DiaryEntryList
          entries={filteredEntries}
          onView={handleView}
          onOpenMenu={handleOpenMenu}
        />
      </div>

      {/* FAB кнопка */}
      <button
        onClick={handleCreateClick}
        aria-label="Создать новую запись"
        style={{
          position: 'fixed',
          bottom: 'calc(20px + env(safe-area-inset-bottom))',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#9C27B0',
          color: '#ffffff',
          border: 'none',
          fontSize: '32px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
      >
        +
      </button>

      {/* BottomSheet меню */}
      {showMenu && menuEntry && (
        <DiaryEntryBottomSheet
          onClose={() => {
            setShowMenu(false);
            setMenuEntry(null);
          }}
          onEdit={() => handleEdit(menuEntry)}
          onDelete={() => handleDelete(menuEntry)}
        />
      )}
    </div>
  );
}

