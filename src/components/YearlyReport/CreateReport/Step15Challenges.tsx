import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';
import { type PastYearData } from '../../../utils/storage';

interface Step15ChallengesProps {
  onNext: (challenges: PastYearData['challenges']) => void;
  onBack: () => void;
  initialData?: PastYearData['challenges'];
}

export default function Step15Challenges({ onNext, onBack, initialData }: Step15ChallengesProps) {
  const defaultChallenges = [
    { challenge: '', whoHelped: '', whatLearned: '' },
    { challenge: '', whoHelped: '', whatLearned: '' },
    { challenge: '', whoHelped: '', whatLearned: '' }
  ];
  const [challenges, setChallenges] = useState<NonNullable<PastYearData['challenges']>>(
    initialData || defaultChallenges
  );

  const updateChallenge = (index: number, field: 'challenge' | 'whoHelped' | 'whatLearned', value: string) => {
    const newChallenges = [...challenges];
    newChallenges[index] = { ...newChallenges[index], [field]: value };
    setChallenges(newChallenges);
  };

  return (
    <WizardSlide
      icon="💪"
      title="Испытания"
      description="С какими трудностями вы столкнулись?"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(challenges)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {challenges.map((challenge, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600' }}>
              Испытание {index + 1}
            </h3>
            <textarea
              className="wizard-input"
              placeholder="Опишите испытание"
              value={challenge.challenge}
              onChange={(e) => updateChallenge(index, 'challenge', e.target.value)}
              rows={2}
              style={{ marginTop: 0 }}
            />
            <textarea
              className="wizard-input"
              placeholder="Кто или что помогли тебе справиться с этим испытанием?"
              value={challenge.whoHelped}
              onChange={(e) => updateChallenge(index, 'whoHelped', e.target.value)}
              rows={2}
              style={{ marginTop: 0 }}
            />
            <textarea
              className="wizard-input"
              placeholder="Что ты узнал(а) о себе, проходя через это испытание?"
              value={challenge.whatLearned}
              onChange={(e) => updateChallenge(index, 'whatLearned', e.target.value)}
              rows={2}
              style={{ marginTop: 0 }}
            />
          </div>
        ))}
      </div>
    </WizardSlide>
  );
}

