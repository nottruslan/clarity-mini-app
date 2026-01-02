import { useState, useRef } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import { generateId, calculateQuadrant, type CoveyTask } from '../utils/storage';
import CoveyMatrixView from '../components/CoveyMatrix/CoveyMatrixView';
import CoveyStatisticsView from '../components/CoveyMatrix/CoveyStatisticsView';
import WizardContainer from '../components/Wizard/WizardContainer';
import Step1Name from '../components/CoveyMatrix/CreateTask/Step1Name';
import Step2Description from '../components/CoveyMatrix/CreateTask/Step2Description';
import Step3Importance from '../components/CoveyMatrix/CreateTask/Step3Importance';
import Step4Urgency from '../components/CoveyMatrix/CreateTask/Step4Urgency';
import Step5Date from '../components/CoveyMatrix/CreateTask/Step5Date';

interface CoveyMatrixPageProps {
  storage: ReturnType<typeof useCloudStorage>;
}

const sectionTitles = ['Матрица', 'Статистика'];

export default function CoveyMatrixPage({ storage }: CoveyMatrixPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const minSwipeDistance = 50;
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState<CoveyTask | null>(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [taskData, setTaskData] = useState<{
    title?: string;
    description?: string;
    important?: boolean;
    urgent?: boolean;
    date?: number;
  }>({});

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

  const handleStartCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setEditingTask(null);
    setWizardStep(0);
    setTaskData({});
  };

  const handleEdit = (task: CoveyTask) => {
    setIsEditing(true);
    setIsCreating(false);
    setEditingTask(task);
    setWizardStep(0);
    setTaskData({
      title: task.title,
      description: task.description,
      important: task.important,
      urgent: task.urgent,
      date: task.date
    });
  };

  const handleStep1Complete = (name: string) => {
    setTaskData({ ...taskData, title: name });
    setWizardStep(1);
  };

  const handleStep2Complete = (description: string) => {
    setTaskData({ ...taskData, description });
    setWizardStep(2);
  };

  const handleStep3Complete = (important: boolean) => {
    setTaskData({ ...taskData, important });
    setWizardStep(3);
  };

  const handleStep4Complete = (urgent: boolean) => {
    setTaskData({ ...taskData, urgent });
    setWizardStep(4);
  };

  const handleStep5Complete = (date?: number) => {
    const finalData = { ...taskData, date };
    const quadrant = calculateQuadrant(finalData.important || false, finalData.urgent || false);
    
    if (isEditing && editingTask) {
      storage.updateCoveyTask(editingTask.id, {
        title: finalData.title!,
        description: finalData.description,
        important: finalData.important!,
        urgent: finalData.urgent!,
        quadrant,
        date: finalData.date
      });
    } else {
      const newTask: CoveyTask = {
        id: generateId(),
        title: finalData.title!,
        description: finalData.description,
        important: finalData.important!,
        urgent: finalData.urgent!,
        quadrant,
        date: finalData.date,
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      storage.addCoveyTask(newTask);
    }
    
    setIsCreating(false);
    setIsEditing(false);
    setEditingTask(null);
    setWizardStep(0);
    setTaskData({});
  };

  const handleBack = () => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
    } else {
      setIsCreating(false);
      setIsEditing(false);
      setEditingTask(null);
      setTaskData({});
    }
  };

  const handleSkip = () => {
    handleStep5Complete(taskData.date);
  };

  if (isCreating || isEditing) {
    return (
      <WizardContainer
        currentStep={wizardStep}
        totalSteps={5}
      >
        <div className={`wizard-slide ${wizardStep === 0 ? 'active' : wizardStep > 0 ? 'prev' : 'next'}`}>
          <Step1Name
            onNext={handleStep1Complete}
            onBack={handleBack}
            initialValue={taskData.title}
          />
        </div>
        {taskData.title && (
          <div className={`wizard-slide ${wizardStep === 1 ? 'active' : wizardStep > 1 ? 'prev' : 'next'}`}>
            <Step2Description
              onNext={handleStep2Complete}
              onBack={handleBack}
              initialValue={taskData.description}
            />
          </div>
        )}
        {taskData.title && (
          <div className={`wizard-slide ${wizardStep === 2 ? 'active' : wizardStep > 2 ? 'prev' : 'next'}`}>
            <Step3Importance
              onNext={handleStep3Complete}
              onBack={handleBack}
              initialValue={taskData.important}
            />
          </div>
        )}
        {taskData.title && taskData.important !== undefined && (
          <div className={`wizard-slide ${wizardStep === 3 ? 'active' : wizardStep > 3 ? 'prev' : 'next'}`}>
            <Step4Urgency
              onNext={handleStep4Complete}
              onBack={handleBack}
              initialValue={taskData.urgent}
            />
          </div>
        )}
        {taskData.title && taskData.important !== undefined && taskData.urgent !== undefined && (
          <div className={`wizard-slide ${wizardStep === 4 ? 'active' : wizardStep > 4 ? 'prev' : 'next'}`}>
            <Step5Date
              onNext={handleStep5Complete}
              onBack={handleBack}
              onSkip={handleSkip}
              initialValue={taskData.date}
            />
          </div>
        )}
      </WizardContainer>
    );
  }

  return (
    <>
      {/* FAB кнопка */}
      {currentSlide === 0 && (
        <button
          onClick={handleStartCreate}
          className="fab"
          style={{
            position: 'fixed',
            bottom: 'calc(20px + env(safe-area-inset-bottom))',
            right: '20px',
            zIndex: 10001
          }}
        >
          +
        </button>
      )}

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
          <div className={`slide ${currentSlide === 0 ? 'active' : currentSlide > 0 ? 'prev' : 'next'}`}>
            <CoveyMatrixView storage={storage} onEdit={handleEdit} />
          </div>
          <div className={`slide ${currentSlide === 1 ? 'active' : currentSlide > 1 ? 'prev' : 'next'}`}>
            <CoveyStatisticsView storage={storage} />
          </div>
        </div>
      </div>
    </>
  );
}
