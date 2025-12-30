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
      };
    };
  }
}

export {};

