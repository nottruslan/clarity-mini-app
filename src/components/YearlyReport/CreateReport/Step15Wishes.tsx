import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';
import { type FutureYearData } from '../../../utils/storage';

interface Step15WishesProps {
  onNext: (wishes: FutureYearData['wishes']) => void;
  onBack: () => void;
  initialData?: FutureYearData['wishes'];
}

export default function Step15Wishes({ onNext, onBack, initialData }: Step15WishesProps) {
  const [wishes, setWishes] = useState({
    notPostpone: initialData?.notPostpone || '',
    energyFrom: initialData?.energyFrom || '',
    bravestWhen: initialData?.bravestWhen || '',
    sayYesWhen: initialData?.sayYesWhen || '',
    advice: initialData?.advice || '',
    specialBecause: initialData?.specialBecause || ''
  });

  const wishesList = [
    { key: 'notPostpone' as const, label: 'В этом году я не буду откладывать в долгий ящик...', icon: '⏰' },
    { key: 'energyFrom' as const, label: 'В этом году я буду черпать энергию из...', icon: '⚡' },
    { key: 'bravestWhen' as const, label: 'В этом году я буду самым храбрым, когда...', icon: '🦁' },
    { key: 'sayYesWhen' as const, label: 'В этом году я скажу "да", когда...', icon: '✅' },
    { key: 'advice' as const, label: 'В этом году я советую себе...', icon: '💡' },
    { key: 'specialBecause' as const, label: 'Этот год будет для меня особенным, потому что...', icon: '🌟' }
  ];

  return (
    <WizardSlide
      icon="🎋"
      title="Шесть пожеланий на мой будущий год"
      description="Заполните эти пожелания для наступающего года"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(wishes)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {wishesList.map((wish) => (
          <div key={wish.key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ 
              fontSize: '14px', 
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>{wish.icon}</span>
              <span>{wish.label}</span>
            </label>
            <textarea
              className="wizard-input"
              placeholder="Ваш ответ..."
              value={wishes[wish.key]}
              onChange={(e) => setWishes({ ...wishes, [wish.key]: e.target.value })}
              rows={2}
              style={{ marginTop: 0, resize: 'vertical', minHeight: '50px' }}
            />
          </div>
        ))}
      </div>
    </WizardSlide>
  );
}

