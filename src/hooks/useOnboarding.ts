import { useEffect, useState } from 'react';
import { initCloudStorage } from '@telegram-apps/sdk-react';

const ONBOARDING_KEY = 'onboarding_complete';

/**
 * Hook для управления состоянием onboarding
 * Использует Telegram CloudStorage для синхронизации между устройствами
 */
export function useOnboarding() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем флаг в CloudStorage при монтировании
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const result = initCloudStorage();
      const [cloudStorage] = result instanceof Promise ? await result : result;
      const value = await cloudStorage.get(ONBOARDING_KEY);
      setIsOnboardingComplete(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // По умолчанию считаем, что onboarding не пройден
      setIsOnboardingComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      console.log('Starting completeOnboarding...');
      const result = initCloudStorage();
      const [cloudStorage] = result instanceof Promise ? await result : result;
      console.log('CloudStorage initialized, saving flag...');
      await cloudStorage.set(ONBOARDING_KEY, 'true');
      console.log('Onboarding flag saved, updating state...');
      setIsOnboardingComplete(true);
      console.log('Onboarding completed successfully');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      // Даже при ошибке обновляем состояние, чтобы пользователь мог продолжить
      setIsOnboardingComplete(true);
    }
  };

  const resetOnboarding = async () => {
    try {
      const result = initCloudStorage();
      const [cloudStorage] = result instanceof Promise ? await result : result;
      await cloudStorage.delete(ONBOARDING_KEY);
      setIsOnboardingComplete(false);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  return {
    isOnboardingComplete,
    isLoading,
    completeOnboarding,
    resetOnboarding,
  };
}

