# Брендбук Clarity App

Документ описывает единые стили, компоненты и UX паттерны для унификации всех разделов приложения.

## Цветовая палитра

Приложение использует Telegram Theme Variables для адаптации под светлую/темную тему:

```css
--tg-theme-bg-color: Основной цвет фона
--tg-theme-text-color: Основной цвет текста
--tg-theme-hint-color: Вторичный текст (подсказки)
--tg-theme-button-color: Цвет кнопок (обычно #3390ec)
--tg-theme-button-text-color: Цвет текста на кнопках
--tg-theme-secondary-bg-color: Вторичный фон (#f1f1f1)
--tg-theme-destructive-text-color: Деструктивные действия (#ff3b30)
```

**Важно:** Всегда используйте CSS переменные, не хардкодите цвета.

## Типографика

### Заголовки секций
- **Размер:** `20px`
- **Font-weight:** `600`
- **Отступы:** `margin-bottom: 16px, margin-top: 8px`

### Заголовки подсекций
- **Размер:** `18px`
- **Font-weight:** `600`
- **Отступ:** `margin-bottom: 12px`

### Основной текст
- **Размер:** `16px` (списки, карточки)
- **Размер:** `14px` (вторичная информация)

### Вторичный текст (подсказки)
- **Размер:** `12px` или `14px`
- **Цвет:** `var(--tg-theme-hint-color)`

## Компоненты

### Список элементов (.list-item)

Используется для отображения списков (задачи, привычки, отчеты).

**Структура:**
```tsx
<div className="list-item" style={{
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer'
}}>
  {/* Основной контент */}
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
    {/* Заголовок, описание, метаданные */}
  </div>
  {/* Меню действий (кнопка "⋯") */}
  <button>⋯</button>
</div>
```

**Особенности:**
- Клик по карточке открывает детальный просмотр (Bottom Sheet)
- Меню действий через кнопку "⋯" (три точки)
- Нет отдельных кнопок редактирования/удаления на карточке

**CSS класс:** `.list-item` (определен в `global.css`)

### Bottom Sheet

Паттерн для модальных окон и детального просмотра.

**Структура:**
```tsx
const backdropRef = useRef<HTMLDivElement>(null);
const sheetRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  document.body.style.overflow = 'hidden';
  if (sheetRef.current) {
    setTimeout(() => {
      sheetRef.current.style.transform = 'translateY(0)';
    }, 10);
  }
  return () => {
    document.body.style.overflow = '';
  };
}, []);

return (
  <div
    ref={backdropRef}
    onClick={handleBackdropClick}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 9999, // или 10000 для верхних слоев
      display: 'flex',
      alignItems: 'flex-end',
      animation: 'fadeIn 0.2s ease-out'
    }}
  >
    <div
      ref={sheetRef}
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        backgroundColor: 'var(--tg-theme-bg-color)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        height: '90vh',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        transform: 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}
    >
      {/* Индикатор */}
      <div style={{
        width: '40px',
        height: '4px',
        backgroundColor: 'var(--tg-theme-hint-color)',
        borderRadius: '2px',
        margin: '12px auto 8px',
        opacity: 0.3,
        flexShrink: 0
      }} />
      
      {/* Header с кнопкой закрытия */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', flex: 1 }}>
          Заголовок
        </h2>
        {/* Меню "⋯" (опционально) */}
        {/* Кнопка закрытия "×" */}
        <button onClick={handleClose}>×</button>
      </div>
      
      {/* Контент с прокруткой */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {/* Содержимое */}
      </div>
    </div>
  </div>
);
```

**Особенности:**
- Индикатор сверху (горизонтальная линия)
- Кнопка закрытия "×" справа в header
- Анимация появления снизу
- Блокировка скролла body при открытии
- Клик по backdrop закрывает Bottom Sheet

### FAB кнопка (Floating Action Button)

Кнопка создания нового элемента в правом нижнем углу.

```tsx
<button 
  className="fab"
  onClick={handleCreate}
  aria-label="Создать"
  style={{ zIndex: 10001 }}
>
  +
</button>
```

**Особенности:**
- Фиксированная позиция в правом нижнем углу
- Символ "+" (не эмодзи)
- z-index: 10001 (выше Bottom Sheets)
- Использует класс `.fab` из `global.css`

### GradientButton

Стандартная кнопка для форм и действий.

```tsx
<GradientButton
  variant="primary" | "secondary"
  onClick={handleAction}
  disabled={false}
>
  Текст кнопки
</GradientButton>
```

**Варианты:**
- `primary` (по умолчанию): Градиент с тенью
- `secondary`: Вторичный фон

