/**
 * Утилиты для определения типа вибрации на основе контекста кнопки
 */

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection';

/**
 * Определяет тип вибрации на основе контекста элемента кнопки
 */
export function determineHapticType(element: HTMLElement): HapticType {
  // Проверяем data-атрибуты для явного указания типа вибрации
  const dataHaptic = element.getAttribute('data-haptic');
  if (dataHaptic && ['light', 'medium', 'heavy', 'success', 'error', 'selection'].includes(dataHaptic)) {
    return dataHaptic as HapticType;
  }

  // Проверяем data-action для определения действия
  const action = element.getAttribute('data-action');
  if (action === 'delete' || action === 'remove') {
    return 'error';
  }
  if (action === 'save' || action === 'create' || action === 'submit') {
    return 'success';
  }

  // Проверяем классы CSS
  const classList = element.classList;
  
  // FAB кнопки - обычно для создания, используем success
  if (classList.contains('fab')) {
    return 'success';
  }

  // Кнопки удаления по классу или иконке/тексту
  if (
    classList.contains('delete-button') ||
    classList.contains('swipeable-delete') ||
    element.textContent?.toLowerCase().includes('удалить') ||
    element.textContent?.toLowerCase().includes('delete') ||
    element.innerHTML.includes('🗑') ||
    element.innerHTML.includes('❌')
  ) {
    return 'error';
  }

  // Кнопки сохранения, создания, подтверждения
  if (
    classList.contains('save-button') ||
    element.textContent?.toLowerCase().includes('сохранить') ||
    element.textContent?.toLowerCase().includes('save') ||
    element.textContent?.toLowerCase().includes('создать') ||
    element.textContent?.toLowerCase().includes('create') ||
    element.textContent?.toLowerCase().includes('готово') ||
    element.textContent?.toLowerCase().includes('done') ||
    element.textContent?.toLowerCase().includes('далее') ||
    element.textContent?.toLowerCase().includes('next')
  ) {
    return 'success';
  }

  // Gradient buttons (primary) - обычно для важных действий, используем success
  if (classList.contains('gradient-button-primary')) {
    return 'success';
  }

  // Gradient buttons (secondary) - обычные действия
  if (classList.contains('gradient-button-secondary')) {
    return 'light';
  }

  // Стандартные Telegram кнопки
  if (classList.contains('tg-button')) {
    return 'light';
  }

  // Отмена, закрытие - легкая вибрация
  if (
    element.textContent?.toLowerCase().includes('отмена') ||
    element.textContent?.toLowerCase().includes('cancel') ||
    element.textContent?.toLowerCase().includes('закрыть') ||
    element.textContent?.toLowerCase().includes('close')
  ) {
    return 'light';
  }

  // По умолчанию - легкая вибрация выбора
  return 'selection';
}

/**
 * Выполняет вибрацию соответствующего типа
 */
export function triggerHapticFeedback(element: HTMLElement): void {
  try {
    // Пропускаем элементы с атрибутом data-haptic="skip"
    if (element.getAttribute('data-haptic') === 'skip') {
      return;
    }

    const haptic = window.Telegram?.WebApp?.HapticFeedback;
    if (!haptic) return;

    const type = determineHapticType(element);

    switch (type) {
      case 'light':
      case 'medium':
      case 'heavy':
        if (haptic.impactOccurred) {
          haptic.impactOccurred(type);
        }
        break;
      case 'success':
        if (haptic.notificationOccurred) {
          haptic.notificationOccurred('success');
        }
        break;
      case 'error':
        if (haptic.notificationOccurred) {
          haptic.notificationOccurred('error');
        }
        break;
      case 'selection':
        if (haptic.selectionChanged) {
          haptic.selectionChanged();
        }
        break;
    }
  } catch (error) {
    // Молча игнорируем ошибки при отсутствии поддержки вибрации
  }
}

