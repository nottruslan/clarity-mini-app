import { useState, useRef } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import { generateId, type Transaction, type Category } from '../utils/storage';
import FinanceOverview from '../components/Finance/FinanceOverview';
import TransactionList from '../components/Finance/TransactionList';
import TransactionDetails from '../components/Finance/TransactionDetails';
import TransactionFilters, { type FilterOptions } from '../components/Finance/TransactionFilters';
import TransactionBottomSheet from '../components/Finance/TransactionBottomSheet';
import StatisticsView from '../components/Finance/StatisticsView';
import BudgetManager from '../components/Finance/BudgetManager';
import BudgetOverview from '../components/Finance/BudgetOverview';
import WizardContainer from '../components/Wizard/WizardContainer';
import Step1Type from '../components/Finance/CreateTransaction/Step1Type';
import Step2Amount from '../components/Finance/CreateTransaction/Step2Amount';
import Step3Category from '../components/Finance/CreateTransaction/Step3Category';
import Step4Date from '../components/Finance/CreateTransaction/Step4Date';
import Step5Description from '../components/Finance/CreateTransaction/Step5Description';
import { sectionColors } from '../utils/sectionColors';
import { type Period, filterTransactionsByPeriod } from '../components/Finance/PeriodSelector';
import { useFinanceFilters } from '../hooks/useFinanceFilters';

interface FinancePageProps {
  storage: ReturnType<typeof useCloudStorage>;
}

