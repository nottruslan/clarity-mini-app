import { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { useCloudStorage } from './hooks/useCloudStorage';
import { type Section } from './types/navigation';
import { sectionColors } from './utils/sectionColors';
import { clearCacheWithBackup, forceReload, restoreFromBackup } from './utils/storage';
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
  const [showCacheDialog, setShowCacheDialog] = useState(false);
  const [loadingStartTime] = useState(Date.now());
  const [loadingTime, setLoadingTime] = useState(0);
  
  // Обновляем время загрузки каждую секунду
  useEffect(() => {
    if (!isReady || storage.loading) {
      const interval = setInterval(() => {
        setLoadingTime(Math.floor((Date.now() - loadingStartTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isReady, storage.loading, loadingStartTime]);

  // Восстановление данных из резервной копии после перезагрузки
  useEffect(() => {
    const backup = sessionStorage.getItem('clarity_backup');
    const restored = sessionStorage.getItem('clarity_restored');
    
    // Восстанавливаем только если есть резервная копия и еще не восстанавливали
    if (backup && !restored && isReady && !storage.loading) {
      // Помечаем, что начали восстановление
      sessionStorage.setItem('clarity_restoring', 'true');
      
      restoreFromBackup(backup).then(() => {
        // Удаляем резервную копию и помечаем как восстановленное
        sessionStorage.removeItem('clarity_backup');
        sessionStorage.setItem('clarity_restored', 'true');
        sessionStorage.removeItem('clarity_restoring');
        
        // Перезагружаем данные через storage.reload() вместо перезагрузки страницы
        // Это быстрее и не требует полной перезагрузки
        setTimeout(() => {
          storage.reload();
        }, 500);
      }).catch((error) => {
        console.error('Ошибка восстановления данных:', error);
        sessionStorage.removeItem('clarity_restoring');
        // Удаляем резервную копию даже при ошибке, чтобы не зациклиться
        sessionStorage.removeItem('clarity_backup');
      });
    }
    
    // Очищаем флаг восстановления при следующей нормальной загрузке (не после восстановления)
    if (!backup && restored) {
      sessionStorage.removeItem('clarity_restored');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, storage.loading]);

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

  // Принудительно пропускаем загрузку
  const handleSkipLoading = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showConfirm(
        'Пропустить загрузку? Приложение может работать некорректно без данных.',
        (confirmed) => {
          if (confirmed) {
            // Устанавливаем флаг пропуска и перезагружаем страницу
            sessionStorage.setItem('clarity_skip_loading', 'true');
            window.location.reload();
          }
        }
      );
    } else {
      if (confirm('Пропустить загрузку? Приложение может работать некорректно без данных.')) {
        sessionStorage.setItem('clarity_skip_loading', 'true');
        window.location.reload();
      }
    }
  };

  if (!isReady || storage.loading) {
    // Определяем, что именно застряло
    const stuckOnTelegram = !isReady;
    const stuckOnData = isReady && storage.loading;
    
    return (
      <>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          padding: '20px',
          gap: '16px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ fontSize: '18px', marginBottom: '8px', textAlign: 'center' }}>
            Загрузка...
          </div>
          
          {/* Диагностика */}
          <div style={{
            fontSize: '12px',
            color: 'var(--tg-theme-hint-color, #999)',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            {stuckOnTelegram && 'Инициализация Telegram...'}
            {stuckOnData && 'Загрузка данных...'}
            {loadingTime > 0 && ` (${loadingTime} сек)`}
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            maxWidth: '300px',
            marginTop: '24px',
            position: 'relative',
            zIndex: 10
          }}>
            <button
              onClick={forceReload}
              style={{
                padding: '14px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--tg-theme-button-color, #3390ec)',
                color: 'var(--tg-theme-button-text-color, #ffffff)',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.1s',
                WebkitTapHighlightColor: 'transparent'
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              🔄 Обновить страницу
            </button>
            
            <button
              onClick={() => setShowCacheDialog(true)}
              style={{
                padding: '14px 24px',
                borderRadius: '8px',
                border: '2px solid var(--tg-theme-button-color, #3390ec)',
                backgroundColor: 'transparent',
                color: 'var(--tg-theme-button-color, #3390ec)',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.1s',
                WebkitTapHighlightColor: 'transparent'
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              🧹 Очистить кэш
            </button>
            
            <button
              onClick={handleSkipLoading}
              style={{
                padding: '14px 24px',
                borderRadius: '8px',
                border: '2px solid #ff9500',
                backgroundColor: 'transparent',
                color: '#ff9500',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.1s',
                WebkitTapHighlightColor: 'transparent',
                marginTop: '8px'
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ⏭️ Пропустить загрузку
            </button>
          </div>
        </div>

        {/* Диалог очистки кэша */}
        {showCacheDialog && (
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
          onClick={() => setShowCacheDialog(false)}
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
                Очистить кэш?
              </h2>
              <p style={{
                fontSize: '14px',
                color: 'var(--tg-theme-hint-color, #999999)',
                marginBottom: '24px',
                lineHeight: '1.5'
              }}>
                Все ваши данные будут сохранены в резервной копию и автоматически восстановлены после очистки. Это поможет решить проблемы с загрузкой приложения.
              </p>
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setShowCacheDialog(false)}
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
                    setShowCacheDialog(false);
                    await clearCacheWithBackup();
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--tg-theme-button-color, #3390ec)',
                    color: 'var(--tg-theme-button-text-color, #ffffff)',
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
