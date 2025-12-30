import { Habit } from '../../utils/storage';
import { calculateLevel, getExperienceForNextLevel, calculateTotalExperience } from '../../utils/habitCalculations';

interface LevelIndicatorProps {
  habit: Habit;
}

export default function LevelIndicator({ habit }: LevelIndicatorProps) {
  const totalExp = calculateTotalExperience(habit);
  const currentLevel = calculateLevel(totalExp);
  const expForNextLevel = getExperienceForNextLevel(currentLevel);
  const expForCurrentLevel = getExperienceForNextLevel(currentLevel - 1);
  const progress = ((totalExp - expForCurrentLevel) / (expForNextLevel - expForCurrentLevel)) * 100;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      background: 'var(--tg-theme-secondary-bg-color)',
      borderRadius: '8px',
      fontSize: '12px'
    }}>
      <span style={{ fontWeight: '600' }}>Уровень {currentLevel}</span>
      <div style={{
        flex: 1,
        height: '6px',
        background: 'var(--tg-theme-bg-color)',
        borderRadius: '3px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          width: `${Math.min(progress, 100)}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #3390ec 0%, #1e6bc7 100%)',
          transition: 'width 0.3s ease'
        }} />
      </div>
      <span style={{ 
        color: 'var(--tg-theme-hint-color)',
        fontSize: '11px',
        whiteSpace: 'nowrap'
      }}>
        {Math.round(totalExp - expForCurrentLevel)}/{Math.round(expForNextLevel - expForCurrentLevel)} XP
      </span>
    </div>
  );
}

