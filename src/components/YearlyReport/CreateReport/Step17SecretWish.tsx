import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step17SecretWishProps {
  onNext: (secretWish: string) => void;
  onBack: () => void;
  initialData?: string;
}

export default function Step17SecretWish({ onNext, onBack, initialData }: Step17SecretWishProps) {
  const [secretWish, setSecretWish] = useState(initialData || '');

  return (
    <WizardSlide
      icon="🔮"
      title="Секретное желание"
      description="Дай волю воображению. Какое секретное желание ты загадаешь на следующий год?"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(secretWish)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%' }}>
        <textarea
          className="wizard-input"
          placeholder="Ваше секретное желание..."
          value={secretWish}
          onChange={(e) => setSecretWish(e.target.value)}
          rows={6}
          style={{ marginTop: 0, resize: 'vertical', minHeight: '120px' }}
        />
      </div>
    </WizardSlide>
  );
}

