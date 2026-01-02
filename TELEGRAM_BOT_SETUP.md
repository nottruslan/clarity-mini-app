# Настройка Telegram бота

## Переменные окружения

В настройках Netlify Dashboard добавьте переменную окружения:

- **TELEGRAM_BOT_TOKEN**: Токен вашего бота от BotFather

### Как добавить переменную окружения в Netlify:

1. Зайдите в Netlify Dashboard
2. Выберите ваш сайт (clarityminiapp)
3. Перейдите в Settings → Environment variables
4. Добавьте новую переменную:
   - Key: `TELEGRAM_BOT_TOKEN`
   - Value: `8246335272:AAEDsC5cdooVBLJl9aX5_bepE3k44tnCHZE`
5. Сохраните и перезапустите деплой

## Настройка Webhook

После деплоя функции на Netlify необходимо настроить webhook для вашего бота.

### URL webhook

После деплоя URL webhook будет:
```
https://clarityminiapp.netlify.app/.netlify/functions/telegram-webhook
```

### Команда для настройки webhook

Выполните следующую команду в терминале (замените `<TOKEN>` на ваш токен бота):

```bash
curl -X POST "https://api.telegram.org/bot8246335272:AAEDsC5cdooVBLJl9aX5_bepE3k44tnCHZE/setWebhook?url=https://clarityminiapp.netlify.app/.netlify/functions/telegram-webhook"
```

Или через браузер откройте URL:
```
https://api.telegram.org/bot8246335272:AAEDsC5cdooVBLJl9aX5_bepE3k44tnCHZE/setWebhook?url=https://clarityminiapp.netlify.app/.netlify/functions/telegram-webhook
```

### Проверка webhook

Чтобы проверить текущий webhook, выполните:

```bash
curl "https://api.telegram.org/bot8246335272:AAEDsC5cdooVBLJl9aX5_bepE3k44tnCHZE/getWebhookInfo"
```

## Проверка работы

1. Откройте Telegram
2. Найдите вашего бота
3. Отправьте команду `/start`
4. Должно прийти приветственное сообщение с кнопкой "Открыть Clarity"
5. При нажатии на кнопку должно открыться мини-приложение

## Примечания

- Webhook должен быть настроен только после успешного деплоя функции на Netlify
- Убедитесь, что переменная окружения `TELEGRAM_BOT_TOKEN` установлена перед настройкой webhook
- Если webhook не работает, проверьте логи в Netlify Functions

