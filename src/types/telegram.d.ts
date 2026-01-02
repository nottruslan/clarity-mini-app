declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        setHeaderColor: (color: string | 'bg_color' | 'secondary_bg_color') => void;
        viewportHeight: number;
        viewportStableHeight: number;
        isExpanded: boolean;
        BackButton?: {
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          isVisible: boolean;
        };
        CloudStorage?: {
          getItem: (key: string, callback: (error: Error | null, value: string | null) => void) => void;
          setItem: (key: string, value: string, callback: (error: Error | null) => void) => void;
        };
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
        showAlert: (message: string) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        disableVerticalSwipes?: () => void;
        enableClosingConfirmation?: () => void;
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
            photo_url?: string;
          };
        };
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: any;
      };
    };
  }
}

export {};

