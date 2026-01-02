import { useState, useEffect, useRef } from 'react';
import { Book } from '../../utils/storage';

interface EditBookModalProps {
  book: Book;
  onSave: (updates: Partial<Book>) => void;
  onClose: () => void;
}

const statuses = [
  { id: 'want-to-read', name: 'Хочу прочитать', icon: '📖', color: '#2196f3' },
  { id: 'reading', name: 'Читаю', icon: '📘', color: '#ff9800' },
  { id: 'completed', name: 'Прочитано', icon: '✅', color: '#4caf50' },
  { id: 'paused', name: 'На паузе', icon: '⏸️', color: '#ffc107' },
  { id: 'abandoned', name: 'Брошено', icon: '❌', color: '#f44336' }
] as const;

const genres = [
  { id: 'fiction', name: 'Художественная', icon: '📖' },
  { id: 'non-fiction', name: 'Нон-фикшн', icon: '📚' },
  { id: 'biography', name: 'Биография', icon: '👤' },
  { id: 'self-help', name: 'Саморазвитие', icon: '🌟' },
  { id: 'business', name: 'Бизнес', icon: '💼' },
  { id: 'science', name: 'Наука', icon: '🔬' },
  { id: 'history', name: 'История', icon: '🏛️' },
  { id: 'philosophy', name: 'Философия', icon: '🤔' },
  { id: 'psychology', name: 'Психология', icon: '🧠' },
  { id: 'fantasy', name: 'Фэнтези', icon: '🧙' },
  { id: 'sci-fi', name: 'Научная фантастика', icon: '🚀' },
  { id: 'other', name: 'Прочее', icon: '⭐' }
];

export default function EditBookModal({ book, onSave, onClose }: EditBookModalProps) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author || '');
  const [status, setStatus] = useState<Book['status']>(book.status);
  const [rating, setRating] = useState<number | undefined>(book.rating);
  const [genre, setGenre] = useState(book.genre || '');
  const [coverUrl, setCoverUrl] = useState(book.coverUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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

  const handleSave = () => {
    const updates: Partial<Book> = {
      title: title.trim(),
      author: author.trim() || undefined,
      status,
      rating: rating || undefined,
      genre: genre || undefined,
      coverUrl: coverUrl || undefined,
      updatedAt: Date.now()
    };
    
    // Устанавливаем даты в зависимости от статуса
    if (status === 'reading' && !book.startDate) {
      updates.startDate = Date.now();
    }
    if (status === 'completed' && !book.completedDate) {
      updates.completedDate = Date.now();
    }
    
    onSave(updates);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 10000,
      paddingTop: 'env(safe-area-inset-top)'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--tg-theme-bg-color)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        padding: '8px 0 20px',
        paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--tg-theme-text-color)', margin: 0 }}>
              Редактировать книгу
            </h2>
            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--tg-theme-text-color)'
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
              Название
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--tg-theme-secondary-bg-color)',
                borderRadius: '12px',
                backgroundColor: 'var(--tg-theme-bg-color)',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
              Автор
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--tg-theme-secondary-bg-color)',
                borderRadius: '12px',
                backgroundColor: 'var(--tg-theme-bg-color)',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
              Статус
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {statuses.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStatus(s.id)}
                  style={{
                    padding: '12px',
                    border: `2px solid ${status === s.id ? s.color : 'var(--tg-theme-secondary-bg-color)'}`,
                    borderRadius: '12px',
                    background: status === s.id ? `${s.color}20` : 'transparent',
                    color: 'var(--tg-theme-text-color)',
                    fontSize: '14px',
                    fontWeight: status === s.id ? '600' : '400',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'center'
                  }}
                >
                  <span>{s.icon}</span>
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
              Рейтинг (1-5)
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  onClick={() => setRating(rating === i ? undefined : i)}
                  style={{
                    padding: '8px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '32px',
                    cursor: 'pointer',
                    color: rating && i <= rating ? '#ffc107' : '#ccc'
                  }}
                >
                  ★
                </button>
              ))}
              {rating && (
                <button
                  onClick={() => setRating(undefined)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid var(--tg-theme-hint-color)',
                    borderRadius: '8px',
                    background: 'transparent',
                    color: 'var(--tg-theme-hint-color)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    marginLeft: '8px'
                  }}
                >
                  Убрать
                </button>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
              Жанр
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--tg-theme-secondary-bg-color)',
                borderRadius: '12px',
                backgroundColor: 'var(--tg-theme-bg-color)',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px'
              }}
            >
              <option value="">Не выбран</option>
              {genres.map(g => (
                <option key={g.id} value={g.id}>{g.icon} {g.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '8px' }}>
              Обложка
            </label>
            {coverUrl ? (
              <div style={{ marginBottom: '8px' }}>
                <img
                  src={coverUrl}
                  alt="Обложка"
                  style={{
                    width: '100px',
                    height: '150px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    border: '2px solid var(--tg-theme-secondary-bg-color)'
                  }}
                />
                <button
                  onClick={() => {
                    setCoverUrl('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    background: 'transparent',
                    border: '1px solid #f44336',
                    borderRadius: '8px',
                    color: '#f44336',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Удалить
                </button>
              </div>
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
                    padding: '16px',
                    background: 'var(--tg-theme-secondary-bg-color)',
                    border: '2px dashed var(--tg-theme-hint-color)',
                    borderRadius: '12px',
                    color: 'var(--tg-theme-text-color)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Выбрать изображение
                </button>
                {error && (
                  <div style={{ color: '#f44336', fontSize: '12px', marginTop: '8px' }}>
                    {error}
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                background: 'transparent',
                border: '1px solid var(--tg-theme-secondary-bg-color)',
                borderRadius: '12px',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              style={{
                flex: 1,
                padding: '14px',
                background: title.trim() ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)',
                border: 'none',
                borderRadius: '12px',
                color: title.trim() ? 'var(--tg-theme-button-text-color)' : 'var(--tg-theme-hint-color)',
                fontSize: '16px',
                fontWeight: '600',
                cursor: title.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

