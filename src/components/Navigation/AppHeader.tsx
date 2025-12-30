import { Section } from '../../types/navigation';
import { sectionColors, sectionLabels } from '../../utils/sectionColors';

export type { Section };

interface AppHeaderProps {
  currentSection: Section;
  onMenuClick: () => void;
}

export default function AppHeader({ currentSection, onMenuClick }: AppHeaderProps) {
  const colors = sectionColors[currentSection];
  const label = sectionLabels[currentSection];

  return (
    <div 
      className="app-header"
      style={{
        backgroundColor: colors.primary,
        color: colors.text,
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}
    >
      <div className="app-header-content">
        <div className="app-header-title">
          <span className="app-header-icon">{colors.icon}</span>
          <span className="app-header-label">{label}</span>
        </div>
        <button
          className="app-header-menu-button"
          onClick={onMenuClick}
          onTouchEnd={(e) => {
            e.preventDefault();
            onMenuClick();
          }}
          aria-label="Открыть меню"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}

