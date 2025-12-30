import { useState } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import { generateId, type Transaction, type Category } from '../utils/storage';
import FinanceOverview from '../components/Finance/FinanceOverview';
import TransactionList from '../components/Finance/TransactionList';
import TransactionDetails from '../components/Finance/TransactionDetails';
import TransactionFilters, { type FilterOptions } from '../components/Finance/TransactionFilters';
import StatisticsView from '../components/Finance/StatisticsView';
import BudgetManager from '../components/Finance/BudgetManager';
import BudgetOverview from '../components/Finance/BudgetOverview';
import WizardContainer from '../components/Wizard/WizardContainer';
import Step1Type from '../components/Finance/CreateTransaction/Step1Type';
import Step2Amount from '../components/Finance/CreateTransaction/Step2Amount';
import Step3Category from '../components/Finance/CreateTransaction/Step3Category';
import Step4Date from '../components/Finance/CreateTransaction/Step4Date';
import Step5Description from '../components/Finance/CreateTransaction/Step5Description';
import { useOnboarding } from '../hooks/useOnboarding';
import LottieAnimation from '../components/LottieAnimation';
import { sectionColors } from '../utils/sectionColors';
import { type Period, filterTransactionsByPeriod } from '../components/Finance/PeriodSelector';
import { useFinanceFilters } from '../hooks/useFinanceFilters';

interface FinancePageProps {
  storage: ReturnType<typeof useCloudStorage>;
}

