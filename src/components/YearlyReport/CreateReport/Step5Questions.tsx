import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';
import { type PastYearData } from '../../../utils/storage';

interface Step5QuestionsProps {
  onNext: (questions: PastYearData['questions']) => void;
  onBack: () => void;
  initialData?: PastYearData['questions'];
}

export default function Step5Questions({ onNext, onBack, initialData }: Step5QuestionsProps) {
  const [questions, setQuestions] = useState({
    proudOf: initialData?.proudOf || '',
    threePeopleInfluenced: initialData?.threePeopleInfluenced || ['', '', ''],
    threePeopleInfluencedBy: initialData?.threePeopleInfluencedBy || ['', '', ''],
    unfinished: initialData?.unfinished || '',
    bestDiscovery: initialData?.bestDiscovery || '',
    mostGrateful: initialData?.mostGrateful || ''
  });

  const updatePerson = (index: number, value: string, type: 'influenced' | 'influencedBy') => {
    const key = type === 'influenced' ? 'threePeopleInfluenced' : 'threePeopleInfluencedBy';
    const newArray = [...questions[key]];
    newArray[index] = value;
    setQuestions({ ...questions, [key]: newArray });
  };

  return (
    <WizardSlide
      icon="❓"
      title="Шесть вопросов о прошедшем годе"
      description="Ответьте на эти важные вопросы"
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton variant="secondary" onClick={onBack}>
            Назад
          </GradientButton>
          <GradientButton onClick={() => onNext(questions)}>
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>
            Чем ты гордишься больше всего?
          </label>
          <textarea
            className="wizard-input"
            placeholder="Ваш ответ..."
            value={questions.proudOf}
            onChange={(e) => setQuestions({ ...questions, proudOf: e.target.value })}
            rows={2}
            style={{ marginTop: 0 }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>
            Какие три человека оказали на тебя наибольшее влияние?
          </label>
          {[0, 1, 2].map((index) => (
            <input
              key={index}
              type="text"
              className="wizard-input"
              placeholder={`Человек ${index + 1}`}
              value={questions.threePeopleInfluenced[index]}
              onChange={(e) => updatePerson(index, e.target.value, 'influenced')}
              style={{ marginTop: index === 0 ? 0 : '8px' }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>
            На каких трех людей оказывал(а) наибольшее влияние ты?
          </label>
          {[0, 1, 2].map((index) => (
            <input
              key={index}
              type="text"
              className="wizard-input"
              placeholder={`Человек ${index + 1}`}
              value={questions.threePeopleInfluencedBy[index]}
              onChange={(e) => updatePerson(index, e.target.value, 'influencedBy')}
              style={{ marginTop: index === 0 ? 0 : '8px' }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>
            Что у тебя не получилось завершить?
          </label>
          <textarea
            className="wizard-input"
            placeholder="Ваш ответ..."
            value={questions.unfinished}
            onChange={(e) => setQuestions({ ...questions, unfinished: e.target.value })}
            rows={2}
            style={{ marginTop: 0 }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>
            Самое лучшее, что ты открыл(а) в себе?
          </label>
          <textarea
            className="wizard-input"
            placeholder="Ваш ответ..."
            value={questions.bestDiscovery}
            onChange={(e) => setQuestions({ ...questions, bestDiscovery: e.target.value })}
            rows={2}
            style={{ marginTop: 0 }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>
            За что ты больше всего благодарен(а)?
          </label>
          <textarea
            className="wizard-input"
            placeholder="Ваш ответ..."
            value={questions.mostGrateful}
            onChange={(e) => setQuestions({ ...questions, mostGrateful: e.target.value })}
            rows={2}
            style={{ marginTop: 0 }}
          />
        </div>
      </div>
    </WizardSlide>
  );
}

