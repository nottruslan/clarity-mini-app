import { useState } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import { generateId, type Task } from '../utils/storage';
import TaskList from '../components/Tasks/TaskList';
import WizardContainer from '../components/Wizard/WizardContainer';
import Step1Name from '../components/Tasks/CreateTask/Step1Name';
import Step2Priority from '../components/Tasks/CreateTask/Step2Priority';
import Step3Date from '../components/Tasks/CreateTask/Step3Date';
import { useOnboarding } from '../hooks/useOnboarding';
import LottieAnimation from '../components/LottieAnimation';
import { sectionColors } from '../utils/sectionColors';

interface TasksPageProps {
  storage: ReturnType<typeof useCloudStorage>;
}

export default function TasksPage({ storage }: TasksPageProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [createStep, setCreateStep] = useState(0);
  const [taskData, setTaskData] = useState<{
    name?: string;
    priority?: 'low' | 'medium' | 'high';
  }>({});
  
  const { shouldShow: showOnboarding, handleClose: closeOnboarding } = useOnboarding('tasks');

  const handleStartCreate = () => {
    setIsCreating(true);
    setCreateStep(0);
    setTaskData({});
  };

  const handleStep1Complete = (name: string) => {
    setTaskData({ name });
    setCreateStep(1);
  };

  const handleStep2Complete = (priority: 'low' | 'medium' | 'high') => {
    setTaskData(prev => ({ ...prev, priority }));
    setCreateStep(2);
  };

  const handleStep3Complete = async (dueDate?: number) => {
    const newTask: Task = {
      id: generateId(),
      text: taskData.name!,
      completed: false,
      createdAt: Date.now(),
      priority: taskData.priority,
      dueDate
    };

    await storage.addTask(newTask);
    setIsCreating(false);
    setCreateStep(0);
    setTaskData({});
  };

  const handleBack = () => {
    if (createStep > 0) {
      setCreateStep(createStep - 1);
    } else {
      setIsCreating(false);
      setTaskData({});
    }
  };

  const handleToggle = async (id: string) => {
    const task = storage.tasks.find(t => t.id === id);
    if (task) {
      await storage.updateTask(id, { completed: !task.completed });
    }
  };

  const handleDelete = async (id: string) => {
    await storage.deleteTask(id);
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
          Задачи
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: 'var(--tg-theme-hint-color)',
          marginBottom: '32px',
          maxWidth: '300px'
        }}>
          Создавайте задачи и отслеживайте их выполнение. Свайпните влево для удаления.
        </p>
        <button className="tg-button" onClick={closeOnboarding}>
          Понятно
        </button>
      </div>
    );
  }

  if (isCreating) {
    const colors = sectionColors.tasks;
    
    return (
      <WizardContainer 
        currentStep={createStep + 1} 
        totalSteps={3}
        progressColor={colors.primary}
      >
        <div 
          className={`wizard-slide ${createStep === 0 ? 'active' : createStep > 0 ? 'prev' : 'next'}`}
        >
          <Step1Name 
            onNext={handleStep1Complete}
          />
        </div>
        <div 
          className={`wizard-slide ${createStep === 1 ? 'active' : createStep > 1 ? 'prev' : 'next'}`}
        >
          <Step2Priority 
            onNext={handleStep2Complete}
            onBack={handleBack}
          />
        </div>
        <div 
          className={`wizard-slide ${createStep === 2 ? 'active' : createStep > 2 ? 'prev' : 'next'}`}
        >
          <Step3Date 
            onComplete={handleStep3Complete}
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
      <TaskList 
        tasks={storage.tasks}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
      <button 
        className="fab"
        onClick={handleStartCreate}
        aria-label="Создать задачу"
      >
        +
      </button>
    </div>
  );
}

