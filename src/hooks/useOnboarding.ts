import { useEffect, useState } from 'react';
import { useCloudStorage } from './useCloudStorage';

export function useOnboarding(section: 'habits' | 'finance' | 'languages' | 'yearly-report') {
  const { onboarding, markOnboardingShown } = useCloudStorage();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const hasShown = onboarding[section];
    if (!hasShown) {
      setShouldShow(true);
    }
  }, [onboarding, section]);

  const handleClose = async () => {
    setShouldShow(false);
    await markOnboardingShown(section);
  };

  return {
    shouldShow,
    handleClose
  };
}

