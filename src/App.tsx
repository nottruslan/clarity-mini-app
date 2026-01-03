import { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { useCloudStorage } from './hooks/useCloudStorage';
import { type Section } from './types/navigation';
import { sectionColors } from './utils/sectionColors';
import { restoreFromBackup } from './utils/storage';
import { triggerHapticFeedback } from './utils/hapticFeedback';
import AppHeader from './components/Navigation/AppHeader';
import NavigationMenu from './components/Navigation/NavigationMenu';
import SplashScreen from './components/SplashScreen/SplashScreen';
import HomePage from './pages/HomePage';
import HabitsPage from './pages/HabitsPage';
import FinancePage from './pages/FinancePage';
import LanguagesPage from './pages/LanguagesPage';
import YearlyReportPage from './pages/YearlyReportPage';
import TasksPage from './pages/TasksPage';
import CoveyMatrixPage from './pages/CoveyMatrixPage';
import BooksPage from './pages/BooksPage';
import DiaryPage from './pages/DiaryPage';

function App() {
  // #region agent log
  const logEndpoint = 'http://127.0.0.1:7250/ingest/ee1f61b1-2553-4bd0-a919-0157b6f4b1e5';
  const log = (msg: string, data?: any, hypothesisId?: string) => {
    fetch(logEndpoint, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx',message:msg,data:data||{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:hypothesisId||'C'})}).catch(()=>{});
  };
  log('App component rendering', {}, 'C');
  // #endregion
  
  const { isReady, tg } = useTelegram();
  const storage = useCloudStorage();
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [navigationHistory, setNavigationHistory] = useState<Section[]>(['home']);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  // #region agent log
  useEffect(() => {
    log('App state changed', {isReady, storageLoading: storage.loading, showSplash}, 'C');
  }, [isReady, storage.loading, showSplash]);
  // #endregion

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
          tg.setHeaderColor(colors.primary); // ожидается формат #RRGGBB
        } else {
          // На главной странице возвращаем стандартный цвет
          tg.setHeaderColor('#ffffff');
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

  // Глобальный эффект для автоматической вибрации всех кнопок
  useEffect(() => {
    // Используем делегирование событий для обработки всех кнопок, включая динамически созданные
    const handleButtonClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      
      // Проверяем, что клик был на button элементе
      // Также проверяем родительские элементы на случай вложенных элементов
      let buttonElement: HTMLElement | null = null;
      
      if (target.tagName === 'BUTTON') {
        buttonElement = target;
      } else {
        // Проверяем родительские элементы
        let parent = target.parentElement;
        while (parent && parent !== document.body) {
          if (parent.tagName === 'BUTTON') {
            buttonElement = parent;
            break;
          }
          parent = parent.parentElement;
        }
      }

      if (buttonElement) {
        // Выполняем вибрацию на основе контекста кнопки
        triggerHapticFeedback(buttonElement);
      }
    };

    // Обработчики для клика и touch
    document.addEventListener('click', handleButtonClick, true); // Используем capture phase
    document.addEventListener('touchend', handleButtonClick, true);

    return () => {
      document.removeEventListener('click', handleButtonClick, true);
      document.removeEventListener('touchend', handleButtonClick, true);
    };
  }, []);

  if (!isReady) {
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

  if (showSplash) {
    return (
      <SplashScreen
        isLoading={storage.loading}
        onComplete={() => setShowSplash(false)}
      />
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
      case 'covey-matrix':
        return <CoveyMatrixPage storage={storage} />;
      case 'books':
        return <BooksPage storage={storage} />;
      case 'diary':
        return <DiaryPage storage={storage} />;
      default:
        return <HomePage onSectionChange={handleSectionChange} />;
    }
  };

  return (
    <div 
      className="app"
      style={{
        opacity: showSplash ? 0 : 1,
        transition: 'opacity 0.5s ease-in'
      }}
    >
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
