import { useTelegram } from '../hooks/useTelegram';

export default function LanguagesPage() {
  const { tg } = useTelegram();

  const handleOpenWord = () => {
    if (tg) {
      try {
        // Проверяем наличие метода openTelegramLink (доступен в API версии 6.0+)
        // Этот метод открывает ссылки напрямую в Telegram, без браузера
        if (tg.openTelegramLink) {
          tg.openTelegramLink('https://t.me/word');
        } else {
          // Если openTelegramLink недоступен, используем window.location.href
          // для ссылок https://t.me/... Telegram обрабатывает их внутри приложения
          window.location.href = 'https://t.me/word';
        }
      } catch (error) {
        console.error('Ошибка при открытии ссылки:', error);
        // Fallback: используем window.location.href для открытия внутри Telegram
        window.location.href = 'https://t.me/word';
      }
    } else {
      // Fallback для случая, когда Telegram WebApp недоступен
      window.location.href = 'https://t.me/word';
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

