# Исправление проблемы с Cloudflare прокси

## Проблема
Файлы загружаются напрямую через Netlify (`clarityminiapp.netlify.app`), но не загружаются через Cloudflare (`claritybot.ru`). Это указывает на проблему в настройках Cloudflare прокси.

## Решение

### 1. Проверка правил Cloudflare (Page Rules / Transform Rules)

1. В Cloudflare Dashboard → **Rules** → **Page Rules**
2. Проверьте, нет ли правил, которые могут блокировать или изменять запросы к `/assets/*`
3. Если есть правила - временно отключите их для проверки

### 2. Проверка настроек безопасности

1. В Cloudflare Dashboard → **Security** → **WAF**
2. Проверьте, не блокируются ли запросы к статическим файлам
2. В **Security** → **Settings** проверьте:
   - **Security Level:** лучше установить "Medium" или "Low" для тестирования
   - **Challenge Passage:** проверьте настройки

### 3. Проверка настроек кеширования для статических файлов

1. В Cloudflare Dashboard → **Caching** → **Configuration**
2. Убедитесь, что:
   - **Caching Level:** "Standard"
   - **Browser Cache TTL:** "Respect Existing Headers" или "4 hours"
3. В **Caching** → **Page Rules** проверьте, нет ли правил для `/assets/*`

### 4. Создание Page Rule для статических файлов (если нужно)

Если статические файлы не кешируются правильно:

1. В Cloudflare Dashboard → **Rules** → **Page Rules** → **Create Page Rule**
2. URL pattern: `claritybot.ru/assets/*`
3. Settings:
   - **Cache Level:** Cache Everything
   - **Edge Cache TTL:** 1 month
   - **Browser Cache TTL:** Respect Existing Headers
4. Сохраните правило

### 5. Проверка режима "Under Attack Mode"

1. В Cloudflare Dashboard → **Security** → **Settings**
2. Убедитесь, что **"Under Attack Mode"** выключен
3. Если включен - выключите его (он может блокировать запросы)

### 6. Проверка настроек Speed

1. В Cloudflare Dashboard → **Speed** → **Optimization**
2. Проверьте настройки:
   - **Auto Minify:** может вызывать проблемы - попробуйте отключить для тестирования
   - **Brotli:** можно оставить включенным
   - **Rocket Loader:** может вызывать проблемы - отключите для тестирования

### 7. Временное отключение некоторых функций для диагностики

Для диагностики попробуйте временно отключить:

1. **Speed** → **Optimization** → отключите все опции
2. **Caching** → **Configuration** → установите "Caching Level" на "Standard"
3. Проверьте, работает ли сайт

### 8. Проверка через curl (диагностика)

Проверьте, что возвращает Cloudflare:

```bash
# Проверка через Cloudflare
curl -I https://claritybot.ru/assets/index.BKhVh7uA.js

# Проверка напрямую через Netlify
curl -I https://clarityminiapp.netlify.app/assets/index.BKhVh7uA.js
```

Сравните заголовки ответов. Особенно проверьте:
- **Status Code:** должен быть `200 OK` в обоих случаях
- **Content-Type:** должен быть правильный MIME type
- **CF-Cache-Status:** показывает статус кеша Cloudflare

### 9. Проверка логов Cloudflare

1. В Cloudflare Dashboard → **Analytics & Logs** → **Logs**
2. Проверьте логи запросов к `/assets/*`
3. Ищите ошибки или блокировки

### 10. Альтернативное решение: отключить прокси для статических файлов

Если ничего не помогает, можно попробовать:

1. Создать отдельную DNS запись для статических файлов:
   - Type: CNAME
   - Name: `assets.claritybot.ru`
   - Content: `clarityminiapp.netlify.app`
   - Proxy: **DNS only** (серое облако, не прокси)
2. Обновить пути в коде (но это сложнее)

## Рекомендуемый порядок действий

1. **Проверьте Page Rules** - нет ли правил, блокирующих `/assets/*`
2. **Проверьте Security Level** - установите на "Medium" или "Low"
3. **Отключите Under Attack Mode** (если включен)
4. **Отключите Auto Minify и Rocket Loader** в Speed → Optimization
5. **Очистите кеш Cloudflare** еще раз
6. **Проверьте через curl** - сравните ответы Cloudflare и Netlify
7. **Проверьте логи Cloudflare** на наличие ошибок

## Если ничего не помогает

Попробуйте временно отключить прокси для корневого домена:

1. В Cloudflare Dashboard → **DNS** → **Records**
2. Для записи `claritybot.ru` переключите оранжевое облако на **серое** (DNS only)
3. Подождите 2-3 минуты
4. Проверьте, работает ли сайт
5. Если работает - проблема точно в настройках прокси Cloudflare
6. Если не работает - проблема в другом месте

## Дополнительная диагностика

Проверьте в браузере (F12 → Network tab):
- Какой статус код возвращается для файлов через `claritybot.ru`?
- Какие заголовки в ответе?
- Есть ли ошибки CORS?
- Какой Content-Type?

Это поможет точно определить проблему.

