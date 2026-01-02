import { useState } from 'react';
import { useCloudStorage } from '../../hooks/useCloudStorage';
import { generateId, type Task } from '../../utils/storage';

interface InBoxViewProps {
  storage: ReturnType<typeof useCloudStorage>;
}

export default function InBoxView({ storage }: InBoxViewProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = async () => {
    if (!inputValue.trim()) return;

    const newItem = {
      id: generateId(),
      text: inputValue.trim(),
      createdAt: Date.now()
    };

    await storage.addInBoxItem(newItem);
    setInputValue('');
  };

  const handleAddToTasks = async (itemId: string) => {
    const item = storage.tasksData.inbox.find(i => i.id === itemId);
    if (!item) return;

    const newTask: Task = {
      id: generateId(),
      title: item.text,
      completed: false,
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await storage.addTask(newTask);
    await storage.deleteInBoxItem(itemId);
  };

  const handleDelete = async (itemId: string) => {
    await storage.deleteInBoxItem(itemId);
  };

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Поле ввода с кнопкой */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
        backgroundColor: 'var(--tg-theme-bg-color)'
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end'
        }}>
          <input
            type="text"
            className="wizard-input"
            placeholder="Быстрая заметка..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAdd();
              }
            }}
            style={{
              flex: 1,
              marginTop: 0,
              minHeight: '44px'
            }}
          />
          <button
            className="tg-button"
            onClick={handleAdd}
            disabled={!inputValue.trim()}
            style={{
              minWidth: '80px',
              padding: '12px 16px'
            }}
          >
            Добавить
          </button>
        </div>
      </div>

      {/* Список заметок */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px 16px'
      }}>
        {storage.tasksData.inbox.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📥</div>
            {/* Информационный блок */}
            <div style={{
              padding: '16px',
              backgroundColor: 'var(--tg-theme-secondary-bg-color)',
              borderRadius: '12px',
              border: '1px solid var(--tg-theme-secondary-bg-color)',
              marginTop: '16px',
              maxWidth: '100%',
              textAlign: 'left'
            }}>
              <div style={{
                fontSize: '14px',
                color: 'var(--tg-theme-text-color)',
                lineHeight: '1.5'
              }}>
                <div style={{ marginBottom: '8px', fontWeight: '500' }}>
                  💡 Как работать с задачами:
                </div>
                <div style={{ fontSize: '13px', color: 'var(--tg-theme-hint-color)' }}>
                  <div style={{ marginBottom: '4px' }}>
                    • В <strong>InBox</strong> вносите быстрые задачи, когда что-то вспомнили, но нет времени отсортировать
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    • Из InBox можно перенести в <strong>Задачи</strong> и сделать более детальное описание
                  </div>
                  <div>
                    • Дальше укажите время и разместите в <strong>План</strong> на день
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          storage.tasksData.inbox.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--tg-theme-section-bg-color)',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '12px',
                border: '1px solid var(--tg-theme-secondary-bg-color)'
              }}
            >
              <div style={{
                fontSize: '16px',
                color: 'var(--tg-theme-text-color)',
                marginBottom: '12px',
                wordBreak: 'break-word'
              }}>
                {item.text}
              </div>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  className="tg-button"
                  onClick={() => handleAddToTasks(item.id)}
                  style={{
                    flex: 1,
                    fontSize: '14px',
                    padding: '8px 16px',
                    minHeight: '36px'
                  }}
                >
                  Добавить в задачи
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--tg-theme-destructive-text-color)',
                    backgroundColor: 'transparent',
                    color: 'var(--tg-theme-destructive-text-color)',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    minHeight: '36px',
                    minWidth: '60px'
                  }}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

