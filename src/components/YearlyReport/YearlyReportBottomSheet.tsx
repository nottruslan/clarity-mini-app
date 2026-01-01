import { useEffect, useRef, useState } from 'react';
import { type YearlyReport } from '../../utils/storage';
import YearlyReportView from './YearlyReportView';
import ReportBottomSheet from './ReportBottomSheet';

interface YearlyReportBottomSheetProps {
  report: YearlyReport;
  onClose: () => void;
  onUpdate: (updatedReport: YearlyReport) => Promise<void>;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function YearlyReportBottomSheet({
  report,
  onClose,
  onUpdate,
  onEdit,
  onDuplicate,
  onDelete
}: YearlyReportBottomSheetProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);

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

  return (
    <>
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
          zIndex: 9999,
          display: 'flex',
          alignItems: 'flex-end',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        <div
          ref={sheetRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            backgroundColor: 'var(--tg-theme-bg-color)',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            height: '90vh',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            transform: 'translateY(100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden'
          }}
        >
          {/* Индикатор */}
          <div
            style={{
              width: '40px',
              height: '4px',
              backgroundColor: 'var(--tg-theme-hint-color)',
              borderRadius: '2px',
              margin: '12px auto 8px',
              opacity: 0.3,
              flexShrink: 0
            }}
          />

          {/* Header с кнопкой закрытия и меню */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: '600', flex: 1 }}>
              Отчет за {report.year}
            </h2>
            <button
              onClick={() => setShowMenu(true)}
              style={{
                padding: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--tg-theme-text-color)',
                cursor: 'pointer',
                fontSize: '20px',
                lineHeight: '1',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ⋯
            </button>
            <button
              onClick={handleClose}
              style={{
                padding: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--tg-theme-text-color)',
                cursor: 'pointer',
                fontSize: '24px',
                lineHeight: '1',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              ×
            </button>
          </div>

          {/* Контент */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <YearlyReportView
                report={report}
                onClose={handleClose}
                onUpdate={onUpdate}
                hideHeader={true}
              />
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>

      {showMenu && (
        <ReportBottomSheet
          onClose={() => setShowMenu(false)}
          onEdit={() => {
            setShowMenu(false);
            setTimeout(() => {
              handleClose();
              setTimeout(() => onEdit(), 350);
            }, 350);
          }}
          onDuplicate={() => {
            setShowMenu(false);
            setTimeout(() => {
              handleClose();
              setTimeout(() => onDuplicate(), 350);
            }, 350);
          }}
          onDelete={() => {
            setShowMenu(false);
            setTimeout(() => {
              handleClose();
              setTimeout(() => onDelete(), 350);
            }, 350);
          }}
        />
      )}
    </>
  );
}