**Размеры (CSS):**
- `min-height: 48px`
- `padding: 14px 24px`
- `font-size: 17px`
- `font-weight: 600`

**Важно:** GradientButton не принимает проп `style`. Используйте CSS классы или обертку для кастомных стилей.

### Меню действий (Bottom Sheet меню)

Меню с опциями действий (Редактировать, Удалить, и т.д.).

**Структура:**
```tsx
<div style={{
  width: '100%',
  backgroundColor: 'var(--tg-theme-bg-color)',
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
  padding: '8px 0',
  paddingBottom: 'calc(8px + env(safe-area-inset-bottom))',
  transform: 'translateY(100%)',
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  maxHeight: '80vh',
  overflowY: 'auto'
}}>
  {/* Индикатор */}
  <div style={{
    width: '40px',
    height: '4px',
    backgroundColor: 'var(--tg-theme-hint-color)',
    borderRadius: '2px',
    margin: '8px auto 16px',
    opacity: 0.3
  }} />
  
  {/* Опции */}
  <button style={{
    padding: '16px 20px',
    border: 'none',
    background: 'transparent',
    color: 'var(--tg-theme-text-color)',
    fontSize: '16px',
    textAlign: 'left',
    cursor: 'pointer',
    width: '100%'
  }}>
    Опция 1
  </button>
  
  {/* Разделитель */}
  <div style={{
    height: '1px',
    backgroundColor: 'var(--tg-theme-secondary-bg-color)',
    margin: '8px 0'
  }} />
  
  {/* Деструктивная опция */}
  <button style={{
    ...buttonStyle,
    color: 'var(--tg-theme-destructive-text-color)'
  }}>
    Удалить
  </button>
</div>
```

## UX Паттерны

### Навигация между разделами

Используется горизонтальная навигация с табами:

```tsx
const sectionTitles = ['Раздел 1', 'Раздел 2', 'Раздел 3'];
const [currentSlide, setCurrentSlide] = useState(0);

// Header с табами
<div style={{
  display: 'flex',
  justifyContent: 'space-around',
  padding: '12px 16px',
  borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
  backgroundColor: 'var(--tg-theme-bg-color)'
}}>
  {sectionTitles.map((title, index) => (
    <div
      key={index}
      onClick={() => setCurrentSlide(index)}
      style={{
        fontSize: '16px',
        fontWeight: currentSlide === index ? '600' : '400',
        color: currentSlide === index 
          ? 'var(--tg-theme-button-color)' 
          : 'var(--tg-theme-hint-color)',
        cursor: 'pointer',
        padding: '8px 12px',
        borderBottom: currentSlide === index 
          ? '2px solid var(--tg-theme-button-color)' 
          : '2px solid transparent',
        transition: 'all 0.2s'
      }}
    >
      {title}
    </div>
  ))}
</div>

// Контейнер со слайдами
<div className="slide-container" onTouchStart={...} onTouchMove={...} onTouchEnd={...}>
  {sectionTitles.map((_, index) => (
    <div className={`slide ${currentSlide === index ? 'active' : ...}`}>
      {/* Контент раздела */}
    </div>
  ))}
</div>
```

**Поддержка свайпа:** Обработчики `onTouchStart`, `onTouchMove`, `onTouchEnd` для горизонтального свайпа.

### Действия с элементами

**Принцип:**
1. Клик по элементу → открывает детальный просмотр (Bottom Sheet)
2. Кнопка "⋯" → открывает меню действий (Bottom Sheet меню)
3. Действия (Редактировать, Удалить, Дублировать) → только через меню

**Не делать:**
- ❌ Отдельные кнопки "Редактировать", "Удалить" на карточке
- ❌ Редактирование по клику на карточку/поле (только через меню)

### Визард создания/редактирования

Многошаговая форма для создания элементов.

**Структура:**
```tsx
<WizardContainer 
  currentStep={currentStep + 1} 
  totalSteps={totalSteps}
  progressColor={colors.primary}
>
  {steps.map((StepComponent, index) => (
    <div className={`wizard-slide ${currentStep === index ? 'active' : ...}`}>
      <StepComponent
        onNext={handleNext}
        onBack={handleBack}
        initialData={...}
      />
    </div>
  ))}
</WizardContainer>
```

**Кнопки в шагах:**
- Всегда используют `GradientButton`
- Расположены в ряд: `display: 'flex', gap: '12px', width: '100%'`
- "Назад" - `variant="secondary"`
- "Продолжить/Сохранить" - `variant="primary"` (по умолчанию)

### Прогресс-бары

Отображение прогресса заполнения (например, в годовых отчетах).

