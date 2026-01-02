import { useEffect, useRef } from 'react';
import { Section } from '../../types/navigation';
import { sectionColors, sectionLabels } from '../../utils/sectionColors';

export type { Section };

interface NavigationMenuProps {
  isOpen: boolean;
  currentSection: Section;
  onClose: () => void;
  onSectionSelect: (section: Section) => void;
}

const sections: Section[] = ['home', 'tasks', 'habits', 'finance', 'languages', 'yearly-report', 'covey-matrix', 'books', 'diary'];

export default function NavigationMenu({ 
  isOpen, 
  currentSection, 
  onClose, 
  onSectionSelect 
}: NavigationMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        backdropRef.current &&
        backdropRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSelect = (section: Section) => {
    onSectionSelect(section);
    onClose();
  };

  return (
    <>
      <div 
        ref={backdropRef}
        className={`navigation-menu-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        onTouchEnd={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
      <div 
        ref={menuRef}
        className={`navigation-menu ${isOpen ? 'open' : ''}`}
      >
        <div className="navigation-menu-header">
          <h3 className="navigation-menu-title">Разделы</h3>
          <button
            className="navigation-menu-close"
            onClick={onClose}
            onTouchEnd={(e) => {
              e.preventDefault();
              onClose();
            }}
            aria-label="Закрыть меню"
          >
            ✕
          </button>
        </div>
        <div className="navigation-menu-list">
          {sections.map((section) => {
            const colors = sectionColors[section];
            const label = sectionLabels[section];
            const isActive = currentSection === section;

            return (
              <div
                key={section}
                className={`navigation-menu-item ${isActive ? 'active' : ''}`}
                onClick={() => handleSelect(section)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleSelect(section);
                }}
                style={{
                  backgroundColor: isActive ? colors.secondary : 'transparent',
                  borderLeft: isActive ? `4px solid ${colors.primary}` : '4px solid transparent'
                }}
              >
                <div 
                  className="navigation-menu-item-icon"
                  style={{ backgroundColor: colors.primary }}
                >
                  {colors.icon}
                </div>
                <div className="navigation-menu-item-content">
                  <span className="navigation-menu-item-label">{label}</span>
                </div>
                {isActive && (
                  <div className="navigation-menu-item-check">✓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

