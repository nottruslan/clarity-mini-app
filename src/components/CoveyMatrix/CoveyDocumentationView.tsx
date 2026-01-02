export default function CoveyDocumentationView() {
  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '20px 16px',
      paddingBottom: 'calc(40px + env(safe-area-inset-bottom))',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: '700',
        margin: '0 0 8px 0',
        color: 'var(--tg-theme-text-color)',
        lineHeight: '1.2'
      }}>
        Матрица Эйзенхауэра
      </h1>
      
      <p style={{
        fontSize: '16px',
        color: 'var(--tg-theme-hint-color)',
        margin: '0 0 24px 0',
        lineHeight: '1.6'
      }}>
        Метод управления временем из книги «7 навыков высокоэффективных людей» Стивена Кови
      </p>

      {/* Что такое матрица */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '22px',
          fontWeight: '600',
          margin: '0 0 16px 0',
          color: 'var(--tg-theme-text-color)'
        }}>
          Что это такое?
        </h2>
        <p style={{
          fontSize: '16px',
          color: 'var(--tg-theme-text-color)',
          margin: '0 0 16px 0',
          lineHeight: '1.7'
        }}>
          Матрица Эйзенхауэра — это инструмент приоритизации задач, который помогает разделить дела на четыре категории в зависимости от их важности и срочности. Метод назван в честь 34-го президента США Дуайта Эйзенхауэра, который говорил:
        </p>
        <blockquote style={{
          margin: '0 0 16px 0',
          padding: '16px 20px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          borderRadius: '12px',
          borderLeft: '4px solid var(--tg-theme-button-color)',
          fontStyle: 'italic',
          fontSize: '16px',
          color: 'var(--tg-theme-text-color)',
          lineHeight: '1.7'
        }}>
          "У меня есть два вида проблем: срочные и важные. Срочные не важны, а важные никогда не бывают срочными."
        </blockquote>
        <p style={{
          fontSize: '16px',
          color: 'var(--tg-theme-text-color)',
          margin: '0',
          lineHeight: '1.7'
        }}>
          Стивен Кови развил эту идею, создав матрицу из четырех квадрантов, каждый из которых требует своего подхода.
        </p>
      </section>

      {/* Квадрант 1 */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 87, 87, 0.1)',
          borderLeft: '4px solid #ff5757',
          marginBottom: '16px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            margin: '0 0 8px 0',
            color: 'var(--tg-theme-text-color)'
          }}>
            Квадрант 1: Важно и срочно
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'var(--tg-theme-hint-color)',
            margin: '0 0 12px 0',
            lineHeight: '1.6'
          }}>
            Кризисы, неотложные дедлайны, проблемы, требующие немедленного решения
          </p>
        </div>
        
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: '0 0 12px 0',
          color: 'var(--tg-theme-text-color)'
        }}>
          Характеристики
        </h3>
        <ul style={{
          margin: '0 0 16px 0',
          paddingLeft: '20px',
          listStyle: 'none'
        }}>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Требуют немедленного внимания
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Имеют серьезные последствия, если их не выполнить
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Часто являются результатом плохого планирования
          </li>
        </ul>

        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: '0 0 12px 0',
          color: 'var(--tg-theme-text-color)'
        }}>
          Примеры
        </h3>
        <ul style={{
          margin: '0 0 16px 0',
          paddingLeft: '20px',
          listStyle: 'none'
        }}>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Критические дедлайны проекта
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Срочные проблемы со здоровьем
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Кризисные ситуации на работе
          </li>
        </ul>

        <div style={{
          padding: '12px 16px',
          backgroundColor: 'rgba(255, 87, 87, 0.1)',
          borderRadius: '8px',
          fontSize: '14px',
          color: 'var(--tg-theme-text-color)',
          lineHeight: '1.6'
        }}>
          <strong>Важно:</strong> Чем больше времени проводите в этом квадранте, тем больше стресса испытываете. Старайтесь минимизировать количество задач здесь через лучшее планирование.
        </div>
      </section>

      {/* Квадрант 2 */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderLeft: '4px solid #4caf50',
          marginBottom: '16px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            margin: '0 0 8px 0',
            color: 'var(--tg-theme-text-color)'
          }}>
            Квадрант 2: Важно, но не срочно
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'var(--tg-theme-hint-color)',
            margin: '0 0 12px 0',
            lineHeight: '1.6'
          }}>
            Профилактика, планирование, развитие, стратегические задачи
          </p>
        </div>
        
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: '0 0 12px 0',
          color: 'var(--tg-theme-text-color)'
        }}>
          Характеристики
        </h3>
        <ul style={{
          margin: '0 0 16px 0',
          paddingLeft: '20px',
          listStyle: 'none'
        }}>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Не требуют немедленного действия
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Имеют долгосрочную ценность
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Помогают предотвратить кризисы (Квадрант 1)
          </li>
        </ul>

        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: '0 0 12px 0',
          color: 'var(--tg-theme-text-color)'
        }}>
          Примеры
        </h3>
        <ul style={{
          margin: '0 0 16px 0',
          paddingLeft: '20px',
          listStyle: 'none'
        }}>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Планирование долгосрочных целей
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Развитие навыков и обучение
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Регулярные физические упражнения
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Профилактическое обслуживание
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Построение отношений
          </li>
        </ul>

        <div style={{
          padding: '12px 16px',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderRadius: '8px',
          fontSize: '14px',
          color: 'var(--tg-theme-text-color)',
          lineHeight: '1.6',
          marginBottom: '16px'
        }}>
          <strong>Золотое правило:</strong> Этот квадрант — сердце эффективного управления временем. Высокоэффективные люди проводят большую часть времени здесь, предотвращая кризисы и строя будущее.
        </div>
      </section>

      {/* Квадрант 3 */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          borderLeft: '4px solid #ffc107',
          marginBottom: '16px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            margin: '0 0 8px 0',
            color: 'var(--tg-theme-text-color)'
          }}>
            Квадрант 3: Не важно, но срочно
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'var(--tg-theme-hint-color)',
            margin: '0 0 12px 0',
            lineHeight: '1.6'
          }}>
            Прерывания, некоторые звонки и письма, отвлекающие дела
          </p>
        </div>
        
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: '0 0 12px 0',
          color: 'var(--tg-theme-text-color)'
        }}>
          Характеристики
        </h3>
        <ul style={{
          margin: '0 0 16px 0',
          paddingLeft: '20px',
          listStyle: 'none'
        }}>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Требуют немедленного внимания
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Не способствуют достижению ваших целей
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Часто кажутся важными из-за срочности
          </li>
        </ul>

        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: '0 0 12px 0',
          color: 'var(--tg-theme-text-color)'
        }}>
          Примеры
        </h3>
        <ul style={{
          margin: '0 0 16px 0',
          paddingLeft: '20px',
          listStyle: 'none'
        }}>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Неожиданные звонки и сообщения
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Некоторые встречи и совещания
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Прерывания от других людей
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Активности, которые "срочно, но не для вас"
          </li>
        </ul>

        <div style={{
          padding: '12px 16px',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          borderRadius: '8px',
          fontSize: '14px',
          color: 'var(--tg-theme-text-color)',
          lineHeight: '1.6'
        }}>
          <strong>Совет:</strong> Научитесь говорить "нет" или делегировать такие задачи. Многие из них кажутся важными, но на самом деле не способствуют вашим целям.
        </div>
      </section>

      {/* Квадрант 4 */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'rgba(158, 158, 158, 0.1)',
          borderLeft: '4px solid #9e9e9e',
          marginBottom: '16px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            margin: '0 0 8px 0',
            color: 'var(--tg-theme-text-color)'
          }}>
            Квадрант 4: Не важно и не срочно
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'var(--tg-theme-hint-color)',
            margin: '0 0 12px 0',
            lineHeight: '1.6'
          }}>
            Пожиратели времени, пустая активность, лишняя деятельность
          </p>
        </div>
        
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: '0 0 12px 0',
          color: 'var(--tg-theme-text-color)'
        }}>
          Характеристики
        </h3>
        <ul style={{
          margin: '0 0 16px 0',
          paddingLeft: '20px',
          listStyle: 'none'
        }}>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Не важны и не срочны
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Дают только временное удовольствие
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Не способствуют достижению целей
          </li>
        </ul>

        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: '0 0 12px 0',
          color: 'var(--tg-theme-text-color)'
        }}>
          Примеры
        </h3>
        <ul style={{
          margin: '0 0 16px 0',
          paddingLeft: '20px',
          listStyle: 'none'
        }}>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Бесцельное пролистывание социальных сетей
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Лишняя переписка и болтовня
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Просмотр бесконечных развлекательных видео
          </li>
          <li style={{
            marginBottom: '8px',
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            lineHeight: '1.7',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            Переключение между задачами без результата
          </li>
        </ul>

        <div style={{
          padding: '12px 16px',
          backgroundColor: 'rgba(158, 158, 158, 0.1)',
          borderRadius: '8px',
          fontSize: '14px',
          color: 'var(--tg-theme-text-color)',
          lineHeight: '1.6'
        }}>
          <strong>Рекомендация:</strong> Минимизируйте время в этом квадранте или полностью исключите такие активности. Это пожиратели времени, которые мешают продуктивности.
        </div>
      </section>

      {/* Как пользоваться */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '22px',
          fontWeight: '600',
          margin: '0 0 16px 0',
          color: 'var(--tg-theme-text-color)'
        }}>
          Как пользоваться матрицей?
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 12px 0',
            color: 'var(--tg-theme-text-color)'
          }}>
            1. Добавьте свои задачи
          </h3>
          <p style={{
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            margin: '0 0 12px 0',
            lineHeight: '1.7'
          }}>
            Нажмите на кнопку "+" в нужном квадранте и создайте задачу. Система автоматически определит важность и срочность по выбранному квадранту.
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 12px 0',
            color: 'var(--tg-theme-text-color)'
          }}>
            2. Оцените важность и срочность
          </h3>
          <p style={{
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            margin: '0 0 12px 0',
            lineHeight: '1.7'
          }}>
            <strong>Важность</strong> — насколько задача способствует вашим долгосрочным целям и ценностям.
          </p>
          <p style={{
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            margin: '0 0 12px 0',
            lineHeight: '1.7'
          }}>
            <strong>Срочность</strong> — требует ли задача немедленного внимания и имеет ли четкий дедлайн.
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 12px 0',
            color: 'var(--tg-theme-text-color)'
          }}>
            3. Фокусируйтесь на Квадранте 2
          </h3>
          <p style={{
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            margin: '0 0 12px 0',
            lineHeight: '1.7'
          }}>
            Высокоэффективные люди проводят 60-80% времени в Квадранте 2. Это позволяет:
          </p>
          <ul style={{
            margin: '0 0 16px 0',
            paddingLeft: '20px',
            listStyle: 'none'
          }}>
            <li style={{
              marginBottom: '8px',
              fontSize: '16px',
              color: 'var(--tg-theme-text-color)',
              lineHeight: '1.7',
              position: 'relative',
              paddingLeft: '24px'
            }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              Предотвращать кризисы (Квадрант 1)
            </li>
            <li style={{
              marginBottom: '8px',
              fontSize: '16px',
              color: 'var(--tg-theme-text-color)',
              lineHeight: '1.7',
              position: 'relative',
              paddingLeft: '24px'
            }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              Достигать долгосрочных целей
            </li>
            <li style={{
              marginBottom: '8px',
              fontSize: '16px',
              color: 'var(--tg-theme-text-color)',
              lineHeight: '1.7',
              position: 'relative',
              paddingLeft: '24px'
            }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              Снижать уровень стресса
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 12px 0',
            color: 'var(--tg-theme-text-color)'
          }}>
            4. Минимизируйте Квадранты 3 и 4
          </h3>
          <p style={{
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            margin: '0',
            lineHeight: '1.7'
          }}>
            Научитесь говорить "нет" неважным задачам и делегировать срочные, но неважные дела. Устраните полностью активности из Квадранта 4.
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 12px 0',
            color: 'var(--tg-theme-text-color)'
          }}>
            5. Регулярно пересматривайте
          </h3>
          <p style={{
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            margin: '0',
            lineHeight: '1.7'
          }}>
            Задачи могут перемещаться между квадрантами. То, что сегодня не срочно, может стать срочным завтра. Регулярно проверяйте свои задачи и перемещайте их при необходимости.
          </p>
        </div>
      </section>

      {/* Принципы эффективности */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '22px',
          fontWeight: '600',
          margin: '0 0 16px 0',
          color: 'var(--tg-theme-text-color)'
        }}>
          Принципы эффективности от Стивена Кови
        </h2>

        <div style={{
          padding: '16px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 12px 0',
            color: 'var(--tg-theme-text-color)'
          }}>
            Быть проактивным
          </h3>
          <p style={{
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            margin: '0',
            lineHeight: '1.7'
          }}>
            Фокусируйтесь на том, что можете контролировать (важные задачи), а не на том, что не можете (срочные требования других).
          </p>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 12px 0',
            color: 'var(--tg-theme-text-color)'
          }}>
            Начинать с конца в голове
          </h3>
          <p style={{
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            margin: '0',
            lineHeight: '1.7'
          }}>
            Определите свои ценности и долгосрочные цели. Это поможет правильно оценить важность задач.
          </p>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          borderRadius: '12px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 12px 0',
            color: 'var(--tg-theme-text-color)'
          }}>
            Сначала главное
          </h3>
          <p style={{
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            margin: '0',
            lineHeight: '1.7'
          }}>
            Матрица Эйзенхауэра — это визуализация принципа "сначала главное". Важные задачи должны иметь приоритет, даже если они не срочные.
          </p>
        </div>
      </section>

      {/* Заключение */}
      <section>
        <div style={{
          padding: '20px',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderRadius: '12px',
          border: '2px solid #4caf50'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            margin: '0 0 12px 0',
            color: 'var(--tg-theme-text-color)'
          }}>
            Заключение
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'var(--tg-theme-text-color)',
            margin: '0',
            lineHeight: '1.7'
          }}>
            Матрица Эйзенхауэра — это не просто инструмент управления временем, это способ мышления. Она помогает делать правильный выбор, основываясь на ваших ценностях и целях, а не на срочности и давлении извне. Начните применять этот метод уже сегодня, и вы увидите, как изменится ваша продуктивность и качество жизни.
          </p>
        </div>
      </section>
    </div>
  );
}

