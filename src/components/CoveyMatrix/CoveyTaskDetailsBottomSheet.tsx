import { useEffect, useRef } from 'react';
import { type CoveyTask } from '../../utils/storage';

interface CoveyTaskDetailsBottomSheetProps {
  task: CoveyTask;
  onClose: () => void;
}

const quadrantInfo = {
  q1: {
    title: 'Важно и срочно',
    description: 'Дела, требующие немедленного внимания. Критические задачи и кризисы.',
    color: 'rgba(255, 87, 87, 0.2)'
  },
  q2: {
    title: 'Важно, но не срочно',
    description: 'Стратегические задачи. Планирование, развитие, важные проекты. Фокус на этот квадрант!',
    color: 'rgba(76, 175, 80, 0.2)'
  },
  q3: {
    title: 'Не важно, но срочно',
    description: 'Отвлекающие дела. Прерванные дела, некоторые звонки, неважные встречи.',
    color: 'rgba(255, 193, 7, 0.2)'
  },
  q4: {
    title: 'Не важно и не срочно',
    description: 'Бесполезная деятельность. Пожиратели времени, лишняя активность.',
    color: 'rgba(158, 158, 158, 0.2)'
  }
};

export default function CoveyTaskDetailsBottomSheet({
  task,
  onClose
}: CoveyTaskDetailsBottomSheetProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (sheetRef.current) {
      setTimeout(() => {
        if (sheetRef.current) {
          sheetRef.current.style.transform = 'translateY(0)';
        }
      }, 10);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(100%)';
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const quadrant = quadrantInfo[task.quadrant];
  const formattedDate = formatDate(task.date);

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      style={{
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
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'var(--tg-theme-bg-color)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '8px 0 20px',
          paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
          maxHeight: '85vh',
          overflowY: 'auto' as const,
          WebkitOverflowScrolling: 'touch' as any,
          transform: 'translateY(100%)',
          transition: 'transform 0.3s ease-out'
        }}
      >
        {/* Индикатор */}
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: 'var(--tg-theme-hint-color)',
            borderRadius: '2px',
            margin: '8px auto 16px',
            opacity: 0.3
          }}
        />

        {/* Контент */}
        <div style={{ padding: '0 20px' }}>
          {/* Название задачи */}
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            margin: '0 0 20px 0',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.3',
            wordBreak: 'break-word'
          }}>
            {task.title}
          </h2>

          {/* Описание */}
          {task.description && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--tg-theme-hint-color)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Описание
              </div>
              <p style={{
                fontSize: '16px',
                color: 'var(--tg-theme-text-color)',
                margin: 0,
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {task.description}
              </p>
            </div>
          )}

          {/* Квадрант */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--tg-theme-hint-color)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Квадрант
            </div>
            <div style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: quadrant.color,
              borderLeft: `4px solid ${task.quadrant === 'q1' ? '#ff5757' : task.quadrant === 'q2' ? '#4caf50' : task.quadrant === 'q3' ? '#ffc107' : '#9e9e9e'}`
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--tg-theme-text-color)',
                marginBottom: '4px'
              }}>
                {quadrant.title}
              </div>
              <div style={{
                fontSize: '14px',
                color: 'var(--tg-theme-hint-color)',
                lineHeight: '1.4'
              }}>
                {quadrant.description}
              </div>
            </div>
          </div>

          {/* Важность и срочность */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--tg-theme-hint-color)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Важность
              </div>
              <div style={{
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>
                  {task.important ? '✅' : '❌'}
                </span>
                <span style={{
                  fontSize: '16px',
                  color: 'var(--tg-theme-text-color)',
                  fontWeight: '500'
                }}>
                  {task.important ? 'Важно' : 'Не важно'}
                </span>
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--tg-theme-hint-color)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Срочность
              </div>
              <div style={{
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>
                  {task.urgent ? '🚨' : '⏳'}
                </span>
                <span style={{
                  fontSize: '16px',
                  color: 'var(--tg-theme-text-color)',
                  fontWeight: '500'
                }}>
                  {task.urgent ? 'Срочно' : 'Не срочно'}
                </span>
              </div>
            </div>
          </div>

          {/* Дата */}
          {formattedDate && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--tg-theme-hint-color)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Дата выполнения
              </div>
              <div style={{
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                fontSize: '16px',
                color: 'var(--tg-theme-text-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>📅</span>
                <span>{formattedDate}</span>
              </div>
            </div>
          )}

          {/* Статус */}
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--tg-theme-hint-color)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Статус
            </div>
            <div style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: task.completed 
                ? 'rgba(76, 175, 80, 0.2)' 
                : 'var(--tg-theme-secondary-bg-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>
                {task.completed ? '✅' : '⬜'}
              </span>
              <span style={{
                fontSize: '16px',
                color: 'var(--tg-theme-text-color)',
                fontWeight: '500'
              }}>
                {task.completed ? 'Выполнено' : 'Не выполнено'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

