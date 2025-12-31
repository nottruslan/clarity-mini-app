import { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { useCloudStorage } from './hooks/useCloudStorage';
import { type Section } from './types/navigation';
import { sectionColors } from './utils/sectionColors';
import AppHeader from './components/Navigation/AppHeader';
import NavigationMenu from './components/Navigation/NavigationMenu';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import HabitsPage from './pages/HabitsPage';
import FinancePage from './pages/FinancePage';
import LanguagesPage from './pages/LanguagesPage';
import YearlyReportPage from './pages/YearlyReportPage';

function App() {
  const { isReady, tg, initError, isInitializing, user } = useTelegram();
  const storage = useCloudStorage();
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [navigationHistory, setNavigationHistory] = useState<Section[]>(['home']);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Показываем состояние загрузки
  if (isInitializing || !isReady || storage.loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        padding: '20px',
        textAlign: 'center'
      }}>
        {isInitializing ? (
          <>
            <div style={{ marginBottom: '16px', fontSize: '18px' }}>Инициализация...</div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Подключение к Telegram Web App
            </div>
          </>
        ) : (
          <div style={{ fontSize: '18px' }}>Загрузка...</div>
        )}
      </div>
    );
  }

  // Показываем ошибки инициализации (критические)
  if (initError && (initError.code === 'SCRIPT_NOT_LOADED' || initError.code === 'TIMEOUT')) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          color: '#ff3333'
        }}>
          Ошибка подключения
        </div>
        <div style={{ 
          fontSize: '16px', 
          marginBottom: '24px',
          color: '#666',
          lineHeight: '1.5'
        }}>
          {initError.message}
        </div>
        <div style={{ 
          fontSize: '14px', 
          color: '#999',
          marginTop: '16px'
        }}>
          Попробуйте обновить страницу или открыть приложение заново через Telegram
        </div>
      </div>
    );
  }

  // Предупреждение о проблемах с авторизацией (не критично, но информируем)
  if (initError && initError.code === 'USER_NOT_AUTHORIZED') {
    console.warn('User not authorized, but continuing in fallback mode');
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