```tsx
<div style={{
  height: '4px',
  backgroundColor: 'var(--tg-theme-secondary-bg-color)',
  borderRadius: '2px',
  overflow: 'hidden'
}}>
  <div style={{
    height: '100%',
    width: `${progress}%`,
    backgroundColor: 'var(--tg-theme-button-color)',
    transition: 'width 0.3s ease'
  }} />
</div>
```

## Отступы и размеры

### Стандартные отступы
- **Между элементами списка:** `gap: '12px'`
- **Внутри карточек:** `padding: '12px'` или `padding: '16px'`
- **Между секциями:** `marginBottom: '24px'` или `marginBottom: '32px'`
- **Отступы контента:** `padding: '16px'`

### Радиусы скругления
- **Карточки:** `borderRadius: '12px'`
- **Bottom Sheet:** `borderTopLeftRadius: '20px', borderTopRightRadius: '20px'`
- **Кнопки:** `borderRadius: '12px'` или `borderRadius: '10px'`

### Минимальные размеры для клика
- **Кнопки:** `min-height: 44px` или `min-height: 48px`
- **Элементы меню:** `padding: '16px 20px'`

## Анимации

### Появление Bottom Sheet
```css
transform: translateY(100%) → translateY(0)
transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

### Появление backdrop
```css
animation: fadeIn 0.2s ease-out
```

### Появление элементов списка
```css
animation: fadeIn 0.3s ease-in
```

## Z-index уровни

- **Основной контент:** `z-index: 1` (по умолчанию)
- **Header/Sticky элементы:** `z-index: 10`
- **Bottom Sheet backdrop:** `z-index: 9999`
- **Bottom Sheet:** `z-index: 10000`
- **FAB кнопка:** `z-index: 10001`
- **EditFieldModal:** `z-index: 10001`

## Доступность

- Всегда используйте `aria-label` для иконок и кнопок без текста
- Обеспечьте достаточные размеры для клика (минимум 44x44px)
- Используйте семантичные HTML элементы (button, не div с onClick)

## Примеры использования

### Создание нового раздела

1. Создайте страницу с табами (если нужны разделы)
2. Используйте `.list-item` для элементов списка
3. Создайте Bottom Sheet для детального просмотра
4. Создайте Bottom Sheet меню для действий
5. Добавьте FAB кнопку для создания
6. Используйте WizardContainer для создания/редактирования

### Пример полной структуры раздела

```tsx
export default function MySectionPage({ storage }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Табы навигации */}
      <div style={{...}}>
        {tabs.map(...)}
      </div>
      
      {/* Контент */}
      <div className="slide-container">
        {sections.map((section, index) => (
          <div className={`slide ${...}`}>
            {items.map(item => (
              <div className="list-item" onClick={() => setSelectedItem(item)}>
                {/* Контент */}
                <button onClick={(e) => {
                  e.stopPropagation();
                  setShowMenuId(item.id);
                }}>⋯</button>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* FAB */}
      <button className="fab" onClick={() => setIsCreating(true)}>+</button>
      
      {/* Bottom Sheet детального просмотра */}
      {selectedItem && (
        <ItemBottomSheet
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onEdit={...}
          onDelete={...}
        />
      )}
      
      {/* Bottom Sheet меню */}
      {showMenuId && (
        <ActionMenuBottomSheet
          onClose={() => setShowMenuId(null)}
          onEdit={...}
          onDelete={...}
        />
      )}
      
      {/* Визард создания */}
      {isCreating && (
        <WizardContainer>...</WizardContainer>
      )}
    </div>
  );
}
```

## Чеклист для унификации раздела

- [ ] Используются `.list-item` для элементов списка
- [ ] Кнопки действий вынесены в меню "⋯" (нет на карточке)
- [ ] Детальный просмотр открывается в Bottom Sheet
- [ ] Bottom Sheet имеет индикатор сверху
- [ ] Bottom Sheet имеет кнопку закрытия "×"
- [ ] FAB кнопка использует символ "+"
- [ ] Заголовки секций: 20px, font-weight 600
- [ ] Используются Telegram Theme Variables
- [ ] Кнопки в визарде используют GradientButton
- [ ] Кнопки в визарде: flex row, width: 100%, gap: 12px
- [ ] Все цвета через CSS переменные
- [ ] Поддержка свайпа между разделами (если есть табы)

## Дополнительные ресурсы

- `src/styles/global.css` - основные стили
- `src/components/Wizard/GradientButton.tsx` - компонент кнопки
- `src/components/Tasks/TaskItem.tsx` - пример list-item
- `src/components/Habits/HabitDetailsBottomSheet.tsx` - пример Bottom Sheet
- `src/components/Habits/HabitBottomSheet.tsx` - пример меню действий

