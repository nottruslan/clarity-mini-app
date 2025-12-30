import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step11DreamsProps {
  onNext: (dreams: string) => void;
  onBack: () => void;
  initialData?: string;
}

export default function Step11Dreams({ onNext, onBack, initialData }: Step11DreamsProps) {
  const [dreams, setDreams] = useState(initialData || '');

  return (
    <WizardSlide
      icon="🌟"
      title="Мечтай по-крупному"
      description="Как выглядит твой предстоящий год? Что будет идеальным развитием событий? Почему этот год будет замечательным?"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(dreams)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%' }}>
        <textarea
          className="wizard-input"
          placeholder="Напиши, нарисуй, освободись от ожиданий и не бойся мечтать"
          value={dreams}
          onChange={(e) => setDreams(e.target.value)}
          rows={8}
          style={{ marginTop: 0, resize: 'vertical', minHeight: '150px' }}
        />
      </div>
    </WizardSlide>
  );
}

