import { Placeholder } from '@telegram-apps/telegram-ui/dist/components/Blocks/Placeholder/Placeholder';

/**
 * LanguagesScreen — полноэкранный экран для языков
 */
export function LanguagesScreen() {
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
        header="Языки"
        description="Здесь будет переход к изучению языков"
      >
        <span style={{ fontSize: '48px' }}>🌍</span>
      </Placeholder>
    </div>
  );
}

