import LottieAnimation from './LottieAnimation';

interface EmptyStateProps {
  message: string;
  animationData?: any;
}

export default function EmptyState({ message, animationData }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {animationData ? (
        <LottieAnimation 
          className="empty-state-animation"
          loop={true}
          autoplay={true}
        />
      ) : (
        <div className="empty-state-animation" style={{ 
          fontSize: 64,
          color: 'var(--tg-theme-hint-color)'
        }}>
          📭
        </div>
      )}
      <p className="empty-state-text">{message}</p>
    </div>
  );
}

