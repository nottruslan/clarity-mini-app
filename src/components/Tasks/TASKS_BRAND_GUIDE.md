# Брендбук раздела "Задачи"

Полное руководство по визуальному оформлению всех элементов раздела задач.

---

## 1. ЦВЕТОВАЯ ПАЛИТРА

### 1.1 Основные цвета раздела

```css
Primary Color: #3390ec
Secondary Color: #e3f2fd
Text Color (на primary): #ffffff
Icon: ✓
```

**Использование:**
- Основной цвет используется для header, активных элементов, кнопок
- Вторичный цвет используется для фона секций
- Белый текст на primary цвете для контрастности

### 1.2 Telegram Theme Variables

Все элементы используют переменные Telegram для поддержки темной/светлой темы:

```css
--tg-theme-bg-color              /* Фон основного контента */
--tg-theme-text-color            /* Основной текст */
--tg-theme-hint-color            /* Вторичный текст, подсказки (#999999) */
--tg-theme-link-color            /* Цвет ссылок (#3390ec) */
--tg-theme-button-color          /* Цвет кнопок (#3390ec) */
--tg-theme-button-text-color     /* Текст на кнопках (#ffffff) */
--tg-theme-secondary-bg-color    /* Вторичный фон (#f1f1f1) */
--tg-theme-section-bg-color      /* Фон секций (#ffffff) */
--tg-theme-destructive-text-color /* Цвет удаления (#ff3b30) */
```

### 1.3 Цвета приоритетов

**Высокий приоритет:**
- Иконка: 🔴
- Цвет границы: `#f44336`
- Фон (календарь): `rgba(244, 67, 54, 0.2)`

**Средний приоритет:**
- Иконка: 🟡
- Цвет границы: `#ffc107`
- Фон (календарь): `rgba(255, 193, 7, 0.2)`

**Низкий приоритет:**
- Иконка: 🟢
- Цвет границы: `#4caf50`
- Фон (календарь): `rgba(76, 175, 80, 0.2)`

**Без приоритета:**
- Иконка: нет
- Цвет границы: `var(--tg-theme-hint-color)`
- Фон (календарь): `var(--tg-theme-secondary-bg-color)`

---

## 2. ТИПОГРАФИКА

### 2.1 Размеры шрифтов

| Элемент | Размер | Font-weight | Использование |
|---------|--------|-------------|---------------|
| Заголовок секции | 20px | 600 | Заголовки модальных окон |
| Заголовок подсекции | 18px | 600 | Заголовки в PlanView |
| Основной текст | 16px | 400/500 | Основной контент, кнопки |
| Вторичный текст | 14px | 400/500/600 | Подписи, кнопки, метки |
| Мелкий текст | 12px | 400 | Вспомогательный текст, метки полей |
| Очень мелкий | 12px | 400 | Часы в календаре, подсказки |

### 2.2 Стили текста

**Заголовки полей (Labels):**
- Font-size: `12px`
- Color: `var(--tg-theme-hint-color)`
- Text-transform: `uppercase`
- Letter-spacing: `0.5px`
- Margin-bottom: `8px`

**Заголовки разделов:**
- Font-size: `16px` (активный: `600`, неактивный: `400`)
- Color активный: `var(--tg-theme-button-color)`
- Color неактивный: `var(--tg-theme-hint-color)`

---

## 3. КНОПКИ

### 3.1 Основная кнопка (tg-button)

```css
Background: var(--tg-theme-button-color) /* #3390ec */
Color: var(--tg-theme-button-text-color) /* #ffffff */
Border: none
Border-radius: 10px
Padding: 12px 24px
Font-size: 16px
Font-weight: 500
Min-height: 44px
Transition: opacity 0.2s
```

**Состояния:**
- Active: `opacity: 0.7`
- Disabled: `opacity: 0.5`, `cursor: not-allowed`

**Использование:** Все основные действия (Добавить, Сохранить, Продолжить)

### 3.2 Вторичная кнопка (outline)

