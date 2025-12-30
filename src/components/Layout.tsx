import { ReactNode, useEffect, useState } from 'react';
import { viewport } from '@telegram-apps/sdk-react';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Базовый Layout компонент
 * - Fullscreen контейнер (100dvh)
 * - Safe area insets (top/bottom)
 * - Слушает изменения viewport
 * - Адаптируется под compact/fullsize/fullscreen режимы
 */
export function Layout({ children }: LayoutProps) {
  const [viewportHeight, setViewportHeight] = useState(viewport.height());
  const [isExpanded, setIsExpanded] = useState(viewport.isExpanded());

  useEffect(() => {
    // Подписка на изменения viewport
    const unsubscribeHeight = viewport.on('change:height', (height) => {
      setViewportHeight(height);
    });

    const unsubscribeExpanded = viewport.on('change:isExpanded', (expanded) => {
      setIsExpanded(expanded);
    });

    return () => {
      unsubscribeHeight();
      unsubscribeExpanded();
    };
  }, []);

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
      data-viewport-height={viewportHeight}
      data-viewport-expanded={isExpanded}
    >
      {children}
    </div>
  );
}

