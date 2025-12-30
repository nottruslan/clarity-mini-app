import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step5UnitProps {
  name: string;
  onNext: (unit: string, targetValue: number | undefined) => void;
  onBack: () => void;
}

const commonUnits = [
  { id: 'none', name: 'Без единицы', placeholder: 'Просто отметка' },
  { id: 'times', name: 'Разы', placeholder: 'Количество раз' },
  { id: 'minutes', name: 'Минуты', placeholder: 'Время в минутах' },
  { id: 'hours', name: 'Часы', placeholder: 'Время в часах' },
  { id: 'liters', name: 'Литры', placeholder: 'Объем в литрах' },
  { id: 'glasses', name: 'Стаканы', placeholder: 'Количество стаканов' },
  { id: 'pages', name: 'Страницы', placeholder: 'Количество страниц' },
  { id: 'km', name: 'Километры', placeholder: 'Расстояние в км' },
  { id: 'steps', name: 'Шаги', placeholder: 'Количество шагов' },
  { id: 'custom', name: 'Своя единица', placeholder: 'Введите единицу' }
];

export default function Step5Unit({ name, onNext, onBack }: Step5UnitProps) {
  const [selectedUnit, setSelectedUnit] = useState<string>('none');
  const [customUnit, setCustomUnit] = useState<string>('');
  const [targetValue, setTargetValue] = useState<number | undefined>(undefined);
  const [showTargetInput, setShowTargetInput] = useState(false);

  const handleUnitSelect = (unitId: string) => {
    setSelectedUnit(unitId);
    if (unitId !== 'none') {
      setShowTargetInput(true);
    } else {
      setShowTargetInput(false);
      setTargetValue(undefined);
    }
  };

  const handleNext = () => {
    const unit = selectedUnit === 'custom' ? customUnit : (selectedUnit === 'none' ? undefined : commonUnits.find(u => u.id === selectedUnit)?.name || '');
    onNext(unit || '', showTargetInput ? targetValue : undefined);
  };

  return (
    <WizardSlide
      icon="📊"
      title="Единица измерения"
      description={`Как вы будете измерять "${name}"?`}
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton
            variant="secondary"
            onClick={onBack}
          >
            Назад
          </GradientButton>
          <GradientButton
            onClick={handleNext}
            disabled={selectedUnit === 'custom' && !customUnit.trim()}
          >
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '12px',
          marginBottom: '8px'
        }}>
          {commonUnits.map((unit) => (
            <button
              key={unit.id}
              onClick={() => handleUnitSelect(unit.id)}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: `2px solid ${selectedUnit === unit.id ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)'}`,
                background: selectedUnit === unit.id 
                  ? 'rgba(51, 144, 236, 0.1)' 
                  : 'var(--tg-theme-section-bg-color)',
                fontSize: '14px',
                fontWeight: selectedUnit === unit.id ? '600' : '400',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              {unit.name}
            </button>
          ))}
        </div>

        {selectedUnit === 'custom' && (
          <input
            type="text"
            className="wizard-input"
            placeholder="Введите единицу измерения"
            value={customUnit}
            onChange={(e) => setCustomUnit(e.target.value)}
            style={{ marginTop: '8px' }}
          />
        )}

        {showTargetInput && (
          <div style={{ marginTop: '8px' }}>
            <label style={{ 
              fontSize: '14px', 
              color: 'var(--tg-theme-hint-color)', 
              marginBottom: '8px', 
              display: 'block' 
            }}>
              Целевое значение (опционально):
            </label>
            <input
              type="number"
              className="wizard-input"
              placeholder={commonUnits.find(u => u.id === selectedUnit)?.placeholder || 'Целевое значение'}
              value={targetValue || ''}
              onChange={(e) => {
                const value = e.target.value ? parseFloat(e.target.value) : undefined;
                setTargetValue(value);
              }}
              min="0"
              step={selectedUnit === 'minutes' || selectedUnit === 'hours' ? '0.1' : '1'}
            />
          </div>
        )}
      </div>
    </WizardSlide>
  );
}