export default function FinancePage({ storage }: FinancePageProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({ type: 'all' });
  const [createStep, setCreateStep] = useState(0);
  const [period] = useState<Period>('month');
  const [transactionData, setTransactionData] = useState<{
    type?: 'income' | 'expense';
    amount?: number;
    category?: string;
    date?: number;
  }>({});
  
  const { shouldShow: showOnboarding, handleClose: closeOnboarding } = useOnboarding('finance');
  
  const periodFiltered = filterTransactionsByPeriod(storage.finance.transactions, period);
  const filteredTransactions = useFinanceFilters(periodFiltered, filters);

  const handleStartCreate = () => {
    setIsCreating(true);
    setCreateStep(0);
    setTransactionData({});
  };

  const handleStep1Complete = (type: 'income' | 'expense') => {
    setTransactionData({ type });
    setCreateStep(1);
  };

  const handleStep2Complete = (amount: number) => {
    setTransactionData(prev => ({ ...prev, amount }));
    setCreateStep(2);
  };

  const handleStep3Complete = (category: string) => {
    setTransactionData(prev => ({ ...prev, category }));
    setCreateStep(3);
  };

  const handleStep4Complete = (date: number) => {
    setTransactionData(prev => ({ ...prev, date }));
    setCreateStep(4);
  };

  const handleStep5Complete = async (description?: string) => {
    if (isEditing && editingTransaction) {
      await storage.updateTransaction(editingTransaction.id, {
        type: transactionData.type!,
        amount: transactionData.amount!,
        category: transactionData.category!,
        date: transactionData.date!,
        description
      });
      setIsEditing(false);
      setEditingTransaction(null);
    } else {
      const newTransaction: Transaction = {
        id: generateId(),
        type: transactionData.type!,
        amount: transactionData.amount!,
        category: transactionData.category!,
        date: transactionData.date!,
        description,
        createdAt: Date.now()
      };
      await storage.addTransaction(newTransaction);
    }
    setIsCreating(false);
    setCreateStep(0);
    setTransactionData({});
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setTransactionData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date
    });
    setCreateStep(0);
    setIsCreating(true);
    setIsEditing(true);
    setSelectedTransaction(null);
  };

  const handleDelete = async (transaction: Transaction) => {
    await storage.deleteTransaction(transaction.id);
    setSelectedTransaction(null);
  };

  const handleDuplicate = (transaction: Transaction) => {
    setTransactionData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      date: Date.now()
    });
    setCreateStep(0);
    setIsCreating(true);
    setIsEditing(false);
    setSelectedTransaction(null);
  };

  const handleCreateCategory = async (name: string) => {
    const newCategory: Category = {
      id: generateId(),
      name,
      type: transactionData.type!,
      color: transactionData.type === 'income' ? '#4caf50' : '#f44336'
    };

    await storage.addCategory(newCategory);
  };

  const handleBack = () => {
    if (createStep > 0) {
      setCreateStep(createStep - 1);
    } else {
      setIsCreating(false);
      setTransactionData({});
    }
  };

  if (showOnboarding) {
    return (
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        textAlign: 'center'
      }}>
        <div style={{ width: '200px', height: '200px', marginBottom: '24px' }}>
          <LottieAnimation loop={true} autoplay={true} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
          Финансы
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: 'var(--tg-theme-hint-color)',
          marginBottom: '32px',
          maxWidth: '300px'
        }}>
          Отслеживайте доходы и расходы. Создавайте категории и анализируйте статистику.
        </p>
        <button className="tg-button" onClick={closeOnboarding}>
          Понятно
        </button>
      </div>
    );
  }

  if (isCreating) {
    const colors = sectionColors.finance;
    
    return (
      <WizardContainer 
        currentStep={createStep + 1} 
        totalSteps={5}
        progressColor={colors.primary}
      >
        <div 
          className={`wizard-slide ${createStep === 0 ? 'active' : createStep > 0 ? 'prev' : 'next'}`}
        >
          <Step1Type onNext={handleStep1Complete} />
        </div>
        {transactionData.type && (
          <div 
            className={`wizard-slide ${createStep === 1 ? 'active' : createStep > 1 ? 'prev' : 'next'}`}
          >
            <Step2Amount 
              type={transactionData.type}
              onNext={handleStep2Complete}
              onBack={handleBack}
            />
          </div>
        )}
        {transactionData.type && transactionData.amount && (
          <div 
            className={`wizard-slide ${createStep === 2 ? 'active' : createStep > 2 ? 'prev' : 'next'}`}
          >
            <Step3Category 
              type={transactionData.type}
              categories={storage.finance.categories}
              onNext={handleStep3Complete}
              onBack={handleBack}
              onCreateCategory={handleCreateCategory}
            />
          </div>
        )}
        {transactionData.type && transactionData.amount && transactionData.category && (
          <div 
            className={`wizard-slide ${createStep === 3 ? 'active' : createStep > 3 ? 'prev' : 'next'}`}
          >
            <Step4Date 
              type={transactionData.type}
              amount={transactionData.amount}
              category={transactionData.category}
              onNext={handleStep4Complete}
              onBack={handleBack}
            />
          </div>
        )}
        {transactionData.type && transactionData.amount && transactionData.category && transactionData.date && (
          <div 
            className={`wizard-slide ${createStep === 4 ? 'active' : createStep > 4 ? 'prev' : 'next'}`}
          >
            <Step5Description 
              type={transactionData.type}
              amount={transactionData.amount}
              category={transactionData.category}
              date={transactionData.date}
              onComplete={handleStep5Complete}
              onBack={handleBack}
            />
          </div>
        )}
      </WizardContainer>
    );
  }

  return (
    <>
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        paddingTop: '0px',
        overflow: 'hidden'
      }}>
        <FinanceOverview finance={storage.finance} />
        <BudgetOverview 
          budgets={storage.finance.budgets || []}
          transactions={storage.finance.transactions}
        />
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setShowBudget(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--tg-theme-button-color)',
              backgroundColor: 'transparent',
              color: 'var(--tg-theme-button-color)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            💰 Управление бюджетом
          </button>
        </div>
        <StatisticsView finance={storage.finance} period={period} />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid var(--tg-theme-secondary-bg-color)'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Транзакции ({filteredTransactions.length})
          </div>
          <button
            onClick={() => setShowFilters(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--tg-theme-secondary-bg-color)',
              backgroundColor: 'var(--tg-theme-secondary-bg-color)',
              color: 'var(--tg-theme-text-color)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            🔍 Фильтры
          </button>
        </div>
        <TransactionList 
          transactions={filteredTransactions}
          onTransactionClick={handleTransactionClick}
        />
        <button 
          className="fab"
          onClick={handleStartCreate}
          aria-label="Добавить транзакцию"
        >
          +
        </button>
      </div>
      {selectedTransaction && (
        <TransactionDetails
          transaction={selectedTransaction}
          onEdit={() => handleEdit(selectedTransaction)}
          onDelete={() => handleDelete(selectedTransaction)}
          onDuplicate={() => handleDuplicate(selectedTransaction)}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
      {showFilters && (
        <TransactionFilters
          categories={storage.finance.categories}
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
      {showBudget && (
        <BudgetManager
          budgets={storage.finance.budgets || []}
          categories={storage.finance.categories}
          transactions={storage.finance.transactions}
          onBudgetAdd={(budget) => storage.addBudget(budget)}
          onBudgetUpdate={(budget) => storage.updateBudget(budget)}
          onBudgetDelete={(categoryId) => storage.deleteBudget(categoryId)}
          onClose={() => setShowBudget(false)}
        />
      )}
    </>
  );
}

