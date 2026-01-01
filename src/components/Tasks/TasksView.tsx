import { useState } from 'react';
import { useCloudStorage } from '../../hooks/useCloudStorage';
import { type Task, generateId } from '../../utils/storage';
import TaskItem from './TaskItem';
import EmptyState from '../EmptyState';
import BottomSheet from './BottomSheet';
import TaskDetails from './TaskDetails';
import WizardContainer from '../Wizard/WizardContainer';
import Step1Name from './CreateTask/Step1Name';
import Step2Description from './CreateTask/Step2Description';
import Step3Date from './CreateTask/Step3Date';
import Step4Time from './CreateTask/Step4Time';
import Step5Priority from './CreateTask/Step5Priority';
import Step6Recurring from './CreateTask/Step6Recurring';
import { sectionColors } from '../../utils/sectionColors';

interface TasksViewProps {
  storage: ReturnType<typeof useCloudStorage>;
}

export default function TasksView({ storage }: TasksViewProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [menuTask, setMenuTask] = useState<Task | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [createStep, setCreateStep] = useState(0);
  const [taskData, setTaskData] = useState<{
    title?: string;
    description?: string;
    date?: number;
    time?: string;
    priority?: 'low' | 'medium' | 'high';
    recurring?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  }>({});

  // Сортировка: закрепленные сверху, затем по дате выполнения
  const sortedTasks = [...storage.tasksData.tasks].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    const dateA = a.date || Number.MAX_SAFE_INTEGER;
    const dateB = b.date || Number.MAX_SAFE_INTEGER;
    if (dateA !== dateB) return dateA - dateB;
    
    // Если даты одинаковые, сортируем по приоритету
    const priorityOrder: { [key: string]: number } = { high: 0, medium: 1, low: 2 };
    const priorityA = a.priority ? priorityOrder[a.priority] : 3;
    const priorityB = b.priority ? priorityOrder[b.priority] : 3;
    return priorityA - priorityB;
  });

  const displayedTasks = showCompleted 
    ? [...sortedTasks, ...storage.tasksData.completedTasks]
    : sortedTasks;

  const handleToggleComplete = async (task: Task) => {
    if (task.completed) {
      await storage.uncompleteTask(task.id);
    } else {
      await storage.completeTask(task.id);
    }
  };

  const handleOpenDetails = (task: Task) => {
    setSelectedTask(task);
    setShowDetails(true);
  };

  const handleOpenMenu = (task: Task) => {
    setMenuTask(task);
    setShowBottomSheet(true);
  };

  const handleEdit = () => {
    if (menuTask) {
      const task = menuTask;
      setEditTask(task);
      setIsEditing(true);
      setCreateStep(0);
      setTaskData({
        title: task.title,
        description: task.description,
        date: task.date,
        time: task.time,
        priority: task.priority,
        recurring: task.recurring
      });
      setShowBottomSheet(false);
      setMenuTask(null);
    }
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setCreateStep(0);
    setTaskData({});
    setEditTask(null);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setIsEditing(false);
    setCreateStep(0);
    setTaskData({});
    setEditTask(null);
  };

  const handleStep1Complete = (title: string) => {
    setTaskData({ ...taskData, title });
    setCreateStep(1);
  };

  const handleStep2Complete = (description?: string) => {
    setTaskData({ ...taskData, description });
    setCreateStep(2);
  };

  const handleStep3Complete = (date?: number) => {
    setTaskData({ ...taskData, date, time: date ? taskData.time : undefined });
    if (date) {
      setCreateStep(3);
    } else {
      // Пропускаем шаг времени, если дата не выбрана
      setCreateStep(4);
    }
  };

  const handleStep4Complete = (time?: string) => {
    setTaskData({ ...taskData, time });
    setCreateStep(4);
  };

  const handleStep5Complete = (priority?: 'low' | 'medium' | 'high') => {
    setTaskData({ ...taskData, priority });
    setCreateStep(5);
  };

  const handleStep6Complete = async (
    recurring?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  ) => {
    if (isEditing && editTask) {
      // Редактирование существующей задачи
      await storage.updateTask(editTask.id, {
        title: taskData.title!,
        description: taskData.description,
        date: taskData.date,
        time: taskData.time,
        priority: taskData.priority,
        recurring,
        updatedAt: Date.now()
      });
    } else {
      // Создание новой задачи
      const newTask: Task = {
        id: generateId(),
        title: taskData.title!,
        description: taskData.description,
        date: taskData.date,
        time: taskData.time,
        priority: taskData.priority,
        recurring,
        completed: false,
        pinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      await storage.addTask(newTask);
    }
    
    handleCancelCreate();
  };

  const handleTogglePin = async () => {
    if (menuTask) {
      const task = menuTask;
      await storage.updateTask(task.id, { pinned: !task.pinned });
      setShowBottomSheet(false);
      setMenuTask(null);
    }
  };

  const handleDelete = () => {
    if (menuTask) {
      const task = menuTask;
      if (window.Telegram?.WebApp?.showConfirm) {
        window.Telegram.WebApp.showConfirm(
          `Удалить задачу "${task.title}"?`,
          (confirmed: boolean) => {
            if (confirmed) {
              storage.deleteTask(task.id);
              setShowBottomSheet(false);
              setMenuTask(null);
            }
          }
        );
      } else if (window.confirm(`Удалить задачу "${task.title}"?`)) {
        storage.deleteTask(task.id);
        setShowBottomSheet(false);
        setMenuTask(null);
      }
    }
  };

  return (
    <>
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Фильтр выполненных */}
        {storage.tasksData.completedTasks.length > 0 && (
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
            backgroundColor: 'var(--tg-theme-bg-color)'
          }}>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--tg-theme-button-color)',
                backgroundColor: showCompleted 
                  ? 'var(--tg-theme-button-color)' 
                  : 'transparent',
                color: showCompleted 
                  ? 'var(--tg-theme-button-text-color)' 
                  : 'var(--tg-theme-button-color)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {showCompleted ? 'Скрыть выполненные' : 'Показать выполненные'}
              {storage.tasksData.completedTasks.length > 0 && (
                <span style={{ marginLeft: '8px' }}>
                  ({storage.tasksData.completedTasks.length})
                </span>
              )}
            </button>
          </div>
        )}

        {/* Список задач */}
        <div style={{
          flex: 1,
          overflowY: 'auto'
        }}>
          {displayedTasks.length === 0 ? (
            <EmptyState
              message="Нет задач. Создайте новую задачу, нажав кнопку внизу"
            />
          ) : (
            <div className="list">
              {displayedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={() => handleToggleComplete(task)}
                  onOpenDetails={() => handleOpenDetails(task)}
                  onOpenMenu={() => handleOpenMenu(task)}
                />
              ))}
            </div>
          )}
        </div>

        {/* FAB кнопка */}
        <button
          className="fab"
          onClick={handleStartCreate}
          style={{
            position: 'fixed',
            bottom: 'calc(20px + env(safe-area-inset-bottom))',
            right: '20px'
          }}
        >
          +
        </button>
      </div>

      {/* Визард создания/редактирования */}
      {(isCreating || isEditing) && (
        <WizardContainer
          currentStep={createStep + 1}
          totalSteps={taskData.date ? 6 : 5}
          progressColor={sectionColors.tasks.primary}
        >
          <div className={`wizard-slide ${createStep === 0 ? 'active' : createStep > 0 ? 'prev' : 'next'}`}>
            <Step1Name
              initialValue={taskData.title}
              onNext={handleStep1Complete}
            />
          </div>
          {taskData.title && (
            <div className={`wizard-slide ${createStep === 1 ? 'active' : createStep > 1 ? 'prev' : 'next'}`}>
              <Step2Description
                initialValue={taskData.description}
                onNext={handleStep2Complete}
                onBack={() => setCreateStep(0)}
              />
            </div>
          )}
          {taskData.title && (
            <div className={`wizard-slide ${createStep === 2 ? 'active' : createStep > 2 ? 'prev' : 'next'}`}>
              <Step3Date
                initialValue={taskData.date}
                onNext={handleStep3Complete}
                onBack={() => setCreateStep(1)}
              />
            </div>
          )}
          {taskData.title && taskData.date && (
            <div className={`wizard-slide ${createStep === 3 ? 'active' : createStep > 3 ? 'prev' : 'next'}`}>
              <Step4Time
                date={taskData.date}
                initialValue={taskData.time}
                onNext={handleStep4Complete}
                onBack={() => setCreateStep(2)}
              />
            </div>
          )}
          {taskData.title && (
            <div className={`wizard-slide ${createStep === 4 ? 'active' : createStep > 4 ? 'prev' : 'next'}`}>
              <Step5Priority
                initialPriority={taskData.priority}
                onNext={handleStep5Complete}
                onBack={() => setCreateStep(taskData.date ? 3 : 2)}
              />
            </div>
          )}
          {taskData.title && (
            <div className={`wizard-slide ${createStep === 5 ? 'active' : createStep > 5 ? 'prev' : 'next'}`}>
              <Step6Recurring
                initialRecurring={taskData.recurring}
                onComplete={handleStep6Complete}
                onBack={() => setCreateStep(4)}
              />
            </div>
          )}
        </WizardContainer>
      )}

      {/* Bottom Sheet меню */}
      {showBottomSheet && menuTask && (
        <BottomSheet
          onClose={() => {
            setShowBottomSheet(false);
            setMenuTask(null);
          }}
          onEdit={handleEdit}
          onTogglePin={handleTogglePin}
          onDelete={handleDelete}
          isPinned={menuTask.pinned}
        />
      )}

      {/* Детали задачи */}
      {showDetails && selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => {
            setShowDetails(false);
            setSelectedTask(null);
          }}
        />
      )}
    </>
  );
}


