import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';
import { type FutureYearData } from '../../../utils/storage';

interface Step27MagicTriples1Props {
  onNext: (triples: FutureYearData['magicTriples1']) => void;
  onBack: () => void;
  initialData?: FutureYearData['magicTriples1'];
}

export default function Step27MagicTriples1({ onNext, onBack, initialData }: Step27MagicTriples1Props) {
  const [triples, setTriples] = useState({
    love: initialData?.love || ['', '', ''],
    letGo: initialData?.letGo || ['', '', ''],
    achieve: initialData?.achieve || ['', '', ''],
    support: initialData?.support || ['', '', ''],
    try: initialData?.try || ['', '', ''],
    sayNo: initialData?.sayNo || ['', '', '']
  });

  const updateTriple = (key: keyof typeof triples, index: number, value: string) => {
    const newArray = [...triples[key]];
    newArray[index] = value;
    setTriples({ ...triples, [key]: newArray });
  };

  const tripleLabels = [
    { key: 'love' as const, label: 'Эти три вещи я буду любить в себе', icon: '❤️' },
    { key: 'letGo' as const, label: 'Эти три вещи я готов(а) отпустить и двигаться дальше', icon: '🕊️' },
    { key: 'achieve' as const, label: 'Три вещи, которых я хочу добиться больше всего', icon: '🎯' },
    { key: 'support' as const, label: 'Эти три человека будут моей опорой в тяжёлое время', icon: '🤝' },
    { key: 'try' as const, label: 'Эти три вещи я решусь попробовать', icon: '🚀' },
    { key: 'sayNo' as const, label: 'Этим трём вещам я готов(а) сказать "нет"', icon: '✋' }
  ];

  return (
    <WizardSlide
      icon="✨"
      title="Планы на год"
      description="Определите важные вещи"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(triples)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {tripleLabels.map((item) => (
          <div key={item.key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ 
              fontSize: '14px', 
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </label>
            {[0, 1, 2].map((index) => (
              <input
                key={index}
                type="text"
                className="wizard-input"
                placeholder={`${index + 1}.`}
                value={triples[item.key][index]}
                onChange={(e) => updateTriple(item.key, index, e.target.value)}
                style={{ marginTop: index === 0 ? 0 : '8px' }}
              />
            ))}
          </div>
        ))}
      </div>
    </WizardSlide>
  );
}

