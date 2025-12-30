import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';
import { type PastYearData } from '../../../utils/storage';

interface Step3LifeAreasProps {
  onNext: (lifeAreas: PastYearData['lifeAreas']) => void;
  onBack: () => void;
  initialData?: PastYearData['lifeAreas'];
  isFuture?: boolean;
}

export default function Step3LifeAreas({ onNext, onBack, initialData, isFuture = false }: Step3LifeAreasProps) {
  const [areas, setAreas] = useState({
    personal: initialData?.personal || '',
    friends: initialData?.friends || '',
    health: initialData?.health || '',
    habits: initialData?.habits || '',
    career: initialData?.career || '',
    hobbies: initialData?.hobbies || '',
    psychology: initialData?.psychology || '',
    betterTomorrow: initialData?.betterTomorrow || ''
  });

  const areasList = [
    { key: 'personal' as const, label: 'Личная жизнь, семья', icon: '👨‍👩‍👧‍👦' },
    { key: 'friends' as const, label: 'Друзья, сообщество', icon: '👥' },
    { key: 'health' as const, label: 'Физическое здоровье, спорт', icon: '💪' },
    { key: 'habits' as const, label: 'Привычки, которые тебя описывают', icon: '🔥' },
    { key: 'career' as const, label: 'Карьера, обучение', icon: '💼' },
    { key: 'hobbies' as const, label: 'Отдых, хобби, творчество', icon: '🎨' },
    { key: 'psychology' as const, label: 'Психология, самопознание', icon: '🧠' },
    { key: 'betterTomorrow' as const, label: isFuture ? 'Что ты сделаешь, чтобы оставить мир лучше?' : 'Что ты сделал(а), чтобы сделать мир лучше?', icon: '🌍' }
  ];

  return (
    <WizardSlide
      icon={isFuture ? "🎯" : "📝"}
      title={isFuture ? "Цели по сферам жизни" : "События по сферам жизни"}
      description={isFuture 
        ? "Определите свои цели для каждой сферы жизни на следующий год"
        : "Какие значимые события произошли в каждой из этих сфер?"
      }
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(areas)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {areasList.map((area) => (
          <div key={area.key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ 
              fontSize: '14px', 
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>{area.icon}</span>
              <span>{area.label}</span>
            </label>
            <textarea
              className="wizard-input"
              placeholder={isFuture ? "Опишите ваши цели..." : "Опишите значимые события..."}
              value={areas[area.key]}
              onChange={(e) => setAreas({ ...areas, [area.key]: e.target.value })}
              rows={3}
              style={{ marginTop: 0, resize: 'vertical', minHeight: '60px' }}
            />
          </div>
        ))}
      </div>
    </WizardSlide>
  );
}

