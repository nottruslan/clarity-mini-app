import { useState } from 'react';
import { Tabbar } from '@telegram-apps/telegram-ui';
import { SlideNavigator } from './SlideNavigator';
import { TasksScreen } from './screens/TasksScreen';
import { HabitsScreen } from './screens/HabitsScreen';
import { FinanceScreen } from './screens/FinanceScreen';
import { LanguagesScreen } from './screens/LanguagesScreen';

/**
 * AppShell — основной контейнер приложения
 * Использует SlideNavigator для полноэкранной навигации с поддержкой swipe
 * Без page routing, только состояние (useState)
 */
export function AppShell() {
  const [activeIndex, setActiveIndex] = useState(0);

  const screens = [
    <TasksScreen />,
    <HabitsScreen />,
    <FinanceScreen />,
    <LanguagesScreen />,
  ];

  const handleTabClick = (tab: 'tasks' | 'habits' | 'finance' | 'languages') => {
    const indexMap = {
      tasks: 0,
      habits: 1,
      finance: 2,
      languages: 3,
    };
    setActiveIndex(indexMap[tab]);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Slide Navigator с полноэкранными экранами */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <SlideNavigator
          screens={screens}
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
        />
      </div>

      {/* Bottom Navigation (Tabbar) */}
      <Tabbar
        style={{
          borderTop: '1px solid var(--tg-theme-hint-color, rgba(0,0,0,0.1))',
          flexShrink: 0,
        }}
      >
        <Tabbar.Item
          text="Задачи"
          selected={activeIndex === 0}
          onClick={() => handleTabClick('tasks')}
        >
          <span style={{ fontSize: '24px' }}>✓</span>
        </Tabbar.Item>

        <Tabbar.Item
          text="Привычки"
          selected={activeIndex === 1}
          onClick={() => handleTabClick('habits')}
        >
          <span style={{ fontSize: '24px' }}>🔄</span>
        </Tabbar.Item>

        <Tabbar.Item
          text="Финансы"
          selected={activeIndex === 2}
          onClick={() => handleTabClick('finance')}
        >
          <span style={{ fontSize: '24px' }}>💰</span>
        </Tabbar.Item>

        <Tabbar.Item
          text="Языки"
          selected={activeIndex === 3}
          onClick={() => handleTabClick('languages')}
        >
          <span style={{ fontSize: '24px' }}>🌍</span>
        </Tabbar.Item>
      </Tabbar>
    </div>
  );
}

