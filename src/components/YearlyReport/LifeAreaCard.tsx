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
        cursor: onClick ? 'pointer' : 'default',
        padding: '12px'
      }}
      onClick={onClick}
    >
      <div className="wizard-card-icon" style={{ fontSize: '20px', marginRight: '12px' }}>{icon}</div>
      <div className="wizard-card-content" style={{ flex: 1 }}>
        <div className="wizard-card-header">
          <div className="wizard-card-title" style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>{title}</div>
        </div>
        {content && (
          <p className="wizard-card-description" style={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            marginTop: '4px',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            {content}
          </p>
        )}
      </div>
    </div>
  );
}

