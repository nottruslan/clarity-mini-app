import { useState, useRef } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';

interface Step5CoverProps {
  title: string;
  onNext: (coverUrl?: string) => void;
  onBack: () => void;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const WARN_FILE_SIZE = 500 * 1024; // 500KB

export default function Step5Cover({ title, onNext, onBack }: Step5CoverProps) {
  const [coverUrl, setCoverUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`Размер файла слишком большой (максимум ${Math.round(MAX_FILE_SIZE / 1024)}KB)`);
      return;
    }

    if (file.size > WARN_FILE_SIZE) {
      // Предупреждение, но продолжаем
      console.warn('Большой размер файла, это может повлиять на производительность');
    }

    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setCoverUrl(result);
      }
    };
    reader.onerror = () => {
      setError('Ошибка при чтении файла');
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setCoverUrl(undefined);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNext = () => {
    onNext(coverUrl);
  };

  const handleSkip = () => {
    onNext(undefined);
  };

  return (
    <WizardSlide
      icon="🖼️"
      title="Обложка"
      description={`Добавьте обложку для "${title}" (опционально)`}
      actions={
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <GradientButton
            variant="secondary"
            onClick={onBack}
          >
            Назад
          </GradientButton>
          <GradientButton onClick={handleNext}>
            Создать
          </GradientButton>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', alignItems: 'center' }}>
        {coverUrl ? (
          <>
            <div
              style={{
                width: '200px',
                height: '300px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2px solid var(--tg-theme-secondary-bg-color)',
                position: 'relative'
              }}
            >
              <img
                src={coverUrl}
                alt="Обложка"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <button
              onClick={handleRemove}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: '1px solid var(--tg-theme-hint-color)',
                borderRadius: '12px',
                color: 'var(--tg-theme-hint-color)',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Удалить обложку
            </button>
          </>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '24px',
                background: 'var(--tg-theme-secondary-bg-color)',
                border: '2px dashed var(--tg-theme-hint-color)',
                borderRadius: '12px',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '48px' }}>📷</span>
              <span>Выбрать изображение</span>
            </button>
            {error && (
              <div style={{ color: '#f44336', fontSize: '14px', textAlign: 'center' }}>
                {error}
              </div>
            )}
            <button
              onClick={handleSkip}
              style={{
                padding: '12px',
                background: 'transparent',
                border: '1px solid var(--tg-theme-hint-color)',
                borderRadius: '12px',
                color: 'var(--tg-theme-hint-color)',
                fontSize: '14px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Пропустить
            </button>
          </>
        )}
      </div>
    </WizardSlide>
  );
}

