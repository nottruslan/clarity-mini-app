import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Базовый Layout компонент
 * - Fullscreen контейнер (100dvh)
 * - Safe area insets (top/bottom)
 * - Адаптируется под все режимы viewport
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: 'var(--tg-theme-bg-color)',
        color: 'var(--tg-theme-text-color)',
        // Safe areas для notch и home indicator
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {children}
    </div>
  );
}

