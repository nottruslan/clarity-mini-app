import { Section } from '../components/Navigation/AppHeader';

export interface SectionColor {
  primary: string;
  secondary: string;
  text: string;
  icon: string;
}

export const sectionColors: Record<Section, SectionColor> = {
  home: {
    primary: '#ffffff',
    secondary: '#f1f1f1',
    text: '#000000',
    icon: '🏠'
  },
  tasks: {
    primary: '#3390ec',
    secondary: '#e3f2fd',
    text: '#ffffff',
    icon: '✓'
  },
  habits: {
    primary: '#ff6b35',
    secondary: '#fff3e0',
    text: '#ffffff',
    icon: '🔥'
  },
  finance: {
    primary: '#4caf50',
    secondary: '#e8f5e9',
    text: '#ffffff',
    icon: '💰'
  },
  languages: {
    primary: '#9c27b0',
    secondary: '#f3e5f5',
    text: '#ffffff',
    icon: '🌍'
  },
  'yearly-report': {
    primary: '#ff9800',
    secondary: '#fff3e0',
    text: '#ffffff',
    icon: '📅'
  }
};

export const sectionLabels: Record<Section, string> = {
  home: 'Главная',
  tasks: 'Задачи',
  habits: 'Привычки',
  finance: 'Финансы',
  languages: 'Языки',
  'yearly-report': 'Годовой отчет'
};