```css
Background: transparent
Border: 1px solid var(--tg-theme-button-color)
Color: var(--tg-theme-button-color)
Border-radius: 8px
Padding: 8px 16px
Font-size: 16px
Font-weight: 500
Min-width: 60px
```

**Использование:** Навигация в PlanView (← →), кнопки отмены

### 3.3 Малая кнопка

```css
Padding: 8px 16px
Font-size: 14px
Min-height: 36px
Border-radius: 10px
```

**Использование:** Кнопки в InBoxView ("Добавить в задачи", "Удалить")

### 3.4 Кнопка "Сегодня" (PlanView)

```css
Padding: 4px 12px
Border-radius: 6px
Border: 1px solid var(--tg-theme-hint-color)
Background: transparent
Color: var(--tg-theme-hint-color)
Font-size: 12px
```

### 3.5 Кнопка удаления (destructive)

```css
Background: transparent
Border: 1px solid var(--tg-theme-destructive-text-color) /* #ff3b30 */
Color: var(--tg-theme-destructive-text-color)
Border-radius: 10px
Padding: 8px 16px
Font-size: 14px
Font-weight: 500
Min-height: 36px
Min-width: 60px
```

**Использование:** Кнопки удаления в InBoxView

### 3.6 FAB кнопка (Floating Action Button)

```css
Position: fixed
Bottom: calc(20px + env(safe-area-inset-bottom))
Right: 20px
Width: 56px
Height: 56px
Border-radius: 50% (круглая)
Background: var(--tg-theme-button-color)
Color: var(--tg-theme-button-text-color)
Border: none
Box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
Font-size: 24px
Z-index: 100
Transition: transform 0.2s, box-shadow 0.2s
```

**Состояния:**
- Active: `transform: scale(0.95)`

**Использование:** Создание новой задачи в TasksView

---

## 4. ПОЛЯ ВВОДА

### 4.1 Wizard Input (стандартное поле ввода)

```css
Width: 100%
Padding: 16px 20px
Border: 2px solid var(--tg-theme-secondary-bg-color)
Border-radius: 12px
Font-size: 18px
Background: var(--tg-theme-bg-color)
Color: var(--tg-theme-text-color)
Margin-top: 16px
Min-height: 56px
Transition: border-color 0.2s
```

**Состояния:**
- Focus: `border-color: var(--tg-theme-button-color)`
- Placeholder: `color: var(--tg-theme-hint-color)`

**Использование:** Все поля ввода в визарде создания задач

### 4.2 Inline Input (InBoxView)

```css
Flex: 1
Margin-top: 0
Min-height: 44px
/* Остальные стили от wizard-input */
```

---

## 5. МОДАЛЬНЫЕ ОКНА

### 5.1 BottomSheet (меню "три точки")

**Backdrop:**
```css
Position: fixed
Top: 0
Left: 0
Right: 0
Bottom: 0
Background: rgba(0, 0, 0, 0.5)
Z-index: 10000
Display: flex
Align-items: flex-end
Animation: fadeIn 0.2s ease-out
```

**Sheet Container:**
```css
Width: 100%
Background: var(--tg-theme-bg-color)
Border-top-left-radius: 20px
Border-top-right-radius: 20px
Padding: 8px 0
Padding-bottom: calc(8px + env(safe-area-inset-bottom))
Transform: translateY(100%) → translateY(0)
Transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)
Max-height: 80vh
Overflow-y: auto
```

**Индикатор (handle):**
```css
Width: 40px
Height: 4px
Background: var(--tg-theme-hint-color)
Border-radius: 2px
Margin: 8px auto 16px
Opacity: 0.3
```

**Кнопка меню:**
```css
Padding: 16px 20px
Border: none
Background: transparent
Color: var(--tg-theme-text-color) /* или destructive для удаления */
Font-size: 16px
Text-align: left
Transition: background-color 0.2s
```

**Состояния кнопки:**
- Hover/Press: `background-color: var(--tg-theme-secondary-bg-color)`
- Destructive: `color: var(--tg-theme-destructive-text-color)`

