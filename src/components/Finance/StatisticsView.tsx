import { useState } from 'react';
import { FinanceData, Transaction } from '../../utils/storage';
import { Period, filterTransactionsByPeriod } from './PeriodSelector';
import CategoryChart from './CategoryChart';
import TrendsChart from './TrendsChart';
import PieChart from './PieChart';
import CategoryTransactionsBottomSheet from './CategoryTransactionsBottomSheet';

interface StatisticsViewProps {
  finance: FinanceData;
  period: Period;
}

export default function StatisticsView({ finance, period }: StatisticsViewProps) {
  const [activeTab, setActiveTab] = useState<'categories' | 'trends' | 'statistics'>('statistics');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryType, setSelectedCategoryType] = useState<'income' | 'expense' | null>(null);
  
  // Убеждаемся, что transactions всегда является массивом
  const allTransactions = Array.isArray(finance.transactions) ? finance.transactions : [];
  const periodTransactions = filterTransactionsByPeriod(allTransactions, period);

  const transactions = periodTransactions;
  const categories = finance.categories || [];

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const [otherCategoryNames, setOtherCategoryNames] = useState<string[]>([]);

  const handleCategoryClick = (categoryName: string, type: 'income' | 'expense', otherNames?: string[]) => {
    setSelectedCategory(categoryName);
    setSelectedCategoryType(type);
    setOtherCategoryNames(otherNames || []);
  };

  const getCategoryTransactions = (categoryName: string, type: 'income' | 'expense'): Transaction[] => {
    if (categoryName === 'Прочее' && otherCategoryNames.length > 0) {
      // Для категории "Прочее" показываем транзакции из всех объединенных категорий
      return transactions.filter(t => otherCategoryNames.includes(t.category) && t.type === type);
    }
    return transactions.filter(t => t.category === categoryName && t.type === type);
  };

  return (
    <div style={{
      background: 'var(--tg-theme-section-bg-color)',
      padding: '20px 16px',
      paddingBottom: '40px',
      minHeight: '100%'
    }}>
      <div style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '20px',
        backgroundColor: 'var(--tg-theme-secondary-bg-color)',
        borderRadius: '12px',
        padding: '4px'
      }}>
        <button
          onClick={() => setActiveTab('categories')}
          style={{
            flex: 1,
            padding: '10px 8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'categories'
              ? 'var(--tg-theme-button-color)'
              : 'transparent',
            color: activeTab === 'categories'
              ? 'var(--tg-theme-button-text-color)'
              : 'var(--tg-theme-text-color)',
            fontSize: '13px',
            fontWeight: activeTab === 'categories' ? '600' : '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          По категориям
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          style={{
            flex: 1,
            padding: '10px 8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'trends'
              ? 'var(--tg-theme-button-color)'
              : 'transparent',
            color: activeTab === 'trends'
              ? 'var(--tg-theme-button-text-color)'
              : 'var(--tg-theme-text-color)',
            fontSize: '13px',
            fontWeight: activeTab === 'trends' ? '600' : '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          Тренды
        </button>
        <button
          onClick={() => setActiveTab('statistics')}
          style={{
            flex: 1,
            padding: '10px 8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'statistics'
              ? 'var(--tg-theme-button-color)'
              : 'transparent',
            color: activeTab === 'statistics'
              ? 'var(--tg-theme-button-text-color)'
              : 'var(--tg-theme-text-color)',
            fontSize: '13px',
            fontWeight: activeTab === 'statistics' ? '600' : '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          Статистика
        </button>
      </div>

      {activeTab === 'categories' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {expenseTransactions.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: 'var(--tg-theme-text-color)'
              }}>
                Расходы по категориям
              </h3>
              <CategoryChart
                transactions={transactions}
                categories={categories}
                type="expense"
                onCategoryClick={(categoryName) => handleCategoryClick(categoryName, 'expense')}
              />
            </div>
          )}
          {incomeTransactions.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: 'var(--tg-theme-text-color)'
              }}>
                Доходы по категориям
              </h3>
              <CategoryChart
                transactions={transactions}
                categories={categories}
                type="income"
                onCategoryClick={(categoryName) => handleCategoryClick(categoryName, 'income')}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'trends' && (
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--tg-theme-text-color)'
          }}>
            Динамика доходов и расходов
          </h3>
          <TrendsChart
            transactions={transactions}
            period={period}
          />
        </div>
      )}

      {activeTab === 'statistics' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}>
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
              textAlign: 'center',
              color: 'var(--tg-theme-text-color)'
            }}>
              Расходы по категориям
            </h3>
            <PieChart
              transactions={transactions}
              categories={categories}
              type="expense"
              onCategoryClick={(categoryName, otherNames) => handleCategoryClick(categoryName, 'expense', otherNames)}
            />
          </div>
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
              textAlign: 'center',
              color: 'var(--tg-theme-text-color)'
            }}>
              Доходы по категориям
            </h3>
            <PieChart
              transactions={transactions}
              categories={categories}
              type="income"
              onCategoryClick={(categoryName, otherNames) => handleCategoryClick(categoryName, 'income', otherNames)}
            />
          </div>
        </div>
      )}

      {selectedCategory && selectedCategoryType && (
        <CategoryTransactionsBottomSheet
          categoryName={selectedCategory}
          transactions={getCategoryTransactions(selectedCategory, selectedCategoryType)}
          onClose={() => {
            setSelectedCategory(null);
            setSelectedCategoryType(null);
          }}
        />
      )}
    </div>
  );
}

