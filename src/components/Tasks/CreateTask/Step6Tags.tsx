import { useState } from 'react';
import WizardSlide from '../../Wizard/WizardSlide';
import GradientButton from '../../Wizard/GradientButton';
import { TaskTag, generateId } from '../../../utils/storage';

interface Step6TagsProps {
  existingTags: TaskTag[];
  onNext: (tagIds: string[], newTags: TaskTag[]) => void;
  onBack: () => void;
}

export default function Step6Tags({ existingTags, onNext, onBack }: Step6TagsProps) {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTags, setNewTags] = useState<TaskTag[]>([]);

  const handleToggleTag = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleAddNewTag = () => {
    const trimmed = newTagName.trim();
    if (trimmed && !existingTags.some(t => t.name.toLowerCase() === trimmed.toLowerCase()) &&
        !newTags.some(t => t.name.toLowerCase() === trimmed.toLowerCase())) {
      const newTag: TaskTag = {
        id: generateId(),
        name: trimmed
      };
      setNewTags(prev => [...prev, newTag]);
      setSelectedTagIds(prev => [...prev, newTag.id]);
      setNewTagName('');
    }
  };

  const handleNext = () => {
    onNext(selectedTagIds, newTags);
  };

  return (
    <WizardSlide
      icon="🏷️"
      title="Теги"
      description="Добавьте теги для задачи (необязательно)"
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
          >
            Продолжить
          </GradientButton>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        {/* Создание нового тега */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--tg-theme-text-color)',
            marginBottom: '8px'
          }}>
            Новый тег
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Введите название тега"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddNewTag();
                }
              }}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid var(--tg-theme-secondary-bg-color)',
                backgroundColor: 'var(--tg-theme-bg-color)',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleAddNewTag}
              disabled={!newTagName.trim()}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                background: newTagName.trim()
                  ? 'var(--tg-theme-button-color)'
                  : 'var(--tg-theme-secondary-bg-color)',
                color: newTagName.trim()
                  ? 'var(--tg-theme-button-text-color)'
                  : 'var(--tg-theme-hint-color)',
                fontSize: '16px',
                fontWeight: '500',
                cursor: newTagName.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Добавить
            </button>
          </div>
        </div>

        {/* Существующие теги */}
        {(existingTags.length > 0 || newTags.length > 0) && (
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--tg-theme-text-color)',
              marginBottom: '12px'
            }}>
              Выберите теги
            </label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {[...existingTags, ...newTags].map(tag => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => handleToggleTag(tag.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      background: isSelected
                        ? tag.color || 'var(--tg-theme-button-color)'
                        : 'var(--tg-theme-secondary-bg-color)',
                      color: isSelected
                        ? '#ffffff'
                        : 'var(--tg-theme-text-color)',
                      fontSize: '14px',
                      fontWeight: isSelected ? '600' : '400',
                      cursor: 'pointer'
                    }}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </WizardSlide>
  );
}