**Разделитель:**
```css
Height: 1px
Background: var(--tg-theme-secondary-bg-color)
Margin: 8px 0
```

### 5.2 TaskDetails (детали задачи)

**Контейнер:**
```css
Position: fixed
Top: 0
Left: 0
Right: 0
Bottom: 0
Background: var(--tg-theme-bg-color)
Z-index: 10000
Display: flex
Flex-direction: column
Overflow: hidden
```

**Заголовок:**
```css
Display: flex
Align-items: center
Justify-content: space-between
Padding: 16px
Border-bottom: 1px solid var(--tg-theme-secondary-bg-color)
```

**Заголовок текст:**
```css
Font-size: 20px
Font-weight: 600
Color: var(--tg-theme-text-color)
Margin: 0
```

**Кнопка закрытия:**
```css
Width: 36px
Height: 36px
Border-radius: 50%
Border: none
Background: var(--tg-theme-secondary-bg-color)
Font-size: 24px
Color: var(--tg-theme-text-color)
```

**Контент:**
```css
Flex: 1
Overflow-y: auto
Padding: 20px 16px
```

**Группа полей:**
```css
Display: flex
Flex-direction: column
Gap: 24px
```

---

## 6. ЭЛЕМЕНТЫ СПИСКА

### 6.1 TaskItem (элемент задачи)

**Контейнер:**
```css
Display: flex
Align-items: center
Gap: 12px
Cursor: pointer
/* Использует класс .list-item */
```

**Чекбокс:**
```css
Width: 20px
Height: 20px
Cursor: pointer
Flex-shrink: 0
```

**Текст задачи:**
```css
Font-size: 16px
Color: var(--tg-theme-text-color) /* или hint-color если completed */
Text-decoration: completed ? 'line-through' : 'none'
Word-break: break-word
```

**Дата/время:**
```css
Font-size: 12px
Color: var(--tg-theme-hint-color)
```

**Кнопка меню (три точки):**
```css
Padding: 8px
Background: transparent
Border: none
Cursor: pointer
Font-size: 20px
Color: var(--tg-theme-hint-color)
Flex-shrink: 0
Display: flex
Align-items: center
Justify-content: center
```

**Символ:** `⋯` (U+22EF)

### 6.2 List Item (базовый стиль)

```css
Background: var(--tg-theme-section-bg-color)
Padding: 16px
Border-bottom: 1px solid var(--tg-theme-secondary-bg-color)
Display: flex
Align-items: center
Gap: 12px
Min-height: 60px
Transition: background-color 0.2s
```

**Состояния:**
- Active: `background-color: var(--tg-theme-secondary-bg-color)`

### 6.3 InBox Item

**Карточка:**
```css
Background: var(--tg-theme-section-bg-color)
Padding: 16px
Border-radius: 12px
Margin-bottom: 12px
Border: 1px solid var(--tg-theme-secondary-bg-color)
```

**Текст заметки:**
```css
Font-size: 16px
Color: var(--tg-theme-text-color)
Margin-bottom: 12px
Word-break: break-word
```

---

## 7. КАЛЕНДАРЬ (PlanView)

### 7.1 Навигация по дням

**Контейнер:**
```css
Display: flex
Align-items: center
Justify-content: space-between
Padding: 16px
Border-bottom: 1px solid var(--tg-theme-secondary-bg-color)
Background: var(--tg-theme-bg-color)
```

**Кнопки навигации:**
- См. раздел 3.2 "Вторичная кнопка"

**Заголовок даты:**
```css
Font-size: 18px
Font-weight: 600
Color: var(--tg-theme-text-color)
Margin-bottom: 4px
```

### 7.2 Почасовой календарь

**Контейнер:**
```css
Flex: 1
Overflow-y: auto
Position: relative
Padding: 16px 0
```

**Временная шкала:**
```css
Position: relative
Min-height: 2400px /* 100px × 24 часа */
```

**Метка часа:**
```css
Position: absolute
Top: ${(hour / 24) * 100}%
Left: 0
Width: 50px
Font-size: 12px
Color: var(--tg-theme-hint-color)
Text-align: right
Padding-right: 12px
```

