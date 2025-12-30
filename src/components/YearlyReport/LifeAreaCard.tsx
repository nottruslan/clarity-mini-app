interface LifeAreaCardProps {
  icon: string;
  title: string;
  content: string | undefined;
  onClick?: () => void;
}

export default function LifeAreaCard({ icon, title, content, onClick }: LifeAreaCardProps) {
  if (!content && !onClick) return null;

  return (
    <div
      className="wizard-card"
      style={{
        marginBottom: '12px',
        animation: 'fadeIn 0.3s ease-in',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      <div className="wizard-card-icon">{icon}</div>
      <div className="wizard-card-content">
        <div className="wizard-card-header">
          <div className="wizard-card-title">{title}</div>
        </div>
        <p className="wizard-card-description" style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          marginTop: '8px'
        }}>
          {content}
        </p>
      </div>
    </div>
  );
}

