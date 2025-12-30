import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step13BestMomentsProps {
  onNext: (bestMoments: string) => void;
  onBack: () => void;
  initialData?: string;
}

export default function Step13BestMoments({ onNext, onBack, initialData }: Step13BestMomentsProps) {
  const [bestMoments, setBestMoments] = useState(initialData || '');

  return (
    <WizardSlide
      icon="✨"
      title="Лучшие моменты"
      description="Опишите лучшие моменты прошедшего года"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(bestMoments)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%' }}>
        <textarea
          className="wizard-input"
          placeholder="Опишите ваши лучшие моменты..."
          value={bestMoments}
          onChange={(e) => setBestMoments(e.target.value)}
          rows={8}
          style={{ marginTop: 0, resize: 'vertical', minHeight: '150px' }}
        />
      </div>
    </WizardSlide>
  );
}

