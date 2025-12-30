import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step16WordOfYearProps {
  onNext: (wordOfYear: string) => void;
  onBack: () => void;
  initialData?: string;
}

export default function Step16WordOfYear({ onNext, onBack, initialData }: Step16WordOfYearProps) {
  const [wordOfYear, setWordOfYear] = useState(initialData || '');

  return (
    <WizardSlide
      icon="🔤"
      title="Мое слово для будущего года"
      description="Подбери слово, которое бы символизировало или определяло твой новый год. Это слово будет для тебя источником второго дыхания, чтобы ты не сдавалась и не отказывалась от своей мечты."
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(wordOfYear)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%' }}>
        <input
          type="text"
          className="wizard-input"
          placeholder="Ваше слово года..."
          value={wordOfYear}
          onChange={(e) => setWordOfYear(e.target.value)}
          style={{ marginTop: 0, fontSize: '24px', textAlign: 'center', fontWeight: '600' }}
        />
      </div>
    </WizardSlide>
  );
}

