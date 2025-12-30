import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';
import { type PastYearData } from '../../../utils/storage';

interface Step10SummaryProps {
  onNext: (summary: PastYearData['summary']) => void;
  onBack: () => void;
  initialData?: PastYearData['summary'];
}

export default function Step10Summary({ onNext, onBack, initialData }: Step10SummaryProps) {
  const [summary, setSummary] = useState({
    threeWords: initialData?.threeWords || ['', '', ''],
    bookTitle: initialData?.bookTitle || '',
    goodbye: initialData?.goodbye || ''
  });

  const updateWord = (index: number, value: string) => {
    const newWords = [...summary.threeWords];
    newWords[index] = value;
    setSummary({ ...summary, threeWords: newWords });
  };

  return (
    <WizardSlide
      icon="📖"
      title="Итоговое резюме прошлого года"
      description="Подведите итоги прошедшего года"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(summary)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '16px', fontWeight: '600' }}>
            Прошедший год в трёх словах
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0, 1, 2].map((index) => (
              <input
                key={index}
                type="text"
                className="wizard-input"
                placeholder={`Слово ${index + 1}`}
                value={summary.threeWords[index]}
                onChange={(e) => updateWord(index, e.target.value)}
                style={{ marginTop: 0, flex: 1 }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '16px', fontWeight: '600' }}>
            Книга моего прошлого года
          </label>
          <p style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
            О том, как прошел твой предыдущий год, была написана книга или снят фильм. Как бы ты их назвал(а)?
          </p>
          <input
            type="text"
            className="wizard-input"
            placeholder="Название книги или фильма"
            value={summary.bookTitle}
            onChange={(e) => setSummary({ ...summary, bookTitle: e.target.value })}
            style={{ marginTop: 0 }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '16px', fontWeight: '600' }}>
            До свидания, прошлый год!
          </label>
          <p style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
            Если ты хочешь записать что-нибудь ещё, или хочешь с кем-то попрощаться, сделай это сейчас.
          </p>
          <textarea
            className="wizard-input"
            placeholder="Ваше прощание..."
            value={summary.goodbye}
            onChange={(e) => setSummary({ ...summary, goodbye: e.target.value })}
            rows={4}
            style={{ marginTop: 0 }}
          />
        </div>
      </div>
    </WizardSlide>
  );
}

