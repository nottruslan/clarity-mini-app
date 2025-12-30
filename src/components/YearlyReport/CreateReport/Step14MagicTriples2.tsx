import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';
import { type FutureYearData } from '../../../utils/storage';

interface Step14MagicTriples2Props {
  onNext: (triples: FutureYearData['magicTriples2']) => void;
  onBack: () => void;
  initialData?: FutureYearData['magicTriples2'];
}

export default function Step14MagicTriples2({ onNext, onBack, initialData }: Step14MagicTriples2Props) {
  const [triples, setTriples] = useState({
    coziness: initialData?.coziness || ['', '', ''],
    morning: initialData?.morning || ['', '', ''],
    treat: initialData?.treat || ['', '', ''],
    places: initialData?.places || ['', '', ''],
    relationships: initialData?.relationships || ['', '', ''],
    gifts: initialData?.gifts || ['', '', '']
  });

  const updateTriple = (key: keyof typeof triples, index: number, value: string) => {
    const newArray = [...triples[key]];
    newArray[index] = value;
    setTriples({ ...triples, [key]: newArray });
  };

  const tripleLabels = [
    { key: 'coziness' as const, label: 'Этими тремя вещами я создам уют вокруг себя', icon: '🏠' },
    { key: 'morning' as const, label: 'Эти три вещи я буду делать каждое утро', icon: '🌅' },
    { key: 'treat' as const, label: 'Три вещи, которыми я буду регулярно баловать себя', icon: '🎁' },
    { key: 'places' as const, label: 'Я побываю в этих трех местах', icon: '✈️' },
    { key: 'relationships' as const, label: 'Этими тремя способами я буду налаживать и продолжать отношения с самыми близкими людьми', icon: '💕' },
    { key: 'gifts' as const, label: 'Этими тремя подарками я отблагодарю себя за успехи', icon: '🎉' }
  ];

  return (
    <WizardSlide
      icon="✨"
      title="Волшебные тройки - часть 2"
      description="Заполните эти важные тройки для наступающего года"
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

