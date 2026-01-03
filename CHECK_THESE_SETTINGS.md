# Критичные настройки для проверки

## ❌ Web Analytics - НЕ критично

Настройки Web Analytics (RUM) не влияют на загрузку файлов. Это только аналитика.

## ✅ Критичные настройки для проверки

### 1. Speed Optimization (САМОЕ ВАЖНОЕ!)

**Где найти:**
- Cloudflare Dashboard → **Speed** → **Optimization**

**Что проверить:**
- ✅ **Auto Minify** - должен быть **ОТКЛЮЧЕН** для всех (JavaScript, CSS, HTML)
- ✅ **Rocket Loader** - должен быть **ОТКЛЮЧЕН**

**Почему критично:**
- Auto Minify может ломать JavaScript файлы при минификации
- Rocket Loader может вызывать проблемы с загрузкой скриптов

### 2. WAF (Web Application Firewall)

**Где найти:**
- Cloudflare Dashboard → **Security** → **WAF**

**Что проверить:**
- **Managed Rules** - временно отключите все для тестирования
- **Custom Rules** - проверьте, нет ли правил, блокирующих `/assets/*`

**Почему критично:**
- WAF может блокировать запросы к статическим файлам

### 3. Caching

**Где найти:**
- Cloudflare Dashboard → **Caching** → **Configuration**

**Что проверить:**
- **Caching Level:** должен быть "Standard"
- **Browser Cache TTL:** "Respect Existing Headers"
- **Purge Everything** - очистите кеш

### 4. Page Rules

**Где найти:**
- Cloudflare Dashboard → **Rules** → **Page Rules**

**Что проверить:**
- Нет ли правил, блокирующих `/assets/*` или `claritybot.ru/*`

## Порядок проверки

1. **Сначала:** Speed → Optimization → отключите Auto Minify и Rocket Loader
2. **Затем:** Security → WAF → временно отключите Managed Rules
3. **Потом:** Caching → Configuration → очистите кеш
4. **Проверьте:** Rules → Page Rules → нет ли блокирующих правил

## После изменений

1. Подождите 5 минут
2. Очистите кеш браузера
3. Откройте `https://claritybot.ru/` в режиме инкогнито
4. Проверьте Network tab - файлы должны загружаться

## Важно

**Web Analytics не является причиной проблемы.** Сосредоточьтесь на Speed Optimization (Auto Minify, Rocket Loader) - это самая частая причина проблем с загрузкой JavaScript файлов.

