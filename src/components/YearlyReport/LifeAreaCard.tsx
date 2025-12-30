interface LifeAreaCardProps {
  icon: string;
  title: string;
  content: string | undefined;
}

export default function LifeAreaCard({ icon, title, content }: LifeAreaCardProps) {
  if (!content) return null;

  return (
    <div
      className="wizard-card"
      style={{
        marginBottom: '12px',
        animation: 'fadeIn 0.3s ease-in'
      }}
    >
      <div className="wizard-card-icon">{icon}</div>
      <div className="wizard-card-content">
        <div className="wizard-card-header">
          <div className="wizard-card-title">{title}</div>
        </div>
        <p className="wizard-card-description" style={{
          whiteSpace: 'pre-wrap',
          marginTop: '8px'
        }}>
          {content}
        </p>
      </div>
    </div>
  );
}