**Линия часа:**
```css
Position: absolute
Top: ${(hour / 24) * 100}%
Left: 60px
Right: 16px
Height: 1px
Background: hour % 6 === 0 
  ? var(--tg-theme-hint-color) 
  : var(--tg-theme-secondary-bg-color)
Opacity: 0.3
```

**Блок задачи:**
```css
Position: absolute
Top: ${(startMinutes / (24 * 60)) * 100}%
Height: ${(durationMinutes / (24 * 60)) * 100}%
Left: 60px
Right: 16px
Border-radius: 8px
Padding: 8px 12px
Cursor: pointer
Overflow: hidden
/* Background и border-left зависят от приоритета */
```

**Задачи без времени:**
```css
Padding: 16px
Border-bottom: 1px solid var(--tg-theme-secondary-bg-color)
Background: var(--tg-theme-bg-color)
```

**Заголовок секции:**
```css
Font-size: 14px
Font-weight: 600
Color: var(--tg-theme-hint-color)
Margin-bottom: 12px
Text-transform: uppercase
```

**Карточка задачи без времени:**
```css
Padding: 12px
Background: var(--tg-theme-section-bg-color)
Border-radius: 8px
Margin-bottom: 8px
Cursor: pointer
Border: 1px solid var(--tg-theme-secondary-bg-color)
```

---

## 8. ЗАГРУЗКИ И ПУСТЫЕ СОСТОЯНИЯ

### 8.1 EmptyState (InBoxView)

```css
Display: flex
Flex-direction: column
Align-items: center
Justify-content: center
Padding: 40px 20px
Text-align: center
Color: var(--tg-theme-hint-color)
```

**Иконка:**
```css
Font-size: 48px
Margin-bottom: 16px
```

**Текст:**
```css
Font-size: 16px
```

**Подтекст:**
```css
Font-size: 14px
Margin-top: 8px
```

---

## 9. НАВИГАЦИЯ МЕЖДУ РАЗДЕЛАМИ

### 9.1 Заголовки разделов (InBox/Задачи/План)

**Контейнер:**
```css
Display: flex
Justify-content: space-around
Padding: 12px 16px
Border-bottom: 1px solid var(--tg-theme-secondary-bg-color)
Background: var(--tg-theme-bg-color)
```

**Элемент:**
```css
Font-size: 16px
Font-weight: active ? 600 : 400
Color: active 
  ? var(--tg-theme-button-color) 
  : var(--tg-theme-hint-color)
Cursor: pointer
Padding: 8px 12px
Border-bottom: active 
  ? 2px solid var(--tg-theme-button-color) 
  : 2px solid transparent
Transition: all 0.2s
```

---

## 10. ОТСТУПЫ И ПРОМЕЖУТКИ

### 10.1 Стандартные отступы

| Контекст | Значение | Использование |
|----------|----------|---------------|
| Контейнер | 16px | Основные блоки, padding секций |
| Элемент списка | 16px | Padding карточек, элементов |
| Группы полей | 24px | Gap между полями в TaskDetails |
| Мелкие элементы | 8px, 12px | Внутренние отступы, gaps |
| Кнопки | 12px 24px | Стандартный padding кнопок |
| Малые кнопки | 8px 16px | Компактные кнопки |

### 10.2 Border Radius

| Элемент | Значение | Использование |
|---------|----------|---------------|
| Кнопки | 10px | Основные кнопки |
| Карточки | 12px | InBox items, карточки задач |
| Модальные окна | 20px (top) | BottomSheet |
| Круглые элементы | 50% | FAB, кнопка закрытия |
| Поля ввода | 12px | Wizard inputs |
| Малые элементы | 6px, 8px | Мелкие кнопки, индикаторы |

---

## 11. АНИМАЦИИ И ПЕРЕХОДЫ

### 11.1 Transitions

