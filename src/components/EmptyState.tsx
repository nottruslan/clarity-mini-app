import LottieAnimation from './LottieAnimation';

interface EmptyStateProps {
  message: string;
  animationData?: any;
}

export default function EmptyState({ message, animationData }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      minHeight: '200px',
      textAlign: 'center'
    }}>
      {animationData ? (
        <LottieAnimation 
          className="empty-state-animation"
          loop={true}
          autoplay={true}
        />
      ) : (
        <div style={{ 
          fontSize: '64px',
          color: 'var(--tg-theme-hint-color)',
          marginBottom: '16px',
          opacity: 0.5
        }}>
          📭
        </div>
      )}
      <p style={{
        fontSize: '16px',
        color: 'var(--tg-theme-hint-color)',
        margin: 0,
        lineHeight: '1.5'
      }}>
        {message}
      </p>
    </div>
  );
}

