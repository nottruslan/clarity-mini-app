interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  taskText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteDialog({
  isOpen,
  taskText,
  onConfirm,
  onCancel
}: ConfirmDeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={onCancel}
      >
        {/* Dialog */}
        <div
          style={{
            backgroundColor: 'var(--tg-theme-bg-color)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            zIndex: 10001
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--tg-theme-text-color)',
            margin: '0 0 12px 0'
          }}>
            Удалить задачу?
          </h3>
          
          <p style={{
            fontSize: '16px',
            color: 'var(--tg-theme-hint-color)',
            margin: '0 0 24px 0',
            lineHeight: '1.5',
            wordBreak: 'break-word'
          }}>
            {taskText}
          </p>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onCancel}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                background: 'var(--tg-theme-secondary-bg-color)',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Отмена
            </button>
            <button
              onClick={onConfirm}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                background: 'var(--tg-theme-destructive-text-color)',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

