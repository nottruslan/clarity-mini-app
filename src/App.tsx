import { useState } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { useCloudStorage } from './hooks/useCloudStorage';
import SectionSelector, { type Section } from './components/Navigation/SectionSelector';
import SlideContainer from './components/Navigation/SlideContainer';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import HabitsPage from './pages/HabitsPage';
import FinancePage from './pages/FinancePage';
import LanguagesPage from './pages/LanguagesPage';

function App() {
  const { isReady } = useTelegram();
  const storage = useCloudStorage();
  const [currentSection, setCurrentSection] = useState<Section>('home');

  if (!isReady || storage.loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh' 
      }}>
        Загрузка...
      </div>
    );
  }

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <HomePage onSectionChange={setCurrentSection} />;
      case 'tasks':
        return <TasksPage storage={storage} />;
      case 'habits':
        return <HabitsPage storage={storage} />;
      case 'finance':
        return <FinancePage storage={storage} />;
      case 'languages':
        return <LanguagesPage />;
      default:
        return <HomePage onSectionChange={setCurrentSection} />;
    }
  };

  return (
    <div className="app">
      {currentSection !== 'home' && (
        <SectionSelector 
          currentSection={currentSection} 
          onSectionChange={setCurrentSection} 
        />
      )}
      {renderSection()}
    </div>
  );
}

export default App;

