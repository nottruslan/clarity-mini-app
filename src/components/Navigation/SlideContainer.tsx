import { ReactNode, useRef, useEffect } from 'react';
import { useSlideNavigation } from '../../hooks/useSlideNavigation';

interface SlideContainerProps {
  children: ReactNode[];
  currentSlide: number;
  onSlideChange?: (index: number) => void;
}

export default function SlideContainer({ 
  children, 
  currentSlide,
  onSlideChange 
}: SlideContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { handlers } = useSlideNavigation(children.length, currentSlide);

  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(currentSlide);
    }
  }, [currentSlide, onSlideChange]);

  return (
    <div 
      className="slide-container"
      ref={containerRef}
      {...handlers}
    >
      {children.map((child, index) => {
        let slideClass = 'slide';
        if (index === currentSlide) {
          slideClass += ' active';
        } else if (index < currentSlide) {
          slideClass += ' prev';
        } else {
          slideClass += ' next';
        }

        return (
          <div key={index} className={slideClass}>
            {child}
          </div>
        );
      })}
    </div>
  );
}

