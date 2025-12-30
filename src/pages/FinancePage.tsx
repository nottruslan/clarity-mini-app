import { useState } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import { generateId, type Transaction, type Category } from '../utils/storage';
import FinanceOverview from '../components/Finance/FinanceOverview';
import TransactionList from '../components/Finance/TransactionList';
import WizardContainer from '../components/Wizard/WizardContainer';
import Step1Type from '../components/Finance/CreateTransaction/Step1Type';
import Step2Amount from '../components/Finance/CreateTransaction/Step2Amount';
import Step3Category from '../components/Finance/CreateTransaction/Step3Category';
import Step4Date from '../components/Finance/CreateTransaction/Step4Date';
import Step5Description from '../components/Finance/CreateTransaction/Step5Description';
import { useOnboarding } from '../hooks/useOnboarding';
import LottieAnimation from '../components/LottieAnimation';
import { sectionColors } from '../utils/sectionColors';

interface FinancePageProps {
  storage: ReturnType<typeof useCloudStorage>;
}

export default function FinancePage({ storage }: FinancePageProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [createStep, setCreateStep] = useState(0);
  const [transactionData, setTransactionData] = useState<{
    type?: 'income' | 'expense';
    amount?: number;
    category?: string;
    date?: number;
  }>({});
  
  const { shouldShow: showOnboarding, handleClose: closeOnboarding } = useOnboarding('finance');

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
    setIsCreating(false);
    setCreateStep(0);
    setTransactionData({});
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
        <div 
          className={`wizard-slide ${createStep === 1 ? 'active' : createStep > 1 ? 'prev' : 'next'}`}
        >
          <Step2Amount 
            type={transactionData.type!}
            onNext={handleStep2Complete}
            onBack={handleBack}
          />
        </div>
        <div 
          className={`wizard-slide ${createStep === 2 ? 'active' : createStep > 2 ? 'prev' : 'next'}`}
        >
          <Step3Category 
            type={transactionData.type!}
            categories={storage.finance.categories}
            onNext={handleStep3Complete}
            onBack={handleBack}
            onCreateCategory={handleCreateCategory}
          />
        </div>
        <div 
          className={`wizard-slide ${createStep === 3 ? 'active' : createStep > 3 ? 'prev' : 'next'}`}
        >
          <Step4Date 
            type={transactionData.type!}
            amount={transactionData.amount!}
            category={transactionData.category!}
            onNext={handleStep4Complete}
            onBack={handleBack}
          />
        </div>
        <div 
          className={`wizard-slide ${createStep === 4 ? 'active' : createStep > 4 ? 'prev' : 'next'}`}
        >
          <Step5Description 
            type={transactionData.type!}
            amount={transactionData.amount!}
            category={transactionData.category!}
            date={transactionData.date!}
            onComplete={handleStep5Complete}
            onBack={handleBack}
          />
        </div>
      </WizardContainer>
    );
  }

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative',
      paddingTop: '0px',
      overflow: 'hidden'
    }}>
      <FinanceOverview finance={storage.finance} />
      <TransactionList transactions={storage.finance.transactions} />
      <button 
        className="fab"
        onClick={handleStartCreate}
        aria-label="Добавить транзакцию"
      >
        +
      </button>
    </div>
  );
}

