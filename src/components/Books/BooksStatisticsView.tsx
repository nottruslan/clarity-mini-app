import { BooksData, BookGoal } from '../../utils/storage';

interface BooksStatisticsViewProps {
  booksData: BooksData;
  onCreateGoal?: () => void;
  onDeleteGoal?: (goalId: string) => void;
}

export default function BooksStatisticsView({ booksData, onCreateGoal, onDeleteGoal }: BooksStatisticsViewProps) {
  const books = booksData.books || [];
  const goals = booksData.goals || [];

  const stats = {
    total: books.length,
    wantToRead: books.filter(b => b.status === 'want-to-read').length,
    reading: books.filter(b => b.status === 'reading').length,
    completed: books.filter(b => b.status === 'completed').length,
    paused: books.filter(b => b.status === 'paused').length,
    abandoned: books.filter(b => b.status === 'abandoned').length
  };

  const ratedBooks = books.filter(b => b.rating);
  const averageRating = ratedBooks.length > 0
    ? ratedBooks.reduce((sum, b) => sum + (b.rating || 0), 0) / ratedBooks.length
    : 0;

  // Статистика по месяцам (прочитанные книги)
  const completedBooksByMonth: Record<string, number> = {};
  books.filter(b => b.status === 'completed' && b.completedDate).forEach(book => {
    const date = new Date(book.completedDate!);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    completedBooksByMonth[key] = (completedBooksByMonth[key] || 0) + 1;
  });

  const statCardStyle = {
    padding: '20px',
    borderRadius: '16px',
    backgroundColor: 'var(--tg-theme-secondary-bg-color)',
    marginBottom: '16px'
  };

  return (
    <div style={{ 
      flex: 1, 
      padding: '16px',
      overflowY: 'auto' as const
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--tg-theme-text-color)', marginBottom: '16px' }}>
          Статистика
        </h2>

        {/* Общая статистика */}
        <div style={statCardStyle}>
          <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '12px' }}>
            Всего книг
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--tg-theme-text-color)' }}>
            {stats.total}
          </div>
        </div>

        {/* Статистика по статусам */}
        <div style={statCardStyle}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--tg-theme-text-color)', marginBottom: '16px' }}>
            По статусам
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--tg-theme-text-color)' }}>Хочу прочитать</span>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#2196f3' }}>{stats.wantToRead}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--tg-theme-text-color)' }}>Читаю</span>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#ff9800' }}>{stats.reading}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--tg-theme-text-color)' }}>Прочитано</span>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#4caf50' }}>{stats.completed}</span>
            </div>
            {stats.paused > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'var(--tg-theme-text-color)' }}>На паузе</span>
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#ffc107' }}>{stats.paused}</span>
              </div>
            )}
            {stats.abandoned > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'var(--tg-theme-text-color)' }}>Брошено</span>
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#f44336' }}>{stats.abandoned}</span>
              </div>
            )}
          </div>
        </div>

        {/* Средний рейтинг */}
        {ratedBooks.length > 0 && (
          <div style={statCardStyle}>
            <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginBottom: '12px' }}>
              Средний рейтинг
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--tg-theme-text-color)' }}>
                {averageRating.toFixed(1)}
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <span key={i} style={{ fontSize: '20px', color: i <= Math.round(averageRating) ? '#ffc107' : '#ccc' }}>
                    ★
                  </span>
                ))}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginLeft: 'auto' }}>
                ({ratedBooks.length} {ratedBooks.length === 1 ? 'книга' : 'книг'})
              </div>
            </div>
          </div>
        )}

        {/* Цели */}
        <div style={statCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--tg-theme-text-color)' }}>
              Цели
            </div>
            {onCreateGoal && (
              <button
                onClick={onCreateGoal}
                style={{
                  padding: '8px 16px',
                  background: 'var(--tg-theme-button-color)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'var(--tg-theme-button-text-color)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                + Добавить
              </button>
            )}
          </div>
            {goals.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--tg-theme-hint-color)', padding: '20px' }}>
                Нет целей. Создайте первую цель!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {goals.map(goal => {
                  // Пересчитываем completedCount на основе книг со статусом 'completed' в периоде
                  const completedInPeriod = books.filter(b => {
                    if (b.status !== 'completed' || !b.completedDate) return false;
                    return b.completedDate >= goal.startDate && b.completedDate <= goal.endDate;
                  }).length;
                  
                  const actualCompleted = completedInPeriod;
                  const progress = (actualCompleted / goal.targetCount) * 100;
                  const periodLabel = goal.period === 'year' 
                    ? `${goal.year} год`
                    : `${new Date(2000, (goal.month || 1) - 1).toLocaleDateString('ru-RU', { month: 'long' })} ${goal.year}`;
                  
                  return (
                    <div key={goal.id} style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', color: 'var(--tg-theme-text-color)' }}>
                          {goal.targetCount} книг за {periodLabel}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--tg-theme-text-color)' }}>
                          {actualCompleted} / {goal.targetCount}
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${Math.min(progress, 100)}%`,
                          height: '100%',
                          backgroundColor: 'var(--tg-theme-button-color)',
                          transition: 'width 0.3s'
                        }} />
                      </div>
                      {onDeleteGoal && (
                        <button
                          onClick={() => {
                            if (window.confirm('Удалить цель?')) {
                              onDeleteGoal(goal.id);
                            }
                          }}
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            padding: '4px 8px',
                            background: 'transparent',
                            border: 'none',
                            color: '#f44336',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
