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
      const [cloudStorage] = initCloudStorage();
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
      const [cloudStorage] = initCloudStorage();
      await cloudStorage.set(ONBOARDING_KEY, 'true');
      setIsOnboardingComplete(true);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      const [cloudStorage] = initCloudStorage();
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

