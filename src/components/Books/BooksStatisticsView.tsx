import { BooksData } from '../../utils/storage';

interface BooksStatisticsViewProps {
  booksData: BooksData;
}

export default function BooksStatisticsView({ booksData }: BooksStatisticsViewProps) {
  return (
    <div style={{ 
      flex: 1, 
      padding: '16px',
      overflowY: 'auto' as const
    }}>
      <div>Статистика книг</div>
    </div>
  );
}

