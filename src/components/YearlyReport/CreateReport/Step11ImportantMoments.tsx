import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';
import { type PastYearData } from '../../../utils/storage';

interface Step11ImportantMomentsProps {
  onNext: (moments: PastYearData['importantMoments']) => void;
  onBack: () => void;
  initialData?: PastYearData['importantMoments'];
}

export default function Step11ImportantMoments({ onNext, onBack, initialData }: Step11ImportantMomentsProps) {
  const [moments, setMoments] = useState({
    wisestDecision: initialData?.wisestDecision || '',
    biggestLesson: initialData?.biggestLesson || '',
    biggestRisk: initialData?.biggestRisk || '',
    biggestSurprise: initialData?.biggestSurprise || '',
    importantForOthers: initialData?.importantForOthers || '',
    biggestCompletion: initialData?.biggestCompletion || ''
  });

  const momentsList = [
    { key: 'wisestDecision' as const, label: 'Самое мудрое решение, которое я принял(а)...', icon: '🧠' },
    { key: 'biggestLesson' as const, label: 'Самый большой урок, который я вынес(ла)...', icon: '📚' },
    { key: 'biggestRisk' as const, label: 'Самый крупный мой риск...', icon: '🎲' },
    { key: 'biggestSurprise' as const, label: 'Самый большой сюрприз года...', icon: '🎁' },
    { key: 'importantForOthers' as const, label: 'Самая важная вещь, которую я сделал(а) для других...', icon: '❤️' },
    { key: 'biggestCompletion' as const, label: 'Самое большое дело, которое я завершил(а)...', icon: '✅' }
  ];

  return (
    <WizardSlide
      icon="⭐"
      title="Важные моменты"
      description="Вспомните ключевые моменты прошедшего года"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(moments)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {momentsList.map((moment) => (
          <div key={moment.key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ 
              fontSize: '14px', 
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>{moment.icon}</span>
              <span>{moment.label}</span>
            </label>
            <textarea
              className="wizard-input"
              placeholder="Ваш ответ..."
              value={moments[moment.key]}
              onChange={(e) => setMoments({ ...moments, [moment.key]: e.target.value })}
              rows={2}
              style={{ marginTop: 0, resize: 'vertical', minHeight: '50px' }}
            />
          </div>
        ))}
      </div>
    </WizardSlide>
  );
}

