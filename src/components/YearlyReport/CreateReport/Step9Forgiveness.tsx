import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step9ForgivenessProps {
  onNext: (forgiveness: string) => void;
  onBack: () => void;
  initialData?: string;
}

export default function Step9Forgiveness({ onNext, onBack, initialData }: Step9ForgivenessProps) {
  const [forgiveness, setForgiveness] = useState(initialData || '');

  return (
    <WizardSlide
      icon="🙏"
      title="Прощение"
      description="Случалось ли в прошлом году что-нибудь такое, за что можно было бы уже простить? Какие-то поступки или слова, которые всё ещё мучают тебя?"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(forgiveness)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%' }}>
        <textarea
          className="wizard-input"
          placeholder="Запиши это. Будь добра к себе и прости. Обдумай — и отпусти."
          value={forgiveness}
          onChange={(e) => setForgiveness(e.target.value)}
          rows={8}
          style={{ marginTop: 0, resize: 'vertical', minHeight: '150px' }}
        />
      </div>
    </WizardSlide>
  );
}

