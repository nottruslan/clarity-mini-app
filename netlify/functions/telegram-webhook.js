exports.handler = async (event, context) => {
  // Разрешаем только POST запросы
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Bot token not configured' })
      };
    }

    // Парсим update от Telegram
    const update = JSON.parse(event.body);

    // Проверяем, есть ли сообщение и команда /start
    if (update.message && update.message.text) {
      const messageText = update.message.text.trim();
      const chatId = update.message.chat.id;

      // Обрабатываем команду /start
      if (messageText === '/start' || messageText.startsWith('/start ')) {
        const welcomeMessage = `Привет 👋

Если ты искал инструменты для личной эффективности, планирования, целей, задачи и бюджета, а также другие инструменты, то ты в правильном месте - в Clarity

Посмотреть сервис можешь по кнопке ниже или заходить через кнопку открыть в твоих чатах

Удачи`;

        const webappUrl = 'https://clarityminiapp.netlify.app';
        
        // Формируем inline кнопку типа WebApp
        const replyMarkup = {
          inline_keyboard: [
            [
              {
                text: 'Открыть Clarity',
                web_app: {
                  url: webappUrl
                }
              }
            ]
          ]
        };

        // Отправляем сообщение через Telegram Bot API
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        const response = await fetch(telegramApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: welcomeMessage,
            reply_markup: replyMarkup
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Telegram API error:', errorText);
          return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send message' })
          };
        }
      }
    }

    // Всегда возвращаем 200 OK для Telegram webhook
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 200, // Всегда возвращаем 200 для Telegram
      body: JSON.stringify({ ok: true, error: error.message })
    };
  }
};

