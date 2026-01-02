import { useState, useRef } from 'react';
import { type Section } from '../../types/navigation';
import { sectionColors } from '../../utils/sectionColors';

interface SectionCarouselProps {
  sections: { id: Section; label: string; icon: string; description: string }[];
  onSectionClick: (section: Section) => void;
}

export default function SectionCarousel({ sections, onSectionClick }: SectionCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < sections.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        style={{
          display: 'flex',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translateX(-${currentIndex * 100}%)`
        }}
      >
        {sections.map((section) => (
          <div
            key={section.id}
            style={{
              minWidth: '100%',
              width: '100%',
              flexShrink: 0,
              padding: '0 16px',
              boxSizing: 'border-box'
            }}
          >
            <button
              className="list-item"
              onClick={() => onSectionClick(section.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                cursor: 'pointer',
                backgroundColor: 'var(--tg-theme-bg-color)',
                borderRadius: '12px',
                border: '1px solid var(--tg-theme-secondary-bg-color)',
                textAlign: 'left'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: sectionColors[section.id].secondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0
                }}
              >
                {section.icon}
              </div>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  minWidth: 0
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--tg-theme-text-color)',
                    wordBreak: 'break-word'
                  }}
                >
                  {section.label}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'var(--tg-theme-hint-color)',
                    lineHeight: '1.4',
                    wordBreak: 'break-word'
                  }}
                >
                  {section.description}
                </div>
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: 'var(--tg-theme-hint-color)',
                  flexShrink: 0
                }}
              >
                →
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Индикаторы */}
      {sections.length > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '16px',
            padding: '0 16px'
          }}
        >
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: currentIndex === index
                  ? 'var(--tg-theme-button-color)'
                  : 'var(--tg-theme-secondary-bg-color)',
                cursor: 'pointer',
                padding: 0,
                transition: 'background-color 0.2s'
              }}
              aria-label={`Перейти к разделу ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

