import { useState, useRef } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import { generateId, calculateQuadrant, type CoveyTask } from '../utils/storage';
import QuadrantView from '../components/CoveyMatrix/QuadrantView';
import CoveyStatisticsView from '../components/CoveyMatrix/CoveyStatisticsView';
import CoveyDocumentationView from '../components/CoveyMatrix/CoveyDocumentationView';
import WizardContainer from '../components/Wizard/WizardContainer';
import Step1Name from '../components/CoveyMatrix/CreateTask/Step1Name';
import Step2Description from '../components/CoveyMatrix/CreateTask/Step2Description';
import Step5Date from '../components/CoveyMatrix/CreateTask/Step5Date';

interface CoveyMatrixPageProps {
  storage: ReturnType<typeof useCloudStorage>;
}

const sectionTitles = ['Q1', 'Q2', 'Q3', 'Q4', 'Статистика', 'Документация'];

export default function CoveyMatrixPage({ storage }: CoveyMatrixPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const minSwipeDistance = 50;
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState<CoveyTask | null>(null);
  const [creatingQuadrant, setCreatingQuadrant] = useState<'q1' | 'q2' | 'q3' | 'q4' | null>(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [taskData, setTaskData] = useState<{
    title?: string;
    description?: string;
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

  const handleCreateTask = (quadrant: 'q1' | 'q2' | 'q3' | 'q4') => {
    setIsCreating(true);
    setIsEditing(false);
    setEditingTask(null);
    setCreatingQuadrant(quadrant);
    setWizardStep(0);
    setTaskData({});
  };

  const handleEdit = (task: CoveyTask) => {
    setIsEditing(true);
    setIsCreating(false);
    setEditingTask(task);
    setCreatingQuadrant(task.quadrant);
    setWizardStep(0);
    setTaskData({
      title: task.title,
      description: task.description,
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

  const handleStep3Complete = (date?: number) => {
    if (!creatingQuadrant) return;

    // Определяем важность и срочность по квадранту
    const quadrantValues = {
      q1: { important: true, urgent: true },
      q2: { important: true, urgent: false },
      q3: { important: false, urgent: true },
      q4: { important: false, urgent: false }
    };

    const { important, urgent } = quadrantValues[creatingQuadrant];
    const finalData = { ...taskData, date };

    if (isEditing && editingTask) {
      storage.updateCoveyTask(editingTask.id, {
        title: finalData.title!,
        description: finalData.description,
        important,
        urgent,
        quadrant: creatingQuadrant,
        date: finalData.date
      });
    } else {
      const newTask: CoveyTask = {
        id: generateId(),
        title: finalData.title!,
        description: finalData.description,
        important,
        urgent,
        quadrant: creatingQuadrant,
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
    setCreatingQuadrant(null);
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
      setCreatingQuadrant(null);
      setTaskData({});
    }
  };

  const handleSkip = () => {
    handleStep3Complete(taskData.date);
  };

  if (isCreating || isEditing) {
    return (
      <WizardContainer
        currentStep={wizardStep}
        totalSteps={3}
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
            <Step5Date
              onNext={handleStep3Complete}
              onBack={handleBack}
              onSkip={handleSkip}
              initialValue={taskData.date}
            />
          </div>
        )}
      </WizardContainer>
    );
  }

  const getQuadrantTitle = (index: number) => {
    const titles = {
      0: 'Важно и срочно',
      1: 'Важно, но не срочно',
      2: 'Не важно, но срочно',
      3: 'Не важно и не срочно',
      4: 'Статистика'
    };
    return titles[index as keyof typeof titles] || sectionTitles[index];
  };

  return (
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
        padding: '12px 8px',
        borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
        backgroundColor: 'var(--tg-theme-bg-color)',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {sectionTitles.map((title, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              fontSize: '14px',
              fontWeight: currentSlide === index ? '600' : '400',
              color: currentSlide === index 
                ? 'var(--tg-theme-button-color)' 
                : 'var(--tg-theme-hint-color)',
              cursor: 'pointer',
              padding: '8px 8px',
              borderBottom: currentSlide === index 
                ? '2px solid var(--tg-theme-button-color)' 
                : '2px solid transparent',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              flexShrink: 0
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
          <QuadrantView 
            quadrant="q1" 
            storage={storage} 
            onEdit={handleEdit}
            onCreateTask={handleCreateTask}
          />
        </div>
        <div className={`slide ${currentSlide === 1 ? 'active' : currentSlide > 1 ? 'prev' : 'next'}`}>
          <QuadrantView 
            quadrant="q2" 
            storage={storage} 
            onEdit={handleEdit}
            onCreateTask={handleCreateTask}
          />
        </div>
        <div className={`slide ${currentSlide === 2 ? 'active' : currentSlide > 2 ? 'prev' : 'next'}`}>
          <QuadrantView 
            quadrant="q3" 
            storage={storage} 
            onEdit={handleEdit}
            onCreateTask={handleCreateTask}
          />
        </div>
        <div className={`slide ${currentSlide === 3 ? 'active' : currentSlide > 3 ? 'prev' : 'next'}`}>
          <QuadrantView 
            quadrant="q4" 
            storage={storage} 
            onEdit={handleEdit}
            onCreateTask={handleCreateTask}
          />
        </div>
        <div className={`slide ${currentSlide === 4 ? 'active' : currentSlide > 4 ? 'prev' : 'next'}`}>
          <CoveyStatisticsView storage={storage} />
        </div>
        <div className={`slide ${currentSlide === 5 ? 'active' : currentSlide > 5 ? 'prev' : 'next'}`}>
          <CoveyDocumentationView />
        </div>
      </div>
    </div>
  );
}
