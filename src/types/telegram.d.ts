declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        CloudStorage?: {
          getItem: (key: string, callback: (error: Error | null, value: string | null) => void) => void;
          setItem: (key: string, value: string, callback: (error: Error | null) => void) => void;
        };
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
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
      };
    };
  }
}

export {};

