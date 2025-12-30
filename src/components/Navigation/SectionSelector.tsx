import { useState, useRef, useEffect } from 'react';

export type Section = 'home' | 'tasks' | 'habits' | 'finance' | 'languages';

interface SectionSelectorProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
}

const sections: { id: Section; label: string }[] = [
  { id: 'home', label: 'Главная' },
  { id: 'tasks', label: 'Задачи' },
  { id: 'habits', label: 'Привычки' },
  { id: 'finance', label: 'Финансы' },
  { id: 'languages', label: 'Языки' }
];

export default function SectionSelector({ 
  currentSection, 
  onSectionChange 
}: SectionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLabel = sections.find(s => s.id === currentSection)?.label || 'Главная';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (section: Section) => {
    onSectionChange(section);
    setIsOpen(false);
  };

  return (
    <div className="section-selector" ref={dropdownRef}>
      <button 
        className="section-selector-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentLabel}</span>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
          ▼
        </span>
      </button>
      <div className={`section-selector-dropdown ${isOpen ? 'open' : ''}`}>
        {sections.map((section) => (
          <div
            key={section.id}
            className="section-option"
            onClick={() => handleSelect(section.id)}
            style={{
              backgroundColor: currentSection === section.id 
                ? 'var(--tg-theme-secondary-bg-color)' 
                : 'transparent'
            }}
          >
            {section.label}
          </div>
        ))}
      </div>
    </div>
  );
}

