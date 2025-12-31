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
  const { isReady, tg } = useTelegram();
  const storage = useCloudStorage();
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [navigationHistory, setNavigationHistory] = useState<Section[]>(['home']);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Обработка кнопки "Назад"
  useEffect(() => {
    if (!tg?.BackButton) return;

    // Сохраняем ссылку на обработчик для правильной отписки
    const handleBack = () => {
      try {
        if (navigationHistory.length > 1) {
          // Удаляем текущий раздел из истории
          const newHistory = [...navigationHistory];
          newHistory.pop();
          const previousSection = newHistory[newHistory.length - 1];
          setNavigationHistory(newHistory);
          setCurrentSection(previousSection);
        } else {
          // Если мы на главной, закрываем приложение
          if (tg?.close) {
            tg.close();
          }
        }
      } catch (error) {
        console.error('Error in handleBack:', error);
      }
    };

    // Регистрируем обработчик с обработкой ошибок
    try {
      tg.BackButton.onClick(handleBack);
    } catch (error) {
      console.error('Error setting BackButton onClick:', error);
    }

    // Показываем кнопку назад если не на главной
    try {
      if (currentSection !== 'home') {
        tg.BackButton.show();
      } else {
        tg.BackButton.hide();
      }
    } catch (error) {
      console.error('Error showing/hiding BackButton:', error);
    }

    return () => {
      if (tg?.BackButton) {
        try {
          // Используем сохраненную ссылку на функцию для правильной отписки
          tg.BackButton.offClick(handleBack);
        } catch (error) {
          console.error('Error removing BackButton onClick:', error);
        }
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
          // Убираем # из цвета, если он есть, так как Telegram WebApp API принимает цвет в формате RRGGBB (без #)
          let colorWithoutHash = colors.primary.startsWith('#') 
            ? colors.primary.substring(1) 
            : colors.primary;
          
          // Валидация: цвет должен быть в формате RRGGBB (6 символов)
          if (colorWithoutHash.length === 6 && /^[0-9A-Fa-f]{6}$/.test(colorWithoutHash)) {
            tg.setHeaderColor(colorWithoutHash);
          } else {
            console.warn('Invalid color format for setHeaderColor:', colorWithoutHash, 'using default');
            tg.setHeaderColor('ffffff');
          }
        } else {
          // На главной странице возвращаем стандартный цвет
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
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        Загрузка...
      </div>
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