| Элемент | Свойство | Значение |
|---------|----------|----------|
| Кнопки | opacity | 0.2s |
| FAB | transform, box-shadow | 0.2s |
| BottomSheet | transform | 0.3s cubic-bezier(0.4, 0, 0.2, 1) |
| Заголовки разделов | all | 0.2s |
| List items | background-color | 0.2s |
| Поля ввода | border-color | 0.2s |
| Кнопки меню | background-color | 0.2s |

### 11.2 Animations

**Fade In (BottomSheet backdrop):**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
Duration: 0.2s
Timing: ease-out
```

**BottomSheet появление:**
- Начальное состояние: `transform: translateY(100%)`
- Конечное состояние: `transform: translateY(0)`
- Transition: `0.3s cubic-bezier(0.4, 0, 0.2, 1)`

---

## 12. Z-INDEX СЛОИ

| Элемент | Z-index | Описание |
|---------|---------|----------|
| FAB | 100 | Плавающая кнопка |
| Заголовки разделов | 10 | Sticky заголовок |
| BottomSheet | 10000 | Модальное меню |
| TaskDetails | 10000 | Модальное окно деталей |

---

## 13. ИКОНКИ И СИМВОЛЫ

### 13.1 Приоритеты
- Высокий: 🔴
- Средний: 🟡
- Низкий: 🟢

### 13.2 Действия
- Закреплено: 📌
- Меню: ⋯ (U+22EF)
- Закрыть: × (U+00D7)

### 13.3 Пустые состояния
- InBox пуст: 📥
- Нет задач: (используется EmptyState компонент)

---

## 14. СПЕЦИАЛЬНЫЕ СЛУЧАИ

### 14.1 Выполненная задача

**Текст:**
```css
Color: var(--tg-theme-hint-color)
Text-decoration: line-through
Opacity: 0.6 (в некоторых случаях)
```

### 14.2 Закрепленная задача

**Маркер:** 📌 перед текстом

### 14.3 Безопасные зоны (Safe Area)

Все фиксированные элементы учитывают safe area insets:
- Bottom: `calc(20px + env(safe-area-inset-bottom))`
- Top: `calc(16px + env(safe-area-inset-top))`

---

## 15. АДАПТИВНОСТЬ

### 15.1 Мобильные устройства

На маленьких экранах (< 768px):
```css
FAB: 
  Width: 48px
  Height: 48px
  Bottom: calc(16px + env(safe-area-inset-bottom))
  Right: 16px
```

---

## 16. ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ

### 16.1 Создание стандартной кнопки

```jsx
<button className="tg-button">
  Текст кнопки
</button>
```

### 16.2 Создание outline кнопки

```jsx
<button style={{
  padding: '8px 16px',
  borderRadius: '8px',
  border: '1px solid var(--tg-theme-button-color)',
  backgroundColor: 'transparent',
  color: 'var(--tg-theme-button-color)',
  fontSize: '16px',
  fontWeight: '500',
  cursor: 'pointer',
  minWidth: '60px'
}}>
  Текст
</button>
```

### 16.3 Создание карточки задачи

```jsx
<div style={{
  backgroundColor: 'var(--tg-theme-section-bg-color)',
  padding: '16px',
  borderRadius: '12px',
  marginBottom: '12px',
  border: '1px solid var(--tg-theme-secondary-bg-color)'
}}>
  {/* Контент */}
</div>
```

---

## 17. ЧЕКЛИСТ СОЗДАНИЯ НОВОГО ЭЛЕМЕНТА

При создании нового элемента в разделе задач убедитесь, что:

- [ ] Используются правильные Telegram theme variables
- [ ] Размеры соответствуют стандартам (кнопки min-height: 44px)
- [ ] Border-radius соответствует типу элемента
- [ ] Цвета соответствуют палитре
- [ ] Есть правильные transitions для интерактивных элементов
- [ ] Учтены safe area insets для фиксированных элементов
- [ ] Z-index правильный для модальных окон
- [ ] Шрифты соответствуют типографике
- [ ] Отступы соответствуют стандартам
- [ ] Элемент поддерживает темную/светлую тему через CSS variables

---

**Последнее обновление:** 2025-01-02
**Версия:** 1.0

