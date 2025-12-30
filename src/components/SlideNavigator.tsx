import { ReactNode, useRef, useState, useEffect } from 'react';

interface SlideNavigatorProps {
  screens: ReactNode[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

/**
 * SlideNavigator — компонент для slide-based навигации с поддержкой swipe жестов
 * Все экраны расположены горизонтально, переключение через transform translateX
 */
export function SlideNavigator({ screens, activeIndex, onIndexChange }: SlideNavigatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHorizontalSwipe, setIsHorizontalSwipe] = useState(false);

  // Обновляем translateX при изменении activeIndex (программное переключение)
  useEffect(() => {
    if (!isDragging && !isTransitioning) {
      setTranslateX(-activeIndex * 100);
    }
  }, [activeIndex, isDragging, isTransitioning]);

  // Обработка начала touch
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartY(touch.clientY);
    setCurrentX(touch.clientX);
    setIsDragging(true);
    setIsTransitioning(false);
    setIsHorizontalSwipe(false);
  };

  // Обработка движения touch
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    // Определяем направление swipe (только если горизонтальное движение больше вертикального)
    if (!isHorizontalSwipe && Math.abs(deltaX) > 10) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setIsHorizontalSwipe(true);
        // Предотвращаем вертикальный скролл во время горизонтального swipe
        e.preventDefault();
      }
    }

    // Применяем transform только для горизонтальных swipe
    if (isHorizontalSwipe) {
      const newTranslateX = -activeIndex * 100 + (deltaX / window.innerWidth) * 100;

      // Ограничиваем движение в пределах экранов
      const minTranslate = -(screens.length - 1) * 100;
      const maxTranslate = 0;

      if (newTranslateX >= minTranslate && newTranslateX <= maxTranslate) {
        setCurrentX(touch.clientX);
        setTranslateX(newTranslateX);
      }
    }
  };

  // Обработка окончания touch
  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    setIsTransitioning(true);

    // Переключаем экран только если это был горизонтальный swipe
    if (isHorizontalSwipe) {
      const deltaX = currentX - startX;
      const deltaPercent = (deltaX / window.innerWidth) * 100;
      const threshold = 30; // 30% ширины экрана для переключения

      let newIndex = activeIndex;

      // Определяем направление и переключаем экран если превышен threshold
      if (Math.abs(deltaPercent) > threshold) {
        if (deltaPercent > 0 && activeIndex > 0) {
          // Swipe вправо → предыдущий экран
          newIndex = activeIndex - 1;
        } else if (deltaPercent < 0 && activeIndex < screens.length - 1) {
          // Swipe влево → следующий экран
          newIndex = activeIndex + 1;
        }
      }

      // Применяем финальную позицию
      setTranslateX(-newIndex * 100);
      onIndexChange(newIndex);
    } else {
      // Если не был горизонтальный swipe, возвращаем на текущий экран
      setTranslateX(-activeIndex * 100);
    }

    // Сбрасываем transition после анимации
    setTimeout(() => {
      setIsTransitioning(false);
      setIsHorizontalSwipe(false);
    }, 300);
  };

  return (
    <div
      ref={containerRef}
      className="slide-navigator"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
        willChange: 'transform',
        touchAction: 'pan-y pinch-zoom',
      }}
    >
      {screens.map((screen, index) => (
        <div
          key={index}
          className="slide-screen"
          style={{
            width: '100vw',
            height: '100%',
            flexShrink: 0,
            transform: `translateX(${translateX + index * 100}%)`,
            transition: isTransitioning ? 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)' : 'none',
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            touchAction: isHorizontalSwipe ? 'none' : 'pan-y pinch-zoom',
          }}
        >
          {screen}
        </div>
      ))}
    </div>
  );
}

