import { useState, useMemo } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import { generateId, type Task, type Subtask, type RecurrenceRule, type TaskCategory } from '../utils/storage';
import TaskList from '../components/Tasks/TaskList';
import DayView from '../components/Tasks/DayView/DayView';
import InBoxView from '../components/Tasks/InBox/InBoxView';
import TaskFilters from '../components/Tasks/TaskFilters';
import { TaskFilterOptions, TaskSortOption } from '../hooks/useTaskFilters';
import WizardContainer from '../components/Wizard/WizardContainer';
import Step1Name from '../components/Tasks/CreateTask/Step1Name';
import Step2Priority from '../components/Tasks/CreateTask/Step2Priority';
import Step3Date from '../components/Tasks/CreateTask/Step3Date';
import Step4Time from '../components/Tasks/CreateTask/Step4Time';
import Step5Category from '../components/Tasks/CreateTask/Step5Category';
import Step7Description from '../components/Tasks/CreateTask/Step7Description';
import Step8Subtasks from '../components/Tasks/CreateTask/Step8Subtasks';
import Step9Recurrence from '../components/Tasks/CreateTask/Step9Recurrence';
import Step10Energy from '../components/Tasks/CreateTask/Step10Energy';
import ConfirmDeleteDialog from '../components/Tasks/ConfirmDeleteDialog';
import { sectionColors } from '../utils/sectionColors';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { minutesOfDayToTimestamp } from '../utils/taskTimeUtils';

interface TasksPageProps {
  storage: ReturnType<typeof useCloudStorage>;
}

type ViewMode = 'day' | 'list' | 'inbox';

