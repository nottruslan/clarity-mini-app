import { useState } from 'react';
import { FinanceData } from '../../utils/storage';
import { Period, filterTransactionsByPeriod } from './PeriodSelector';
import CategoryChart from './CategoryChart';
import TrendsChart from './TrendsChart';
import PieChart from './PieChart';

interface StatisticsViewProps {
  finance: FinanceData;
  period: Period;
  onBudgetClick?: () => void;
}

export default function StatisticsView({ finance, period, onBudgetClick }: StatisticsViewProps) {
  const [activeTab, setActiveTab] = useState<'categories' | 'trends' | 'statistics'>('categories');
  
  const periodTransactions = filterTransactionsByPeriod(finance.transactions || [], period);

  const transactions = periodTransactions;
  const categories = finance.categories || [];

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  return (
    <div style={{
      background: 'var(--tg-theme-section-bg-color)',
      padding: '16px',
      borderBottom: '1px solid var(--tg-theme-secondary-bg-color)'
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
        {onBudgetClick && (
          <button
            onClick={onBudgetClick}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--tg-theme-text-color)',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            💰 Управление бюджетом
          </button>
        )}
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
                marginBottom: '16px'
              }}>
                Расходы по категориям
              </h3>
              <CategoryChart
                transactions={transactions}
                categories={categories}
                type="expense"
              />
            </div>
          )}
          {incomeTransactions.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                Доходы по категориям
              </h3>
              <CategoryChart
                transactions={transactions}
                categories={categories}
                type="income"
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
            marginBottom: '16px'
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
          {expenseTransactions.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                Расходы по категориям
              </h3>
              <PieChart
                transactions={transactions}
                categories={categories}
                type="expense"
              />
            </div>
          )}
          {incomeTransactions.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                Доходы по категориям
              </h3>
              <PieChart
                transactions={transactions}
                categories={categories}
                type="income"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

