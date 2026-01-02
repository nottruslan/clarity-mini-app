/**
 * Хук для управления тактильной обратной связью (вибрацией) через Telegram WebApp API
 */

export type HapticImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
export type HapticNotificationType = 'error' | 'success' | 'warning';

export function useHapticFeedback() {
  /**
   * Выполняет вибрацию воздействия (impact)
   */
  const impactOccurred = (style: HapticImpactStyle = 'light') => {
    try {
      const haptic = window.Telegram?.WebApp?.HapticFeedback;
      if (haptic?.impactOccurred) {
        haptic.impactOccurred(style);
      }
    } catch (error) {
      // Молча игнорируем ошибки при отсутствии поддержки вибрации
    }
  };

  /**
   * Выполняет вибрацию уведомления
   */
  const notificationOccurred = (type: HapticNotificationType = 'success') => {
    try {
      const haptic = window.Telegram?.WebApp?.HapticFeedback;
      if (haptic?.notificationOccurred) {
        haptic.notificationOccurred(type);
      }
    } catch (error) {
      // Молча игнорируем ошибки при отсутствии поддержки вибрации
    }
  };

  /**
   * Выполняет вибрацию выбора (selection)
   */
  const selectionChanged = () => {
    try {
      const haptic = window.Telegram?.WebApp?.HapticFeedback;
      if (haptic?.selectionChanged) {
        haptic.selectionChanged();
      }
    } catch (error) {
      // Молча игнорируем ошибки при отсутствии поддержки вибрации
    }
  };

  return {
    impactOccurred,
    notificationOccurred,
    selectionChanged
  };
}

