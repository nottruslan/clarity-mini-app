import { Placeholder } from '@telegram-apps/telegram-ui/dist/components/Blocks/Placeholder/Placeholder';

/**
 * HabitsScreen — полноэкранный экран для привычек
 */
export function HabitsScreen() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--tg-theme-bg-color)',
        padding: '16px',
        paddingTop: 'env(safe-area-inset-top, 16px)',
        paddingBottom: 'env(safe-area-inset-bottom, 16px)',
      }}
    >
      <Placeholder
        header="Привычки"
        description="Здесь будет трекер привычек"
      >
        <span style={{ fontSize: '48px' }}>🔄</span>
      </Placeholder>
    </div>
  );
}

