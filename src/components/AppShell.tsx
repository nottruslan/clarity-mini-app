import { useState } from 'react';
import { Tabbar } from '@telegram-apps/telegram-ui';
import { Placeholder } from '@telegram-apps/telegram-ui/dist/components/Blocks/Placeholder/Placeholder';

type Tab = 'tasks' | 'habits' | 'finance' | 'languages';

/**
 * AppShell — основной контейнер приложения
 * Содержит нижний Tabbar и переключение между 4 секциями
 * Без page routing, только состояние (useState)
 */
export function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');

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
      {/* Content Area */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
        }}
      >
        {activeTab === 'tasks' && <TasksSection />}
        {activeTab === 'habits' && <HabitsSection />}
        {activeTab === 'finance' && <FinanceSection />}
        {activeTab === 'languages' && <LanguagesSection />}
      </div>

      {/* Bottom Navigation (Tabbar) */}
      <Tabbar
        style={{
          borderTop: '1px solid var(--tg-theme-hint-color, rgba(0,0,0,0.1))',
        }}
      >
        <Tabbar.Item
          text="Задачи"
          selected={activeTab === 'tasks'}
          onClick={() => setActiveTab('tasks')}
        >
          <span style={{ fontSize: '24px' }}>✓</span>
        </Tabbar.Item>

        <Tabbar.Item
          text="Привычки"
          selected={activeTab === 'habits'}
          onClick={() => setActiveTab('habits')}
        >
          <span style={{ fontSize: '24px' }}>🔄</span>
        </Tabbar.Item>

        <Tabbar.Item
          text="Финансы"
          selected={activeTab === 'finance'}
          onClick={() => setActiveTab('finance')}
        >
          <span style={{ fontSize: '24px' }}>💰</span>
        </Tabbar.Item>

        <Tabbar.Item
          text="Языки"
          selected={activeTab === 'languages'}
          onClick={() => setActiveTab('languages')}
        >
          <span style={{ fontSize: '24px' }}>🌍</span>
        </Tabbar.Item>
      </Tabbar>
    </div>
  );
}

// Заглушки для секций (будут заменены на реальные компоненты)

function TasksSection() {
  return (
    <Placeholder
      header="Задачи"
      description="Здесь будет список твоих задач"
    >
      <span style={{ fontSize: '48px' }}>✓</span>
    </Placeholder>
  );
}

function HabitsSection() {
  return (
    <Placeholder
      header="Привычки"
      description="Здесь будет трекер привычек"
    >
      <span style={{ fontSize: '48px' }}>🔄</span>
    </Placeholder>
  );
}

function FinanceSection() {
  return (
    <Placeholder
      header="Финансы"
      description="Здесь будут доходы и расходы"
    >
      <span style={{ fontSize: '48px' }}>💰</span>
    </Placeholder>
  );
}

function LanguagesSection() {
  return (
    <Placeholder
      header="Языки"
      description="Здесь будет переход к изучению языков"
    >
      <span style={{ fontSize: '48px' }}>🌍</span>
    </Placeholder>
  );
}

