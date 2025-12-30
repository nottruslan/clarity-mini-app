import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';
import { type PastYearData } from '../../../utils/storage';

interface Step14AchievementsProps {
  onNext: (achievements: PastYearData['achievements']) => void;
  onBack: () => void;
  initialData?: PastYearData['achievements'];
}

export default function Step14Achievements({ onNext, onBack, initialData }: Step14AchievementsProps) {
  const defaultAchievements = [
    { achievement: '', howAchieved: '', whoHelped: '' },
    { achievement: '', howAchieved: '', whoHelped: '' },
    { achievement: '', howAchieved: '', whoHelped: '' }
  ];
  const [achievements, setAchievements] = useState<NonNullable<PastYearData['achievements']>>(
    initialData || defaultAchievements
  );

  const updateAchievement = (index: number, field: 'achievement' | 'howAchieved' | 'whoHelped', value: string) => {
    const newAchievements = [...achievements];
    newAchievements[index] = { ...newAchievements[index], [field]: value };
    setAchievements(newAchievements);
  };

  return (
    <WizardSlide
      icon="🏆"
      title="Достижения"
      description="Ваши главные достижения"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(achievements)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {achievements.map((achievement, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600' }}>
              Достижение {index + 1}
            </h3>
            <input
              type="text"
              className="wizard-input"
              placeholder="Что ты сделал(а)?"
              value={achievement.achievement}
              onChange={(e) => updateAchievement(index, 'achievement', e.target.value)}
              style={{ marginTop: 0 }}
            />
            <textarea
              className="wizard-input"
              placeholder="Что ты сделал(а), чтобы этого достичь?"
              value={achievement.howAchieved}
              onChange={(e) => updateAchievement(index, 'howAchieved', e.target.value)}
              rows={2}
              style={{ marginTop: 0 }}
            />
            <textarea
              className="wizard-input"
              placeholder="Кто тебе в этом помог? Каким образом?"
              value={achievement.whoHelped}
              onChange={(e) => updateAchievement(index, 'whoHelped', e.target.value)}
              rows={2}
              style={{ marginTop: 0 }}
            />
          </div>
        ))}
      </div>
    </WizardSlide>
  );
}

