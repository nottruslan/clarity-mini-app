import { useTelegram } from '../hooks/useTelegram';

export default function LanguagesPage() {
  const { tg } = useTelegram();

  const handleOpenWord = () => {
    if (tg) {
      tg.openLink('https://t.me/word', { try_instant_view: true });
    } else {
      window.open('https://t.me/word', '_blank');
    }
  };

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      textAlign: 'center'
    }}>
      <div style={{ 
        fontSize: '64px', 
        marginBottom: '24px' 
      }}>
        🌍
      </div>
      
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: '600', 
        marginBottom: '8px' 
      }}>
        Изучение языков
      </h2>
      
      <p style={{ 
        fontSize: '16px', 
        color: 'var(--tg-theme-hint-color)',
        marginBottom: '32px',
        maxWidth: '300px'
      }}>
        Откройте мини-приложение @word для изучения языков
      </p>

      <button 
        className="tg-button"
        onClick={handleOpenWord}
        style={{
          minWidth: '200px'
        }}
      >
        Открыть @word
      </button>
    </div>
  );
}