export default function FinancePage({ storage }: FinancePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const minSwipeDistance = 50;
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [menuTransaction, setMenuTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({ type: 'all' });
  const [createStep, setCreateStep] = useState(0);
  const [period] = useState<Period>('month');
  const [transactionData, setTransactionData] = useState<{
    type?: 'income' | 'expense';
    amount?: number;
    category?: string;
    date?: number;
  }>({});
  
  const sectionTitles = ['Обзор', 'Транзакции', 'Статистика'];
  
  const periodFiltered = filterTransactionsByPeriod(storage.finance.transactions, period);
  const filteredTransactions = useFinanceFilters(periodFiltered, filters);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < sectionTitles.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleStartCreate = (type?: 'income' | 'expense') => {
    setIsCreating(true);
    setCreateStep(type ? 1 : 0);  // Пропускаем Step1 если тип уже выбран
    setTransactionData(type ? { type } : {});
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

  const handleOpenMenu = (transaction: Transaction) => {
    setMenuTransaction(transaction);
    setShowBottomSheet(true);
  };

  const handleMenuEdit = () => {
    if (menuTransaction) {
      handleEdit(menuTransaction);
      setShowBottomSheet(false);
      setMenuTransaction(null);
    }
  };

  const handleMenuDuplicate = () => {
    if (menuTransaction) {
      handleDuplicate(menuTransaction);
      setShowBottomSheet(false);
      setMenuTransaction(null);
    }
  };

  const handleMenuDelete = () => {
    if (menuTransaction) {
      handleDelete(menuTransaction);
      setShowBottomSheet(false);
      setMenuTransaction(null);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setTransactionData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date
    });
    // Пропускаем шаг выбора типа, так как тип уже есть - начинаем с суммы
    setCreateStep(1);
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

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await storage.deleteCategory(categoryId);
    } catch (error) {
      alert('Нельзя удалить категорию, которая используется в транзакциях');
    }
  };

  const handleBack = () => {
    if (createStep > 1) {
      // Если не на первом шаге, идем назад
      setCreateStep(createStep - 1);
    } else if (createStep === 1) {
      // На шаге суммы (первый шаг при создании через кнопки или при редактировании)
      // Закрываем визард и возвращаемся в раздел финансов
      setIsCreating(false);
      setIsEditing(false);
      setEditingTransaction(null);
      setTransactionData({});
    } else {
      // На шаге выбора типа (если создание без выбранного типа)
      setIsCreating(false);
      setTransactionData({});
    }
  };


  if (isCreating) {
    const colors = sectionColors.finance;
    
    return (
      <WizardContainer 
        currentStep={createStep + 1} 
        totalSteps={transactionData.type ? 5 : 5}
        progressColor={colors.primary}
      >
        {!transactionData.type && (
        <div 
          className={`wizard-slide ${createStep === 0 ? 'active' : createStep > 0 ? 'prev' : 'next'}`}
        >
          <Step1Type onNext={handleStep1Complete} />
        </div>
        )}
        {transactionData.type && (
          <div 
            className={`wizard-slide ${createStep === 1 ? 'active' : createStep > 1 ? 'prev' : 'next'}`}
          >
            <Step2Amount 
              type={transactionData.type}
              onNext={handleStep2Complete}
              onBack={handleBack}
              initialValue={transactionData.amount}
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
              onDeleteCategory={handleDeleteCategory}
              initialCategory={transactionData.category}
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
              initialDate={transactionData.date}
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
              initialDescription={editingTransaction?.description}
            />
          </div>
        )}
      </WizardContainer>
    );
  }

  return (
    <>
      {/* FAB кнопки для создания транзакций - всегда видны */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(20px + env(safe-area-inset-bottom))',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 10001,
        pointerEvents: 'auto'
      }}>
        <button 
          onClick={() => handleStartCreate('income')}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10001
          }}
        >
          💰
        </button>
        <button 
          onClick={() => handleStartCreate('expense')}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10001
          }}
        >
          💸
        </button>
      </div>

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Заголовки разделов */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '12px 16px',
          borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
          backgroundColor: 'var(--tg-theme-bg-color)'
        }}>
          {sectionTitles.map((title, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                fontSize: '16px',
                fontWeight: currentSlide === index ? '600' : '400',
                color: currentSlide === index 
                  ? 'var(--tg-theme-button-color)' 
                  : 'var(--tg-theme-hint-color)',
                cursor: 'pointer',
                padding: '8px 12px',
                borderBottom: currentSlide === index 
                  ? '2px solid var(--tg-theme-button-color)' 
                  : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {title}
            </div>
          ))}
        </div>

        {/* Контейнер со слайдами */}
        <div
          className="slide-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Слайд 0: Обзор */}
          <div className={`slide ${currentSlide === 0 ? 'active' : currentSlide > 0 ? 'prev' : 'next'}`}>
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        paddingTop: '0px',
        paddingBottom: 'calc(100px + env(safe-area-inset-bottom))',
        overflow: 'hidden'
      }}>
        <FinanceOverview finance={storage.finance} />
        <BudgetOverview 
          budgets={storage.finance.budgets || []}
          transactions={storage.finance.transactions}
        />
            </div>
          </div>

          {/* Слайд 1: Транзакции */}
          <div className={`slide ${currentSlide === 1 ? 'active' : currentSlide > 1 ? 'prev' : 'next'}`}>
        <div style={{
              flex: 1, 
          display: 'flex',
              flexDirection: 'column', 
              position: 'relative',
              paddingTop: '0px',
              paddingBottom: 'calc(100px + env(safe-area-inset-bottom))',
              overflow: 'hidden'
            }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid var(--tg-theme-secondary-bg-color)'
        }}>
          <div style={{
            fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--tg-theme-text-color)'
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
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
            }}
          >
            🔍 Фильтры
          </button>
        </div>
        <TransactionList 
          transactions={filteredTransactions}
          onTransactionClick={handleTransactionClick}
                onOpenMenu={handleOpenMenu}
        />
            </div>
          </div>

          {/* Слайд 2: Статистика */}
          <div className={`slide ${currentSlide === 2 ? 'active' : currentSlide > 2 ? 'prev' : 'next'}`}>
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              position: 'relative',
              paddingTop: '0px',
              paddingBottom: 'calc(100px + env(safe-area-inset-bottom))',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>
        <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
          display: 'flex',
                justifyContent: 'center',
                backgroundColor: 'var(--tg-theme-section-bg-color)'
        }}>
          <button 
                  onClick={() => setShowBudget(true)}
            style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--tg-theme-secondary-bg-color)',
                    backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                    color: 'var(--tg-theme-text-color)',
                    fontSize: '14px',
                    fontWeight: '500',
              cursor: 'pointer',
                    transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
            }}
          >
                  💰 Управление бюджетом
          </button>
              </div>
              <StatisticsView finance={storage.finance} period={period} />
            </div>
          </div>
        </div>
      </div>
      {selectedTransaction && (
        <TransactionDetails
          transaction={selectedTransaction}
          onEdit={() => {}}
          onDelete={() => {}}
          onDuplicate={() => {}}
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
      {showBottomSheet && menuTransaction && (
        <TransactionBottomSheet
          onClose={() => {
            setShowBottomSheet(false);
            setMenuTransaction(null);
          }}
          onEdit={handleMenuEdit}
          onDuplicate={handleMenuDuplicate}
          onDelete={handleMenuDelete}
        />
      )}
    </>
  );
}

