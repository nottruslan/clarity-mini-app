import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step30WordOfYearProps {
  onNext: (wordOfYear: string) => void;
  onBack: () => void;
  initialData?: string;
}

export default function Step30WordOfYear({ onNext, onBack, initialData }: Step30WordOfYearProps) {
  const [wordOfYear, setWordOfYear] = useState(initialData || '');

  return (
    <WizardSlide
      icon="🔤"
      title="Слово года"
      description="Какое слово будет вашим символом года?"
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

