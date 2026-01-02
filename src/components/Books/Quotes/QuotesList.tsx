import { Quote } from '../../../utils/storage';
import QuoteItem from './QuoteItem';
import EmptyState from '../../EmptyState';

interface QuotesListProps {
  quotes: Quote[];
  onDelete?: (quoteId: string) => void;
}

export default function QuotesList({ quotes, onDelete }: QuotesListProps) {
  if (quotes.length === 0) {
    return (
      <EmptyState 
        message="Цитат пока нет. Добавьте первую цитату!"
      />
    );
  }

  return (
    <div>
      {quotes.map((quote) => (
        <QuoteItem
          key={quote.id}
          quote={quote}
          onDelete={onDelete ? () => onDelete(quote.id) : undefined}
        />
      ))}
    </div>
  );
}

