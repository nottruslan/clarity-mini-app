import { useState, useEffect, useRef } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { useCloudStorage } from './hooks/useCloudStorage';
import { type Section } from './types/navigation';
import { sectionColors } from './utils/sectionColors';
import { clearAllStorageData } from './utils/storage';
import AppHeader from './components/Navigation/AppHeader';
import NavigationMenu from './components/Navigation/NavigationMenu';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import HabitsPage from './pages/HabitsPage';
import FinancePage from './pages/FinancePage';
import LanguagesPage from './pages/LanguagesPage';
import YearlyReportPage from './pages/YearlyReportPage';

function App() {
  const { isReady, tg } = useTelegram();
  const storage = useCloudStorage();
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [navigationHistory, setNavigationHistory] = useState<Section[]>(['home']);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Обработка кнопки "Назад"
  useEffect(() => {
    if (!tg?.BackButton) return;

    const handleBack = () => {
      if (navigationHistory.length > 1) {
        // Удаляем текущий раздел из истории
        const newHistory = [...navigationHistory];
        newHistory.pop();
        const previousSection = newHistory[newHistory.length - 1];
        setNavigationHistory(newHistory);
        setCurrentSection(previousSection);
      } else {
        // Если мы на главной, закрываем приложение
        tg.close();
      }
    };

    tg.BackButton.onClick(handleBack);

    // Показываем кнопку назад если не на главной
    if (currentSection !== 'home') {
      tg.BackButton.show();
    } else {
      tg.BackButton.hide();
    }

    return () => {
      if (tg.BackButton) {
        tg.BackButton.offClick(handleBack);
      }
    };
  }, [currentSection, navigationHistory, tg]);

  const handleSectionChange = (section: Section) => {
    setCurrentSection(section);
    // Добавляем в историю только если это новый раздел
    if (navigationHistory[navigationHistory.length - 1] !== section) {
      setNavigationHistory([...navigationHistory, section]);
    }
  };

  // Устанавливаем цвет header при монтировании и смене раздела
  useEffect(() => {
    if (!tg?.setHeaderColor || !isReady) return;
    
    // Проверяем, что WebApp полностью инициализирован
    const updateHeaderColor = () => {
      try {
        if (currentSection !== 'home') {
          const colors = sectionColors[currentSection];
          // Пробуем разные форматы цвета
          tg.setHeaderColor(colors.primary);
          // Также пробуем без #
          if (colors.primary.startsWith('#')) {
            tg.setHeaderColor(colors.primary.substring(1));
          }
        } else {
          // На главной странице возвращаем стандартный цвет
          tg.setHeaderColor('#ffffff');
          tg.setHeaderColor('ffffff');
        }
      } catch (error) {
        console.error('Error setting header color:', error);
      }
    };

    // Используем задержку для гарантии готовности WebApp
    // В fullscreen режиме header может не отображаться, но попробуем установить цвет
    const timeoutId = setTimeout(updateHeaderColor, 200);
    
    // Также пробуем установить сразу, если WebApp уже готов
    if (tg.isExpanded) {
      updateHeaderColor();
    }

    return () => clearTimeout(timeoutId);
  }, [currentSection, tg, isReady]);

  if (!isReady || storage.loading) {
    return (
      <>
        <div 
          onClick={() => {
            clickCountRef.current += 1;
            
            // Сбрасываем таймер при каждом клике
            if (clickTimeoutRef.current) {
              clearTimeout(clickTimeoutRef.current);
            }
            
            // Если 5 кликов за 2 секунды - показываем диалог
            if (clickCountRef.current >= 5) {
              clickCountRef.current = 0;
              setShowClearDialog(true);
            } else {
              // Сбрасываем счетчик через 2 секунды
              clickTimeoutRef.current = setTimeout(() => {
                clickCountRef.current = 0;
              }, 2000);
            }
          }}
          style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>Загрузка...</div>
          <div style={{ fontSize: '12px', color: '#999', opacity: 0.5 }}>
            (Нажмите 5 раз для очистки данных)
          </div>
        </div>

        {/* Диалог очистки данных */}
        {showClearDialog && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}
          onClick={() => setShowClearDialog(false)}
          >
            <div 
              style={{
                backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '12px',
                color: 'var(--tg-theme-text-color, #000000)'
              }}>
                Очистить все данные?
              </h2>
              <p style={{
                fontSize: '14px',
                color: 'var(--tg-theme-hint-color, #999999)',
                marginBottom: '24px',
                lineHeight: '1.5'
              }}>
                Это действие удалит все ваши задачи, привычки, финансовые данные и другие сохраненные данные. Это действие нельзя отменить.
              </p>
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setShowClearDialog(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid var(--tg-theme-button-color, #3390ec)',
                    backgroundColor: 'transparent',
                    color: 'var(--tg-theme-button-color, #3390ec)',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Отмена
                </button>
                <button
                  onClick={async () => {
                    setShowClearDialog(false);
                    await clearAllStorageData();
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#ff3333',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Очистить
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <HomePage onSectionChange={handleSectionChange} />;
      case 'tasks':
        return <TasksPage storage={storage} />;
      case 'habits':
        return <HabitsPage storage={storage} />;
      case 'finance':
        return <FinancePage storage={storage} />;
      case 'languages':
        return <LanguagesPage />;
      case 'yearly-report':
        return <YearlyReportPage storage={storage} />;
      default:
        return <HomePage onSectionChange={handleSectionChange} />;
    }
  };

  return (
    <div className="app">
      {currentSection !== 'home' && (
        <AppHeader 
          currentSection={currentSection} 
          onMenuClick={() => setIsMenuOpen(true)}
        />
      )}
      {renderSection()}
      <NavigationMenu
        isOpen={isMenuOpen}
        currentSection={currentSection}
        onClose={() => setIsMenuOpen(false)}
        onSectionSelect={handleSectionChange}
      />
    </div>
  );
}

export default App;