export default function TasksPage({ storage }: TasksPageProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [createStep, setCreateStep] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('inbox');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filters, setFilters] = useState<TaskFilterOptions>({
    status: 'all',
    priority: 'all',
    dateFilter: 'today'
  });
  const [sortBy, setSortBy] = useState<TaskSortOption>('time');
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [deleteConfirmTaskId, setDeleteConfirmTaskId] = useState<string | null>(null);
  
  const [taskData, setTaskData] = useState<{
    name?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: number;
    startTime?: number;
    duration?: number;
    categoryId?: string;
    description?: string;
    subtasks?: Subtask[];
    recurrence?: RecurrenceRule;
    energyLevel?: 'low' | 'medium' | 'high';
  }>({});

  // Отслеживаем, какие поля были явно изменены пользователем
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());

  // Фильтруем задачи для списка: показываем только задачи с датами/временем
  const tasksForList = useMemo(() => {
    return storage.tasks.filter(task => 
      task.dueDate || task.startTime || task.endTime
    );
  }, [storage.tasks]);

  // Используем хук для фильтрации
  const filteredTasks = useTaskFilters({
    tasks: tasksForList,
    categories: storage.taskCategories,
    tags: [],
    filters,
    sortBy,
    date: selectedDate
  });

  const handleStartCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setEditingTaskId(null);
    setCreateStep(0);
    setTaskData({});
    setModifiedFields(new Set());
  };

  const handleEditTask = (taskId: string) => {
    // #region agent log
    fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TasksPage.tsx:89',message:'handleEditTask called',data:{taskId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const task = storage.tasks.find(t => t.id === taskId);
    // #region agent log
    fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TasksPage.tsx:91',message:'handleEditTask task found',data:{taskId,taskFound:!!task,task:task?{id:task.id,text:task.text,dueDate:task.dueDate,plannedDate:task.plannedDate,status:task.status,completed:task.completed}:null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (!task) return;
    
    setIsCreating(true);
    setIsEditing(true);
    setEditingTaskId(taskId);
    setCreateStep(0);
    setModifiedFields(new Set()); // Сбрасываем отслеживание изменений
    
    // Преобразуем startTime из timestamp в минуты от полуночи
    let startTimeMinutes: number | undefined;
    if (task.startTime && task.dueDate) {
      const startDate = new Date(task.startTime);
      const dueDate = new Date(task.dueDate);
      // Если startTime в тот же день что и dueDate
      if (startDate.getDate() === dueDate.getDate() && 
          startDate.getMonth() === dueDate.getMonth() &&
          startDate.getFullYear() === dueDate.getFullYear()) {
        startTimeMinutes = startDate.getHours() * 60 + startDate.getMinutes();
      }
    }
    
    setTaskData({
      name: task.text,
      priority: task.priority,
      dueDate: task.dueDate,
      startTime: startTimeMinutes,
      duration: task.duration,
      categoryId: task.categoryId,
      description: task.description,
      subtasks: task.subtasks,
      recurrence: task.recurrence,
      energyLevel: task.energyLevel
    });
  };

  const handleStep1Complete = (name: string) => {
    setTaskData(prev => ({ ...prev, name }));
    setModifiedFields(prev => new Set(prev).add('name'));
    setCreateStep(1);
  };

  const handleStep2Complete = (priority: 'low' | 'medium' | 'high') => {
    setTaskData(prev => ({ ...prev, priority }));
    setModifiedFields(prev => new Set(prev).add('priority'));
    setCreateStep(2);
  };

  const handleStep3Complete = (dueDate?: number) => {
    setTaskData(prev => ({ ...prev, dueDate }));
    setModifiedFields(prev => new Set(prev).add('dueDate'));
    setCreateStep(3);
  };

  const handleStep4Complete = (startTime: number | undefined, duration: number | undefined) => {
    setTaskData(prev => ({ ...prev, startTime, duration }));
    setModifiedFields(prev => new Set(prev).add('startTime').add('duration'));
    setCreateStep(4);
  };

  const handleStep5Complete = (categoryId?: string, newCategory?: TaskCategory) => {
    // Если создана новая категория, сохраняем её
    if (newCategory) {
      storage.addTaskCategory(newCategory);
      setTaskData(prev => ({ ...prev, categoryId: newCategory.id }));
    } else {
      setTaskData(prev => ({ ...prev, categoryId }));
    }
    setModifiedFields(prev => new Set(prev).add('categoryId'));
    setCreateStep(5);
  };

  const handleStep6Complete = (description?: string) => {
    setTaskData(prev => ({ ...prev, description }));
    setModifiedFields(prev => new Set(prev).add('description'));
    setCreateStep(6);
  };

  const handleStep7Complete = (subtasks: Subtask[]) => {
    setTaskData(prev => ({ ...prev, subtasks }));
    setModifiedFields(prev => new Set(prev).add('subtasks'));
    setCreateStep(7);
  };

  const handleStep8Complete = (recurrence?: RecurrenceRule) => {
    setTaskData(prev => ({ ...prev, recurrence }));
    setModifiedFields(prev => new Set(prev).add('recurrence'));
    setCreateStep(8);
  };

  const handleStep9Complete = async (energyLevel?: 'low' | 'medium' | 'high') => {
    // #region agent log
    fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TasksPage.tsx:180',message:'handleStep9Complete called',data:{isEditing,editingTaskId,energyLevel,modifiedFields:Array.from(modifiedFields)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    if (isEditing && editingTaskId) {
      // Редактирование существующей задачи
      // Получаем актуальную задачу прямо перед сохранением, чтобы избежать race condition
      const originalTask = storage.tasks.find(t => t.id === editingTaskId);
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TasksPage.tsx:184',message:'handleStep9Complete originalTask found',data:{editingTaskId,taskFound:!!originalTask,originalTask:originalTask?{id:originalTask.id,text:originalTask.text,dueDate:originalTask.dueDate,plannedDate:originalTask.plannedDate,status:originalTask.status,completed:originalTask.completed,movedToList:originalTask.movedToList}:null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      if (!originalTask) {
        console.warn('Task not found for editing:', editingTaskId);
        // #region agent log
        fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TasksPage.tsx:186',message:'handleStep9Complete task not found',data:{editingTaskId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        setIsCreating(false);
        setIsEditing(false);
        setEditingTaskId(null);
        setCreateStep(0);
        setTaskData({});
        return;
      }
      
      // Логируем для отладки
      console.log('Editing task:', editingTaskId, 'Original task:', originalTask);

      // Вычисляем dueDate: если поле было изменено, используем taskData.dueDate, иначе исходную дату
      // Если dueDate не был изменен и его нет, используем selectedDate как fallback для безопасности
      const finalDueDate = modifiedFields.has('dueDate')
        ? taskData.dueDate  // Может быть undefined, если пользователь удалил дату
        : (originalTask.dueDate || selectedDate.getTime());  // Используем существующую дату или текущую дату как fallback
      
      // Вычисляем startTime и endTime на основе finalDueDate
      // Обрабатываем различные сценарии:
      // 1. Если дата была удалена - удаляем и время
      // 2. Если время было явно удалено (undefined) - удаляем время, но сохраняем дату
      // 3. Если startTime/duration были изменены - пересчитываем на новой дате
      // 4. Если дата была изменена, но время не изменялось - пересчитываем время на новую дату
      let finalStartTime: number | undefined;
      let finalEndTime: number | undefined;
      
      // Проверяем, было ли время явно удалено
      const timeWasRemoved = modifiedFields.has('startTime') && taskData.startTime === undefined;
      
      if (modifiedFields.has('dueDate') && finalDueDate === undefined) {
        // Сценарий 1: Если дата была удалена, удаляем и время
        finalStartTime = undefined;
        finalEndTime = undefined;
      } else if (timeWasRemoved) {
        // Сценарий 2: Время было явно удалено, но дата осталась
        finalStartTime = undefined;
        finalEndTime = undefined;
      } else if (finalDueDate === undefined) {
        // Нет даты - нет времени
        finalStartTime = undefined;
        finalEndTime = undefined;
      } else {
        // Есть дата, вычисляем время
        let startMinutes: number | undefined;
        let durationMinutes: number | undefined;
        
        // Определяем startMinutes
        if (modifiedFields.has('startTime') && taskData.startTime !== undefined) {
          startMinutes = taskData.startTime;
        } else if (modifiedFields.has('dueDate') && originalTask.startTime !== undefined && originalTask.dueDate) {
          // Дата была изменена, пересчитываем время на новую дату
          const originalStartDate = new Date(originalTask.startTime);
          const originalDueDate = new Date(originalTask.dueDate);
          // Если startTime был в тот же день что и dueDate, сохраняем время дня
          if (originalStartDate.getDate() === originalDueDate.getDate() &&
              originalStartDate.getMonth() === originalDueDate.getMonth() &&
              originalStartDate.getFullYear() === originalDueDate.getFullYear()) {
            startMinutes = originalStartDate.getHours() * 60 + originalStartDate.getMinutes();
          } else {
            // Иначе используем исходное значение как есть
            finalStartTime = originalTask.startTime;
            startMinutes = undefined;
          }
        } else {
          // Используем исходное значение
          finalStartTime = originalTask.startTime;
          startMinutes = undefined;
        }
        
        // Определяем durationMinutes
        if (modifiedFields.has('duration')) {
          durationMinutes = taskData.duration;
        } else {
          durationMinutes = originalTask.duration;
        }
        
        // Вычисляем finalStartTime и finalEndTime
        if (startMinutes !== undefined) {
          finalStartTime = minutesOfDayToTimestamp(finalDueDate, startMinutes);
          
          // Вычисляем endTime
          if (durationMinutes !== undefined) {
            finalEndTime = minutesOfDayToTimestamp(finalDueDate, startMinutes + durationMinutes);
          } else if (modifiedFields.has('startTime') && originalTask.endTime !== undefined && originalTask.dueDate) {
            // startTime изменен, но duration не изменялся - пересчитываем endTime
            const originalEndDate = new Date(originalTask.endTime);
            const originalDueDate = new Date(originalTask.dueDate);
            if (originalEndDate.getDate() === originalDueDate.getDate() &&
                originalEndDate.getMonth() === originalDueDate.getMonth() &&
                originalEndDate.getFullYear() === originalDueDate.getFullYear()) {
              const endMinutes = originalEndDate.getHours() * 60 + originalEndDate.getMinutes();
              finalEndTime = minutesOfDayToTimestamp(finalDueDate, endMinutes);
            } else {
              finalEndTime = originalTask.endTime;
            }
          } else {
            finalEndTime = originalTask.endTime;
          }
        } else if (modifiedFields.has('dueDate') && originalTask.endTime !== undefined && originalTask.dueDate) {
          // Дата изменена, пересчитываем endTime на новую дату
          const originalEndDate = new Date(originalTask.endTime);
          const originalDueDate = new Date(originalTask.dueDate);
          if (originalEndDate.getDate() === originalDueDate.getDate() &&
              originalEndDate.getMonth() === originalDueDate.getMonth() &&
              originalEndDate.getFullYear() === originalDueDate.getFullYear()) {
            const endMinutes = originalEndDate.getHours() * 60 + originalEndDate.getMinutes();
            finalEndTime = minutesOfDayToTimestamp(finalDueDate, endMinutes);
          } else {
            finalEndTime = originalTask.endTime;
          }
        } else {
          // Используем исходные значения
          finalEndTime = originalTask.endTime;
        }
      }

      // Формируем обновления: только те поля, которые были изменены или должны быть обновлены
      const updates: Partial<Task> = {};
      
      // Добавляем только измененные поля (включая явное удаление - undefined)
      if (modifiedFields.has('name')) {
        updates.text = taskData.name;
      }
      
      if (modifiedFields.has('priority')) {
        updates.priority = taskData.priority;
      }
      
      // dueDate и plannedDate обрабатываем отдельно, так как они могут быть изменены косвенно
      // dueDate: устанавливаем только если было изменено или если его нет
      if (modifiedFields.has('dueDate') || !originalTask.dueDate) {
        updates.dueDate = finalDueDate;
        // plannedDate должна соответствовать dueDate
        updates.plannedDate = finalDueDate;
      } else {
        // Если dueDate не изменялась, сохраняем исходные значения
        // Явно сохраняем dueDate и plannedDate для надежности, даже если они не были изменены
        // Это гарантирует сохранение этих полей даже если originalTask устарел
        if (originalTask.dueDate) {
          updates.dueDate = originalTask.dueDate;
        }
        if (originalTask.plannedDate !== undefined) {
          updates.plannedDate = originalTask.plannedDate;
        } else if (originalTask.dueDate) {
          // Если plannedDate нет, устанавливаем его равным dueDate
          updates.plannedDate = originalTask.dueDate;
        }
      }
      
      // startTime и endTime обновляем только если были изменены связанные поля
      // Но если они не были изменены, сохраняем исходные значения для надежности
      if (modifiedFields.has('startTime') || modifiedFields.has('duration') || modifiedFields.has('dueDate')) {
        updates.startTime = finalStartTime;
        updates.endTime = finalEndTime;
      } else {
        // Если startTime и endTime не изменялись, сохраняем исходные значения
        // Это гарантирует сохранение этих полей даже если originalTask устарел
        if (originalTask.startTime !== undefined) {
          updates.startTime = originalTask.startTime;
        }
        if (originalTask.endTime !== undefined) {
          updates.endTime = originalTask.endTime;
        }
      }
      
      if (modifiedFields.has('duration')) {
        updates.duration = taskData.duration;
      }
      
      // categoryId может быть undefined, если пользователь удалил категорию
      if (modifiedFields.has('categoryId')) {
        updates.categoryId = taskData.categoryId;
      }
      
      // description может быть undefined, если пользователь удалил описание
      if (modifiedFields.has('description')) {
        updates.description = taskData.description;
      }
      
      // subtasks может быть undefined, если пользователь удалил все подзадачи
      if (modifiedFields.has('subtasks')) {
        updates.subtasks = taskData.subtasks;
      }
      
      // recurrence может быть undefined, если пользователь удалил повторение
      if (modifiedFields.has('recurrence')) {
        updates.recurrence = taskData.recurrence;
      }
      
      // energyLevel передается как параметр, если он undefined, значит пользователь не выбрал значение
      // В этом случае сохраняем исходное значение только если оно было изменено
      if (energyLevel !== undefined) {
        updates.energyLevel = energyLevel;
      }
      
      // Всегда сохраняем важные системные поля из originalTask
      // Эти поля не редактируются в визарде, но могут быть изменены в других местах
      if (originalTask.status !== undefined && originalTask.status !== null) {
        updates.status = originalTask.status;
      }
      if (originalTask.completed !== undefined && originalTask.completed !== null) {
        updates.completed = originalTask.completed;
      }
      if (originalTask.createdAt !== undefined && originalTask.createdAt !== null) {
        updates.createdAt = originalTask.createdAt;
      }
      if (originalTask.pinned !== undefined && originalTask.pinned !== null) {
        updates.pinned = originalTask.pinned;
      }
      if (originalTask.parentTaskId !== undefined && originalTask.parentTaskId !== null) {
        updates.parentTaskId = originalTask.parentTaskId;
      }
      if (originalTask.recurrenceInstanceDate !== undefined && originalTask.recurrenceInstanceDate !== null) {
        updates.recurrenceInstanceDate = originalTask.recurrenceInstanceDate;
      }
      if (originalTask.tags !== undefined && originalTask.tags !== null) {
        updates.tags = originalTask.tags;
      }
      if (originalTask.timeSpent !== undefined && originalTask.timeSpent !== null) {
        updates.timeSpent = originalTask.timeSpent;
      }
      if (originalTask.movedToList !== undefined && originalTask.movedToList !== null) {
        updates.movedToList = originalTask.movedToList;
      }

      // Логируем обновления для отладки
      console.log('Updating task:', editingTaskId);
      console.log('Original task:', originalTask);
      console.log('Updates:', updates);
      console.log('Modified fields:', Array.from(modifiedFields));
      console.log('Task data:', taskData);
      
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TasksPage.tsx:412',message:'handleStep9Complete before updateTask',data:{editingTaskId,updatesKeys:Object.keys(updates),updates,modifiedFields:Array.from(modifiedFields)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      // Проверяем, что updates не пустой (должен содержать хотя бы системные поля)
      if (Object.keys(updates).length === 0) {
        console.warn('Updates object is empty! This should not happen.');
        // #region agent log
        fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TasksPage.tsx:420',message:'WARNING updates empty',data:{editingTaskId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
      }
      
      // Проверяем, что важные поля будут сохранены
      // updateTask делает merge: { ...originalTask, ...updates }
      // Поэтому все поля из originalTask сохранятся, а поля из updates перезапишут их
      // Это гарантирует, что даже если поле не в updates, оно сохранится из originalTask
      
      try {
        // #region agent log
        fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TasksPage.tsx:428',message:'handleStep9Complete calling updateTask',data:{editingTaskId,updates},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        await storage.updateTask(editingTaskId, updates);
        // #region agent log
        fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TasksPage.tsx:430',message:'handleStep9Complete updateTask success',data:{editingTaskId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        console.log('Task updated successfully:', editingTaskId);
      } catch (error) {
        console.error('Error updating task:', error);
        // #region agent log
        fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TasksPage.tsx:433',message:'handleStep9Complete updateTask error',data:{editingTaskId,error:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        // Состояние уже обновлено в updateTask, продолжаем
      }
    } else {
      // Создание новой задачи
      const dueDate = taskData.dueDate || selectedDate.getTime();
      const startTime = taskData.startTime 
        ? minutesOfDayToTimestamp(dueDate, taskData.startTime)
        : undefined;
      
      const endTime = taskData.startTime && taskData.duration
        ? minutesOfDayToTimestamp(dueDate, taskData.startTime + taskData.duration)
        : undefined;

      // Проверяем, что name не пустая строка
      const taskName = taskData.name?.trim() || 'Новая задача';

      const newTask: Task = {
        id: generateId(),
        text: taskName,
        completed: false,
        createdAt: Date.now(),
        priority: taskData.priority,
        dueDate,
        plannedDate: dueDate,
        startTime,
        endTime,
        duration: taskData.duration,
        categoryId: taskData.categoryId,
        description: taskData.description,
        subtasks: taskData.subtasks,
        recurrence: taskData.recurrence,
        energyLevel,
        status: 'todo'
      };

      try {
        await storage.addTask(newTask);
        console.log('Task added successfully');
      } catch (error) {
        console.error('Error adding task:', error);
        // Состояние уже обновлено в addTask, продолжаем
      }
    }

    setIsCreating(false);
    setIsEditing(false);
    setEditingTaskId(null);
    setCreateStep(0);
    setTaskData({});
    setModifiedFields(new Set());
  };

  const handleBack = () => {
    if (createStep > 0) {
      setCreateStep(createStep - 1);
    } else {
      setIsCreating(false);
      setIsEditing(false);
      setEditingTaskId(null);
      setTaskData({});
      setModifiedFields(new Set()); // Сбрасываем отслеживание изменений при отмене
    }
  };

  const handleToggle = async (id: string) => {
    const task = storage.tasks.find(t => t.id === id);
    if (task) {
      const newCompleted = !(task.status === 'completed' || task.completed);
      await storage.updateTask(id, { 
        completed: newCompleted,
        status: newCompleted ? 'completed' : 'todo'
      });
    }
  };

  const handleStatusChange = async (id: string, status: 'todo' | 'in-progress' | 'completed') => {
    await storage.updateTask(id, { 
      status,
      completed: status === 'completed'
    });
  };

  const handleDelete = async (id: string) => {
    await storage.deleteTask(id);
  };

  const handlePin = async (id: string) => {
    await storage.updateTask(id, { pinned: true });
  };

  const handleUnpin = async (id: string) => {
    await storage.updateTask(id, { pinned: false });
  };

  const handleConfirmDelete = (id: string) => {
    setDeleteConfirmTaskId(id);
  };

  const handleDeleteConfirmed = async () => {
    if (deleteConfirmTaskId) {
      await storage.deleteTask(deleteConfirmTaskId);
      setDeleteConfirmTaskId(null);
    }
  };

  const handleSubtaskToggle = async (taskId: string, subtaskId: string) => {
    const task = storage.tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) return;

    const updatedSubtasks = task.subtasks.map(subtask =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );

    await storage.updateTask(taskId, { subtasks: updatedSubtasks });
  };

  const handleToggleExpand = (id: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (isCreating) {
    const colors = sectionColors.tasks;
    const totalSteps = 9;
    
    return (
      <WizardContainer 
        currentStep={createStep + 1} 
        totalSteps={totalSteps}
        progressColor={colors.primary}
      >
        {createStep === 0 && (
          <div className={`wizard-slide ${createStep === 0 ? 'active' : createStep > 0 ? 'prev' : 'next'}`}>
            <Step1Name onNext={handleStep1Complete} initialValue={taskData.name} />
          </div>
        )}
        {createStep === 1 && (
          <div className={`wizard-slide ${createStep === 1 ? 'active' : createStep > 1 ? 'prev' : 'next'}`}>
            <Step2Priority onNext={handleStep2Complete} onBack={handleBack} initialValue={taskData.priority} />
          </div>
        )}
        {createStep === 2 && (
          <div className={`wizard-slide ${createStep === 2 ? 'active' : createStep > 2 ? 'prev' : 'next'}`}>
            <Step3Date onComplete={handleStep3Complete} onBack={handleBack} initialValue={taskData.dueDate} />
          </div>
        )}
        {createStep === 3 && (
          <div className={`wizard-slide ${createStep === 3 ? 'active' : createStep > 3 ? 'prev' : 'next'}`}>
            <Step4Time onNext={handleStep4Complete} onBack={handleBack} initialStartTime={taskData.startTime} initialDuration={taskData.duration} />
          </div>
        )}
        {createStep === 4 && (
          <div className={`wizard-slide ${createStep === 4 ? 'active' : createStep > 4 ? 'prev' : 'next'}`}>
            <Step5Category 
              categories={storage.taskCategories} 
              onNext={handleStep5Complete} 
              onBack={handleBack}
              initialValue={taskData.categoryId}
            />
          </div>
        )}
        {createStep === 5 && (
          <div className={`wizard-slide ${createStep === 5 ? 'active' : createStep > 5 ? 'prev' : 'next'}`}>
            <Step7Description onNext={handleStep6Complete} onBack={handleBack} initialValue={taskData.description} />
          </div>
        )}
        {createStep === 6 && (
          <div className={`wizard-slide ${createStep === 6 ? 'active' : createStep > 6 ? 'prev' : 'next'}`}>
            <Step8Subtasks onNext={handleStep7Complete} onBack={handleBack} initialValue={taskData.subtasks} />
          </div>
        )}
        {createStep === 7 && (
          <div className={`wizard-slide ${createStep === 7 ? 'active' : createStep > 7 ? 'prev' : 'next'}`}>
            <Step9Recurrence onNext={handleStep8Complete} onBack={handleBack} initialValue={taskData.recurrence} />
          </div>
        )}
        {createStep === 8 && (
          <div className={`wizard-slide ${createStep === 8 ? 'active' : createStep > 8 ? 'prev' : 'next'}`}>
            <Step10Energy onComplete={handleStep9Complete} onBack={handleBack} initialValue={taskData.energyLevel} isEditing={isEditing} />
          </div>
        )}
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
      paddingBottom: 'calc(100px + env(safe-area-inset-bottom))',
      overflow: 'hidden'
    }}>
      {/* Панель переключения представлений и фильтров */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
        backgroundColor: 'var(--tg-theme-bg-color)',
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 44px',
          gap: '8px',
          flex: 1,
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          borderRadius: '12px',
          padding: '4px',
          minWidth: 0
        }}>
          <button
            onClick={() => setViewMode('inbox')}
            style={{
              padding: '8px 12px',
              minHeight: '44px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'inbox' 
                ? 'var(--tg-theme-bg-color)' 
                : 'transparent',
              color: 'var(--tg-theme-text-color)',
              fontSize: '13px',
              fontWeight: viewMode === 'inbox' ? '600' : '400',
              cursor: 'pointer',
              boxShadow: viewMode === 'inbox' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'opacity 0.2s',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0
            }}
          >
            📥 InBox
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '8px 12px',
              minHeight: '44px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'list' 
                ? 'var(--tg-theme-bg-color)' 
                : 'transparent',
              color: 'var(--tg-theme-text-color)',
              fontSize: '13px',
              fontWeight: viewMode === 'list' ? '600' : '400',
              cursor: 'pointer',
              boxShadow: viewMode === 'list' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'opacity 0.2s',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0
            }}
          >
            📋 Список
          </button>
          <button
            onClick={() => setViewMode('day')}
            style={{
              padding: '8px 12px',
              minHeight: '44px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'day' 
                ? 'var(--tg-theme-bg-color)' 
                : 'transparent',
              color: 'var(--tg-theme-text-color)',
              fontSize: '13px',
              fontWeight: viewMode === 'day' ? '600' : '400',
              cursor: 'pointer',
              boxShadow: viewMode === 'day' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'opacity 0.2s',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0
            }}
          >
            📅 День
          </button>
          <button
            onClick={() => setShowFilters(true)}
            style={{
              width: '44px',
              height: '44px',
              padding: '0',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--tg-theme-button-color)',
              color: 'var(--tg-theme-button-text-color)',
              fontSize: '18px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            🔍
          </button>
        </div>
      </div>

      {/* Контент */}
      {viewMode === 'inbox' ? (
        <InBoxView
          tasks={storage.tasks.filter(task => 
            // Показываем только задачи без дат/времени
            !task.dueDate && !task.startTime && !task.endTime
          )}
          onTaskAdd={async (task) => {
            await storage.addTask(task);
          }}
          onTaskEdit={async (id, text) => {
            await storage.updateTask(id, { text });
          }}
          onTaskDelete={async (id) => {
            await storage.deleteTask(id);
          }}
          onTaskMove={async (id) => {
            // Перемещаем задачу в список: добавляем dueDate и plannedDate, убираем movedToList
            // #region agent log
            fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TasksPage.tsx:787',message:'onTaskMove called',data:{taskId:id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
            // #endregion
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayTimestamp = today.getTime();
            // #region agent log
            fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TasksPage.tsx:792',message:'onTaskMove before updateTask',data:{taskId:id,todayTimestamp,dueDate:todayTimestamp,plannedDate:todayTimestamp},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
            // #endregion
            await storage.updateTask(id, { 
              movedToList: false,
              dueDate: todayTimestamp,
              plannedDate: todayTimestamp
            });
            // #region agent log
            fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TasksPage.tsx:800',message:'onTaskMove after updateTask',data:{taskId:id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
            // #endregion
          }}
        />
      ) : viewMode === 'list' ? (
        <TaskList 
          tasks={filteredTasks}
          categories={storage.taskCategories}
          onToggle={handleToggle}
          onEdit={handleEditTask}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onPin={handlePin}
          onUnpin={handleUnpin}
          onConfirmDelete={handleConfirmDelete}
          onSubtaskToggle={handleSubtaskToggle}
          date={selectedDate}
          expandedTasks={expandedTasks}
          onToggleExpand={handleToggleExpand}
        />
      ) : (
        <DayView
          tasks={filteredTasks}
          categories={storage.taskCategories}
          date={selectedDate}
          onTaskConfirmDelete={handleConfirmDelete}
        />
      )}

      {/* Кнопка создания - скрываем в InBox, там своя кнопка добавления */}
      {viewMode !== 'inbox' && (
        <button 
          className="fab"
          onClick={handleStartCreate}
          aria-label="Создать задачу"
        >
          +
        </button>
      )}

      {/* Модальное окно фильтров */}
      {showFilters && (
        <TaskFilters
          categories={storage.taskCategories}
          filters={filters}
          sortBy={sortBy}
          onFiltersChange={setFilters}
          onSortChange={setSortBy}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Диалог подтверждения удаления */}
      {deleteConfirmTaskId && (
        <ConfirmDeleteDialog
          isOpen={true}
          taskText={storage.tasks.find(t => t.id === deleteConfirmTaskId)?.text || ''}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteConfirmTaskId(null)}
        />
      )}
    </div>
  );
}
