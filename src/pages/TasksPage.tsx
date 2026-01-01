import { useState, useMemo, useRef, useEffect } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import { generateId, type Task, type Subtask, type RecurrenceRule, type TaskCategory, type InBoxNote } from '../utils/storage';
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
import { minutesOfDayToTimestamp, timestampToMinutesOfDay } from '../utils/taskTimeUtils';

interface TasksPageProps {
  storage: ReturnType<typeof useCloudStorage>;
}

type ViewMode = 'day' | 'list' | 'inbox';

export default function TasksPage({ storage }: TasksPageProps) {
  // #region agent log
  fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TasksPage.tsx:30',message:'TasksPage render',data:{tasksCount:storage.tasks.length,firstTaskId:storage.tasks[0]?.id,firstTaskText:storage.tasks[0]?.text},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
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
    dateFilter: 'all' // Изменено с 'today' на 'all', чтобы показывать все задачи, включая созданные с датой в будущем
  });
  const [sortBy, setSortBy] = useState<TaskSortOption>('time');
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [deleteConfirmTaskId, setDeleteConfirmTaskId] = useState<string | null>(null);
  const [newlyCreatedTaskId, setNewlyCreatedTaskId] = useState<string | null>(null);
  
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

  // Задачи для списка: показываем все задачи (с датами и без)
  const tasksForList = useMemo(() => {
    const tasks = storage.tasks;
    console.log('[CHECK] tasksForList updated:', {
      tasksCount: tasks.length,
      tasksWithDueDate: tasks.filter(t => t.dueDate !== undefined).length,
      lastTaskDueDate: tasks[tasks.length - 1]?.dueDate,
      lastTaskId: tasks[tasks.length - 1]?.id
    });
    return tasks;
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
  
  // Логируем фильтрацию
  useMemo(() => {
    console.log('[CHECK] Filtering tasks:', {
      tasksForListCount: tasksForList.length,
      filteredTasksCount: filteredTasks.length,
      currentFilters: filters,
      dateFilter: filters.dateFilter,
      tasksWithDueDate: tasksForList.filter(t => t.dueDate !== undefined).length,
      filteredTasksWithDueDate: filteredTasks.filter(t => t.dueDate !== undefined).length,
      lastTaskInFiltered: filteredTasks[filteredTasks.length - 1]?.id,
      lastTaskDueDateInFiltered: filteredTasks[filteredTasks.length - 1]?.dueDate
    });
  }, [tasksForList, filteredTasks, filters]);

  const handleStartCreate = () => {
    console.log('[CHECK] handleStartCreate called');
    setIsCreating(true);
    setIsEditing(false);
    setEditingTaskId(null);
    setCreateStep(0);
    setTaskData({});
    setModifiedFields(new Set());
    // Логируем состояние после инициализации (через setTimeout, чтобы состояние обновилось)
    setTimeout(() => {
      console.log('[CHECK] After handleStartCreate - state:', {
        isCreating: true, // Мы только что установили это
        taskDataEmpty: true, // Мы только что очистили
        modifiedFieldsEmpty: true // Мы только что очистили
      });
    }, 0);
  };

  const handleEditTask = (taskId: string) => {
    // #region agent log
    console.log('[DEBUG]', JSON.stringify({location:'TasksPage.tsx:89',message:'handleEditTask called',data:{taskId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'}));
    // #endregion
    const task = storage.tasks.find(t => t.id === taskId);
    // #region agent log
    console.log('[DEBUG]', JSON.stringify({location:'TasksPage.tsx:91',message:'handleEditTask task found',data:{taskId,taskFound:!!task,task:task?{id:task.id,text:task.text,dueDate:task.dueDate,plannedDate:task.plannedDate,status:task.status,completed:task.completed}:null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'}));
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
    setTaskData(prev => {
      const newData = { ...prev, name };
      console.log('[CHECK] Step1 complete:', { name, taskData: newData });
      return newData;
    });
    setModifiedFields(prev => {
      const newSet = new Set(prev).add('name');
      console.log('[CHECK] Step1 modifiedFields:', Array.from(newSet));
      return newSet;
    });
    setCreateStep(1);
  };

  const handleStep2Complete = (priority: 'low' | 'medium' | 'high') => {
    setTaskData(prev => {
      const newData = { ...prev, priority };
      console.log('[CHECK] Step2 complete:', { priority, taskData: newData });
      return newData;
    });
    setModifiedFields(prev => {
      const newSet = new Set(prev).add('priority');
      console.log('[CHECK] Step2 modifiedFields:', Array.from(newSet));
      return newSet;
    });
    setCreateStep(2);
  };

  const handleStep3Complete = (dueDate?: number) => {
    console.log('[CHECK] Step3 complete - CRITICAL for dueDate:', { 
      dueDate, 
      dueDateType: typeof dueDate,
      dueDateIsUndefined: dueDate === undefined,
      dueDateIsNumber: typeof dueDate === 'number'
    });
    setTaskData(prev => {
      const newData = { ...prev, dueDate };
      console.log('[CHECK] Step3 taskData updated:', { 
        ...newData, 
        dueDate: newData.dueDate,
        dueDateInTaskData: newData.dueDate !== undefined
      });
      return newData;
    });
    setModifiedFields(prev => {
      const newSet = new Set(prev);
      newSet.add('dueDate'); // ВСЕГДА добавляем, даже если dueDate === undefined
      console.log('[CHECK] Step3 modifiedFields updated:', { 
        fields: Array.from(newSet),
        hasDueDate: newSet.has('dueDate'),
        modifiedFieldsSize: newSet.size
      });
      return newSet;
    });
    setCreateStep(4); // Исправлено: после шага 3 (дата) идет шаг 4 (время)
    console.log('[CHECK] Step3 - createStep set to 4');
  };

  const handleStep4Complete = (startTime: number | undefined, duration: number | undefined) => {
    setTaskData(prev => {
      const newData = { ...prev, startTime, duration };
      console.log('[CHECK] Step4 complete:', { startTime, duration, taskData: newData });
      return newData;
    });
    setModifiedFields(prev => {
      const newSet = new Set(prev);
      if (startTime !== undefined) {
        newSet.add('startTime');
      }
      if (duration !== undefined) {
        newSet.add('duration');
      }
      console.log('[CHECK] Step4 modifiedFields:', Array.from(newSet));
      return newSet;
    });
    setCreateStep(4);
    console.log('[CHECK] Step4 - createStep set to 4');
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
    console.log('[CHECK] handleStep9Complete start:', {
      isEditing,
      editingTaskId,
      energyLevel,
      taskData,
      modifiedFields: Array.from(modifiedFields),
      taskDataDueDate: taskData.dueDate,
      hasDueDateInModified: modifiedFields.has('dueDate')
    });
    if (isEditing && editingTaskId) {
      // Редактирование существующей задачи
      // Получаем актуальную задачу прямо перед сохранением
      const originalTask = storage.tasks.find(t => t.id === editingTaskId);
      if (!originalTask) {
        console.warn('Task not found for editing:', editingTaskId);
        setIsCreating(false);
        setIsEditing(false);
        setEditingTaskId(null);
        setCreateStep(0);
        setTaskData({});
        return;
      }

      // УПРОЩЕННАЯ ЛОГИКА: Создаем полную обновленную задачу
      // Берем originalTask как основу и применяем все изменения из taskData
      
      // Вычисляем dueDate
      // Если пользователь явно изменил дату, используем новое значение (даже если оно undefined - это означает сброс даты)
      let finalDueDate: number | undefined;
      if (modifiedFields.has('dueDate')) {
        // Пользователь явно изменил дату - используем новое значение из taskData
        // Важно: используем taskData.dueDate напрямую, даже если оно undefined (это означает сброс даты)
        finalDueDate = taskData.dueDate;
        console.log('[DEBUG] DueDate from taskData:', {
          hasDueDate: modifiedFields.has('dueDate'),
          taskDataDueDate: taskData.dueDate,
          finalDueDate,
          taskDataKeys: Object.keys(taskData),
          taskDataFull: taskData
        });
      } else {
        // Пользователь не изменял дату - используем старое значение
        finalDueDate = originalTask.dueDate;
        console.log('[DEBUG] DueDate from originalTask:', {
          hasDueDate: modifiedFields.has('dueDate'),
          originalTaskDueDate: originalTask.dueDate,
          finalDueDate
        });
      }
      
      // ЗАЩИТА: если finalDueDate был установлен из taskData, не перезаписываем его
      // Это важно, чтобы явно установленная дата не была потеряна
      
      // Вычисляем startTime и endTime
      // Используем finalDueDate или selectedDate как дату по умолчанию для вычисления timestamp
      // Если пользователь добавил дату, время или длительность, используем эту дату
      const dateForTime = finalDueDate !== undefined 
        ? finalDueDate 
        : (modifiedFields.has('startTime') || modifiedFields.has('duration') ? selectedDate.getTime() : undefined);
      
      let finalStartTime: number | undefined;
      let finalEndTime: number | undefined;
      
      // Если пользователь изменил startTime
      if (modifiedFields.has('startTime') && taskData.startTime !== undefined) {
        if (dateForTime) {
          // Если есть дата (новая или по умолчанию), вычисляем timestamp
          finalStartTime = minutesOfDayToTimestamp(dateForTime, taskData.startTime);
          
          // Вычисляем endTime
          if (modifiedFields.has('duration') && taskData.duration !== undefined) {
            finalEndTime = minutesOfDayToTimestamp(dateForTime, taskData.startTime + taskData.duration);
          } else if (originalTask.endTime && originalTask.dueDate) {
            // Если duration не изменялся, пересчитываем endTime на новую дату
            const originalEndDate = new Date(originalTask.endTime);
            const originalDueDate = new Date(originalTask.dueDate);
            if (originalEndDate.getDate() === originalDueDate.getDate() &&
                originalEndDate.getMonth() === originalDueDate.getMonth() &&
                originalEndDate.getFullYear() === originalDueDate.getFullYear()) {
              const endMinutes = originalEndDate.getHours() * 60 + originalEndDate.getMinutes();
              finalEndTime = minutesOfDayToTimestamp(dateForTime, endMinutes);
            } else {
              finalEndTime = originalTask.endTime;
            }
          } else {
            finalEndTime = originalTask.endTime;
          }
        } else {
          // Если нет даты, сохраняем startTime как минуты от полуночи
          finalStartTime = taskData.startTime;
          
          // Вычисляем endTime как минуты от полуночи
          if (modifiedFields.has('duration') && taskData.duration !== undefined) {
            finalEndTime = taskData.startTime + taskData.duration;
          } else if (originalTask.endTime && originalTask.endTime <= 86400000) {
            // Если endTime был в минутах от полуночи, сохраняем его
            finalEndTime = originalTask.endTime;
          } else {
            finalEndTime = originalTask.endTime;
          }
        }
      } else if (originalTask.startTime) {
        // Если startTime не изменялся пользователем
        if (finalDueDate && originalTask.dueDate) {
          // Если есть дата (новая или старая), пересчитываем на новую дату если дата изменилась
          if (modifiedFields.has('dueDate')) {
            const originalStartDate = new Date(originalTask.startTime);
            const originalDueDate = new Date(originalTask.dueDate);
            // Проверяем, был ли startTime timestamp для той же даты
            if (originalStartDate.getDate() === originalDueDate.getDate() &&
                originalStartDate.getMonth() === originalDueDate.getMonth() &&
                originalStartDate.getFullYear() === originalDueDate.getFullYear()) {
              const startMinutes = originalStartDate.getHours() * 60 + originalStartDate.getMinutes();
              finalStartTime = minutesOfDayToTimestamp(finalDueDate, startMinutes);
              
              // Пересчитываем endTime
              if (originalTask.endTime) {
                const originalEndDate = new Date(originalTask.endTime);
                if (originalEndDate.getDate() === originalDueDate.getDate() &&
                    originalEndDate.getMonth() === originalDueDate.getMonth() &&
                    originalEndDate.getFullYear() === originalDueDate.getFullYear()) {
                  const endMinutes = originalEndDate.getHours() * 60 + originalEndDate.getMinutes();
                  finalEndTime = minutesOfDayToTimestamp(finalDueDate, endMinutes);
                } else {
                  finalEndTime = originalTask.endTime;
                }
              }
            } else {
              finalStartTime = originalTask.startTime;
              finalEndTime = originalTask.endTime;
            }
          } else {
            finalStartTime = originalTask.startTime;
            finalEndTime = originalTask.endTime;
          }
        } else if (!finalDueDate && !originalTask.dueDate) {
          // Если нет даты (ни новой, ни старой), сохраняем startTime как есть (минуты от полуночи)
          finalStartTime = originalTask.startTime;
          finalEndTime = originalTask.endTime;
        } else {
          // Если дата была добавлена, но startTime не изменялся, нужно преобразовать минуты в timestamp
          if (finalDueDate && !originalTask.dueDate && originalTask.startTime && originalTask.startTime <= 86400000) {
            // startTime был в минутах от полуночи, преобразуем в timestamp
            finalStartTime = minutesOfDayToTimestamp(finalDueDate, originalTask.startTime);
            if (originalTask.endTime && originalTask.endTime <= 86400000) {
              finalEndTime = minutesOfDayToTimestamp(finalDueDate, originalTask.endTime);
            } else {
              finalEndTime = originalTask.endTime;
            }
          } else {
            finalStartTime = originalTask.startTime;
            finalEndTime = originalTask.endTime;
          }
        }
      } else if (modifiedFields.has('duration') && taskData.duration !== undefined) {
        // Если изменен только duration, пересчитываем endTime
        const dateForDuration = finalDueDate || (originalTask.dueDate || selectedDate.getTime());
        
        if (originalTask.startTime) {
          // Если у задачи есть startTime
          if (dateForDuration) {
            // Если есть дата, вычисляем timestamp
            const startMinutes = originalTask.startTime > 86400000 
              ? timestampToMinutesOfDay(originalTask.startTime)
              : originalTask.startTime;
            finalStartTime = originalTask.startTime > 86400000 
              ? originalTask.startTime
              : minutesOfDayToTimestamp(dateForDuration, originalTask.startTime);
            finalEndTime = minutesOfDayToTimestamp(dateForDuration, startMinutes + taskData.duration);
          } else {
            // Если нет даты, вычисляем endTime как минуты от полуночи
            const startMinutes = originalTask.startTime <= 86400000 
              ? originalTask.startTime 
              : timestampToMinutesOfDay(originalTask.startTime);
            finalStartTime = originalTask.startTime;
            finalEndTime = startMinutes + taskData.duration;
          }
        } else if (taskData.startTime !== undefined) {
          // Если у задачи нет startTime, но пользователь добавил его вместе с duration
          if (dateForDuration) {
            finalStartTime = minutesOfDayToTimestamp(dateForDuration, taskData.startTime);
            finalEndTime = minutesOfDayToTimestamp(dateForDuration, taskData.startTime + taskData.duration);
          } else {
            finalStartTime = taskData.startTime;
            finalEndTime = taskData.startTime + taskData.duration;
          }
        } else if (dateForDuration) {
          // Если у задачи нет startTime, но есть дата, используем начало дня
          finalStartTime = minutesOfDayToTimestamp(dateForDuration, 0);
          finalEndTime = minutesOfDayToTimestamp(dateForDuration, taskData.duration);
        } else {
          // Если нет ни startTime, ни даты, сохраняем только duration (endTime будет undefined)
          finalStartTime = undefined;
          finalEndTime = undefined;
        }
      } else {
        // Если время не изменялось, сохраняем как есть
        finalStartTime = originalTask.startTime;
        finalEndTime = originalTask.endTime;
      }
      
      // Если была добавлена дата или время, обновляем dueDate и plannedDate
      // НО: НИКОГДА не перезаписываем finalDueDate, если пользователь явно установил дату
      // Это критически важно для сохранения явно установленной даты
      if (dateForTime && finalDueDate === undefined && !modifiedFields.has('dueDate')) {
        // Только если дата не была установлена пользователем, используем dateForTime
        finalDueDate = dateForTime;
        console.log('[DEBUG] Setting finalDueDate from dateForTime:', { dateForTime, finalDueDate });
      } else {
        console.log('[DEBUG] NOT setting finalDueDate from dateForTime:', {
          dateForTime,
          finalDueDate,
          hasDueDateInModified: modifiedFields.has('dueDate'),
          reason: modifiedFields.has('dueDate') ? 'dueDate was explicitly set by user' : 'finalDueDate is already set'
        });
      }
      
      // Создаем обновленную задачу: берем originalTask и применяем изменения
      console.log('[DEBUG] Creating updatedTask:', {
        finalDueDate,
        taskDataDueDate: taskData.dueDate,
        originalTaskDueDate: originalTask.dueDate,
        hasDueDateInModified: modifiedFields.has('dueDate'),
        modifiedFields: Array.from(modifiedFields),
        taskDataFull: JSON.stringify(taskData)
      });
      
      // Создаем объект обновлений, явно включая dueDate если он был установлен
      const taskUpdates: Partial<Task> = {
        // Применяем изменения из taskData
        text: modifiedFields.has('name') ? (taskData.name || originalTask.text) : originalTask.text,
        priority: modifiedFields.has('priority') ? taskData.priority : originalTask.priority,
      };
      
      // КРИТИЧЕСКИ ВАЖНО: если dueDate был установлен пользователем, явно включаем его в обновления
      // ВАЖНО: всегда устанавливаем dueDate, даже если он undefined (это означает сброс даты)
      if (modifiedFields.has('dueDate')) {
        // Пользователь явно установил или сбросил дату
        // finalDueDate уже установлен в taskData.dueDate (строка 231), используем его напрямую
        taskUpdates.dueDate = finalDueDate;
        taskUpdates.plannedDate = finalDueDate; // plannedDate всегда равен dueDate
        console.log('[DEBUG] Explicitly setting dueDate in updates:', { 
          finalDueDate,
          taskDataDueDate: taskData.dueDate,
          isUndefined: finalDueDate === undefined,
          isNumber: typeof finalDueDate === 'number',
          modifiedFields: Array.from(modifiedFields)
        });
      } else if (finalDueDate !== undefined) {
        // Если дата не была изменена пользователем, но есть значение (например, из dateForTime), сохраняем его
        taskUpdates.dueDate = finalDueDate;
        taskUpdates.plannedDate = finalDueDate;
        console.log('[DEBUG] Setting dueDate from original task or dateForTime:', { 
          dueDate: finalDueDate,
          source: originalTask.dueDate === finalDueDate ? 'originalTask' : 'dateForTime'
        });
      } else {
        // Если дата не была изменена и нет значения, не трогаем её
        console.log('[DEBUG] Not setting dueDate - not modified and no value');
      }
      
      // Добавляем остальные поля
      taskUpdates.startTime = finalStartTime;
      taskUpdates.endTime = finalEndTime;
      taskUpdates.duration = modifiedFields.has('duration') ? taskData.duration : originalTask.duration;
      taskUpdates.categoryId = modifiedFields.has('categoryId') ? taskData.categoryId : originalTask.categoryId;
      taskUpdates.description = modifiedFields.has('description') ? taskData.description : originalTask.description;
      taskUpdates.subtasks = modifiedFields.has('subtasks') ? taskData.subtasks : originalTask.subtasks;
      taskUpdates.recurrence = modifiedFields.has('recurrence') ? taskData.recurrence : originalTask.recurrence;
      taskUpdates.energyLevel = energyLevel !== undefined ? energyLevel : originalTask.energyLevel;
      
      const updatedTask: Task = {
        ...originalTask,
        ...taskUpdates
      };
      
      console.log('[DEBUG] Final updatedTask:', {
        dueDate: updatedTask.dueDate,
        plannedDate: updatedTask.plannedDate,
        taskUpdatesDueDate: taskUpdates.dueDate
      });
      
      // Обновляем задачу
      try {
        // #region agent log
        fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TasksPage.tsx:393',message:'handleStep9Complete before updateTask',data:{editingTaskId,updatedTaskText:updatedTask.text,updatedTaskDueDate:updatedTask.dueDate,updatedTaskDuration:updatedTask.duration,updatedTaskRecurrence:updatedTask.recurrence,storageTasksCount:storage.tasks.length,modifiedFields:Array.from(modifiedFields)},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        console.log('[DEBUG] Calling updateTask with:', {
          editingTaskId,
          updatedTaskDueDate: updatedTask.dueDate,
          updatedTaskPlannedDate: updatedTask.plannedDate,
          taskUpdatesDueDate: taskUpdates.dueDate,
          taskUpdatesPlannedDate: taskUpdates.plannedDate,
          updatedTaskKeys: Object.keys(updatedTask),
          taskUpdatesKeys: Object.keys(taskUpdates),
          updatedTaskFull: updatedTask,
          taskUpdatesFull: taskUpdates
        });
        
        // ВАЖНО: передаем только изменения (taskUpdates), а не весь объект updatedTask
        // Это гарантирует, что все поля из taskUpdates будут применены
        await storage.updateTask(editingTaskId, taskUpdates);
        
        // Проверяем, что задача действительно сохранилась с dueDate
        // ВАЖНО: проверяем и из состояния React, и напрямую из хранилища
        const savedTaskFromState = storage.tasks.find(t => t.id === editingTaskId);
        
        // Читаем напрямую из хранилища, чтобы убедиться, что данные сохранились
        const { getTasks } = await import('../utils/storage');
        const tasksFromStorage = await getTasks();
        const savedTaskFromStorage = tasksFromStorage.find(t => t.id === editingTaskId);
        
        console.log('[DEBUG] After updateTask - checking saved task:', {
          editingTaskId,
          savedTaskFromStateFound: !!savedTaskFromState,
          savedTaskFromStateDueDate: savedTaskFromState?.dueDate,
          savedTaskFromStatePlannedDate: savedTaskFromState?.plannedDate,
          savedTaskFromStorageFound: !!savedTaskFromStorage,
          savedTaskFromStorageDueDate: savedTaskFromStorage?.dueDate,
          savedTaskFromStoragePlannedDate: savedTaskFromStorage?.plannedDate,
          expectedDueDate: updatedTask.dueDate,
          taskUpdatesDueDate: taskUpdates.dueDate
        });
        
        // Если дата не сохранилась, выводим ошибку
        if (savedTaskFromStorage?.dueDate !== taskUpdates.dueDate) {
          console.error('[ERROR] DueDate was not saved correctly!', {
            expected: taskUpdates.dueDate,
            savedInStorage: savedTaskFromStorage?.dueDate,
            savedInState: savedTaskFromState?.dueDate,
            taskUpdatesFull: taskUpdates,
            savedTaskFromStorageFull: savedTaskFromStorage
          });
        }
        
        // #region agent log
        fetch('http://127.0.0.1:7249/ingest/c9d9c789-1dcb-42c5-90ab-68af3eb2030c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TasksPage.tsx:396',message:'handleStep9Complete after updateTask',data:{editingTaskId,storageTasksCount:storage.tasks.length,savedTaskFromStorageDueDate:savedTaskFromStorage?.dueDate},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
      } catch (error) {
        console.error('Error updating task:', error);
        // Не закрываем визард при ошибке, чтобы пользователь мог попробовать снова
        return;
      }
      
      // Закрываем визард
      setIsCreating(false);
      setIsEditing(false);
      setEditingTaskId(null);
      setCreateStep(0);
      setTaskData({});
      setModifiedFields(new Set());
    } else {
      // Создание новой задачи
      // ВАЖНО: используем taskData.dueDate только если он был явно установлен пользователем
      // Если дата не установлена, но есть время, используем selectedDate
      // Если ничего не установлено, dueDate остается undefined
      let dueDate: number | undefined;
      if (modifiedFields.has('dueDate')) {
        // Пользователь явно установил или сбросил дату
        // Если taskData.dueDate определен - используем его (пользователь установил дату)
        // Если taskData.dueDate undefined - это означает, что пользователь сбросил дату
        dueDate = taskData.dueDate;
        console.log('[DEBUG] Creating task - dueDate from modifiedFields:', {
          hasDueDateInModified: true,
          taskDataDueDate: taskData.dueDate,
          finalDueDate: dueDate
        });
      } else if (taskData.startTime || taskData.duration) {
        // Если установлено время или длительность, но не дата, используем selectedDate
        dueDate = selectedDate.getTime();
        console.log('[DEBUG] Creating task - dueDate from selectedDate (time/duration set):', {
          hasDueDateInModified: false,
          hasStartTime: !!taskData.startTime,
          hasDuration: !!taskData.duration,
          selectedDate: selectedDate.getTime(),
          finalDueDate: dueDate
        });
      } else {
        // Если ничего не установлено, dueDate остается undefined
        dueDate = undefined;
        console.log('[DEBUG] Creating task - dueDate undefined (nothing set):', {
          hasDueDateInModified: false,
          hasStartTime: !!taskData.startTime,
          hasDuration: !!taskData.duration,
          finalDueDate: dueDate
        });
      }
      
      const startTime = taskData.startTime && dueDate
        ? minutesOfDayToTimestamp(dueDate, taskData.startTime)
        : (taskData.startTime || undefined); // Если нет даты, сохраняем startTime как минуты от полуночи
      
      const endTime = taskData.startTime && taskData.duration && dueDate
        ? minutesOfDayToTimestamp(dueDate, taskData.startTime + taskData.duration)
        : (taskData.startTime && taskData.duration 
          ? taskData.startTime + taskData.duration 
          : undefined); // Если нет даты, сохраняем endTime как минуты от полуночи

      // Проверяем, что name не пустая строка
      const taskName = taskData.name?.trim() || 'Новая задача';

      console.log('[CHECK] Before creating newTask object:', {
        dueDate,
        dueDateType: typeof dueDate,
        taskDataDueDate: taskData.dueDate,
        hasDueDateInModified: modifiedFields.has('dueDate'),
        startTime,
        endTime,
        taskName,
        currentFilters: filters,
        currentDateFilter: filters.dateFilter,
        selectedDate: selectedDate.getTime()
      });

      const newTask: Task = {
        id: generateId(),
        text: taskName,
        completed: false,
        createdAt: Date.now(),
        priority: taskData.priority,
        dueDate,
        plannedDate: dueDate, // plannedDate всегда равен dueDate
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
      
      console.log('[CHECK] newTask object created:', {
        id: newTask.id,
        text: newTask.text,
        dueDate: newTask.dueDate,
        dueDateType: typeof newTask.dueDate,
        plannedDate: newTask.plannedDate,
        plannedDateType: typeof newTask.plannedDate,
        startTime: newTask.startTime,
        endTime: newTask.endTime,
        allFields: Object.keys(newTask),
        newTaskFull: newTask
      });

      try {
        await storage.addTask(newTask);
        console.log('[DEBUG] Task added successfully:', {
          taskId: newTask.id,
          taskDueDate: newTask.dueDate,
          taskPlannedDate: newTask.plannedDate
        });
        
        // Проверяем, что задача действительно сохранилась с dueDate
        // Читаем напрямую из хранилища, чтобы убедиться, что данные сохранились
        const { getTasks } = await import('../utils/storage');
        const tasksFromStorage = await getTasks();
        const savedTaskFromStorage = tasksFromStorage.find(t => t.id === newTask.id);
        
        console.log('[DEBUG] After addTask - checking saved task:', {
          taskId: newTask.id,
          expectedDueDate: newTask.dueDate,
          savedTaskFromStorageFound: !!savedTaskFromStorage,
          savedTaskFromStorageDueDate: savedTaskFromStorage?.dueDate,
          savedTaskFromStoragePlannedDate: savedTaskFromStorage?.plannedDate
        });
        
        // Если задача не сохранилась, выбрасываем ошибку
        if (!savedTaskFromStorage) {
          const errorMsg = 'Задача не была сохранена в хранилище';
          console.error('[ERROR]', errorMsg, { newTask });
          throw new Error(errorMsg);
        }
        
        // Если дата не сохранилась, выводим ошибку
        if (savedTaskFromStorage.dueDate !== newTask.dueDate) {
          console.error('[ERROR] DueDate was not saved correctly when creating new task!', {
            expected: newTask.dueDate,
            savedInStorage: savedTaskFromStorage.dueDate,
            newTaskFull: newTask,
            savedTaskFromStorageFull: savedTaskFromStorage
          });
          // Это не критическая ошибка, но логируем
        }
        
        // Проверяем видимость задачи в filteredTasks
        const taskIndexInFiltered = filteredTasks.findIndex(t => t.id === newTask.id);
        const taskInFiltered = filteredTasks.find(t => t.id === newTask.id);
        
        console.log('[CHECK] Verification after save - checking saved task:', {
          taskId: newTask.id,
          expectedDueDate: newTask.dueDate,
          expectedDueDateType: typeof newTask.dueDate,
          savedTaskFromStorageFound: !!savedTaskFromStorage,
          savedTaskFromStorageDueDate: savedTaskFromStorage?.dueDate,
          savedTaskFromStorageDueDateType: typeof savedTaskFromStorage?.dueDate,
          savedTaskFromStoragePlannedDate: savedTaskFromStorage?.plannedDate,
          currentFilters: filters,
          tasksInState: storage.tasks.length,
          taskInState: storage.tasks.find(t => t.id === newTask.id) ? 'YES' : 'NO',
          taskDueDateInState: storage.tasks.find(t => t.id === newTask.id)?.dueDate,
          // Проверка видимости в filteredTasks
          taskInFiltered: taskInFiltered ? 'YES' : 'NO',
          taskIndexInFiltered: taskIndexInFiltered,
          filteredTasksCount: filteredTasks.length,
          taskDueDateInFiltered: taskInFiltered?.dueDate,
          taskPositionInList: taskIndexInFiltered >= 0 ? `${taskIndexInFiltered + 1} из ${filteredTasks.length}` : 'НЕ НАЙДЕНА'
        });
        
        // Устанавливаем ID новой задачи для прокрутки
        if (taskInFiltered) {
          setNewlyCreatedTaskId(newTask.id);
        }
      } catch (error) {
        console.error('[ERROR] Error adding task:', error);
        // Теперь addTask сначала сохраняет, потом обновляет состояние
        // Если мы здесь, значит сохранение не удалось, и состояние не обновлено
        // Поэтому откат не нужен, но логируем для ясности
        console.log('[DEBUG] Task was not added to state because save failed');
        // Показываем ошибку пользователю (можно добавить toast/alert)
        alert(`Ошибка при создании задачи: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
        // НЕ закрываем форму создания, чтобы пользователь мог попробовать снова
        return; // Прерываем выполнение, не закрывая форму
      }
    }

    console.log('[CHECK] Closing wizard - task created successfully');
    setIsCreating(false);
    setIsEditing(false);
    setEditingTaskId(null);
    setCreateStep(0);
    setTaskData({});
    setModifiedFields(new Set());
    console.log('[CHECK] Wizard closed, state cleared');
  };
  
  // Эффект для прокрутки к новой задаче
  useEffect(() => {
    if (newlyCreatedTaskId && filteredTasks.length > 0) {
      // Ждем, пока DOM обновится
      setTimeout(() => {
        const taskElement = document.querySelector(`[data-task-id="${newlyCreatedTaskId}"]`);
        if (taskElement) {
          console.log('[CHECK] Scrolling to new task:', newlyCreatedTaskId);
          taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Выделяем задачу визуально
          taskElement.classList.add('newly-created');
          setTimeout(() => {
            taskElement.classList.remove('newly-created');
          }, 2000);
        } else {
          console.log('[CHECK] Task element not found in DOM:', newlyCreatedTaskId);
        }
        // Сбрасываем ID после прокрутки
        setNewlyCreatedTaskId(null);
      }, 100);
    }
  }, [newlyCreatedTaskId, filteredTasks]);

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

  const handleMoveNoteToList = async (noteId: string) => {
    const note = storage.inBoxNotes.find(n => n.id === noteId);
    if (!note) return;

    // Создаем задачу только с полем text
    const newTask: Task = {
      id: generateId(),
      text: note.text,
      completed: false,
      createdAt: Date.now()
    };

    // Добавляем задачу и удаляем заметку
    await storage.addTask(newTask);
    await storage.deleteInBoxNote(noteId);
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
          notes={storage.inBoxNotes}
          onNoteAdd={async (note) => {
            await storage.addInBoxNote(note);
          }}
          onNoteEdit={async (id, text) => {
            await storage.updateInBoxNote(id, { text });
          }}
          onNoteDelete={async (id) => {
            await storage.deleteInBoxNote(id);
          }}
          onMoveToList={handleMoveNoteToList}
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

      {/* Кнопка создания - скрываем в InBox */}
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
