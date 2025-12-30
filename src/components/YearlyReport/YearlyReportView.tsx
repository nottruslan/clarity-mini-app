import { useRef } from 'react';
import { type YearlyReport } from '../../utils/storage';
import LifeAreaCard from './LifeAreaCard';

interface YearlyReportViewProps {
  report: YearlyReport;
  onClose: () => void;
}

export default function YearlyReportView({ report, onClose }: YearlyReportViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element && scrollRef.current) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + scrollRef.current.scrollTop - offset;

      scrollRef.current.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const sections = [
    { id: 'past-year', label: 'Прошлый год', icon: '📅' },
    { id: 'future-year', label: 'Будущий год', icon: '🌟' }
  ];

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--tg-theme-secondary-bg-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--tg-theme-bg-color)',
        zIndex: 10
      }}>
        <button
          onClick={onClose}
          style={{
            padding: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--tg-theme-text-color)',
            cursor: 'pointer',
            fontSize: '18px',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          ←
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: '600', flex: 1 }}>
          Отчет за {report.year}
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                color: 'var(--tg-theme-text-color)',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--tg-theme-button-color)';
                e.currentTarget.style.color = 'var(--tg-theme-button-text-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--tg-theme-secondary-bg-color)';
                e.currentTarget.style.color = 'var(--tg-theme-text-color)';
              }}
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px'
        }}
      >
        {/* Прошлый год */}
        <section id="past-year" style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📅 Прошлый год
          </h2>

          {/* Календарь событий */}
          {report.pastYear.calendarEvents && report.pastYear.calendarEvents.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Важные события
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {report.pastYear.calendarEvents.map((event, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '12px',
                      backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      animation: `fadeIn 0.3s ease-in ${index * 0.05}s both`
                    }}
                  >
                    {event}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Сферы жизни */}
          {report.pastYear.lifeAreas && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Сферы жизни
              </h3>
              <LifeAreaCard icon="👨‍👩‍👧‍👦" title="Личная жизнь, семья" content={report.pastYear.lifeAreas.personal} />
              <LifeAreaCard icon="👥" title="Друзья, сообщество" content={report.pastYear.lifeAreas.friends} />
              <LifeAreaCard icon="💪" title="Физическое здоровье, спорт" content={report.pastYear.lifeAreas.health} />
              <LifeAreaCard icon="🔥" title="Привычки" content={report.pastYear.lifeAreas.habits} />
              <LifeAreaCard icon="💼" title="Карьера, обучение" content={report.pastYear.lifeAreas.career} />
              <LifeAreaCard icon="🎨" title="Отдых, хобби, творчество" content={report.pastYear.lifeAreas.hobbies} />
              <LifeAreaCard icon="🧠" title="Психология, самопознание" content={report.pastYear.lifeAreas.psychology} />
              <LifeAreaCard icon="🌍" title="Лучшее завтра" content={report.pastYear.lifeAreas.betterTomorrow} />
            </div>
          )}

          {/* Важные моменты */}
          {report.pastYear.importantMoments && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Важные моменты
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {report.pastYear.importantMoments.wisestDecision && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">🧠 Самое мудрое решение</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {report.pastYear.importantMoments.wisestDecision}
                      </p>
                    </div>
                  </div>
                )}
                {report.pastYear.importantMoments.biggestLesson && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">📚 Самый большой урок</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {report.pastYear.importantMoments.biggestLesson}
                      </p>
                    </div>
                  </div>
                )}
                {report.pastYear.importantMoments.biggestRisk && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">🎲 Самый крупный риск</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {report.pastYear.importantMoments.biggestRisk}
                      </p>
                    </div>
                  </div>
                )}
                {report.pastYear.importantMoments.biggestSurprise && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">🎁 Самый большой сюрприз</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {report.pastYear.importantMoments.biggestSurprise}
                      </p>
                    </div>
                  </div>
                )}
                {report.pastYear.importantMoments.importantForOthers && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">❤️ Самая важная вещь для других</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {report.pastYear.importantMoments.importantForOthers}
                      </p>
                    </div>
                  </div>
                )}
                {report.pastYear.importantMoments.biggestCompletion && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">✅ Самое большое дело</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {report.pastYear.importantMoments.biggestCompletion}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Вопросы */}
          {report.pastYear.questions && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Вопросы о прошедшем годе
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {report.pastYear.questions.proudOf && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">Чем ты гордишься больше всего?</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {report.pastYear.questions.proudOf}
                      </p>
                    </div>
                  </div>
                )}
                {report.pastYear.questions.threePeopleInfluenced && report.pastYear.questions.threePeopleInfluenced.some(p => p) && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">Какие три человека оказали на тебя наибольшее влияние?</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {report.pastYear.questions.threePeopleInfluenced.filter(p => p).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
                {report.pastYear.questions.threePeopleInfluencedBy && report.pastYear.questions.threePeopleInfluencedBy.some(p => p) && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">На каких трех людей оказывал(а) наибольшее влияние ты?</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {report.pastYear.questions.threePeopleInfluencedBy.filter(p => p).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
                {report.pastYear.questions.unfinished && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">Что у тебя не получилось завершить?</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {report.pastYear.questions.unfinished}
                      </p>
                    </div>
                  </div>
                )}
                {report.pastYear.questions.bestDiscovery && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">Самое лучшее, что ты открыл(а) в себе?</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {report.pastYear.questions.bestDiscovery}
                      </p>
                    </div>
                  </div>
                )}
                {report.pastYear.questions.mostGrateful && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">За что ты больше всего благодарен(а)?</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {report.pastYear.questions.mostGrateful}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Лучшие моменты */}
          {report.pastYear.bestMoments && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                ✨ Лучшие моменты
              </h3>
              <div className="wizard-card">
                <div className="wizard-card-content">
                  <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap' }}>
                    {report.pastYear.bestMoments}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Достижения */}
          {report.pastYear.achievements && report.pastYear.achievements.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                🏆 Достижения
              </h3>
              {report.pastYear.achievements.map((achievement, index) => (
                <div key={index} className="wizard-card" style={{ marginBottom: '12px' }}>
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">Достижение {index + 1}</div>
                    {achievement.achievement && (
                      <p className="wizard-card-description" style={{ marginTop: '8px', fontWeight: '600' }}>
                        {achievement.achievement}
                      </p>
                    )}
                    {achievement.howAchieved && (
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        Как достигнуто: {achievement.howAchieved}
                      </p>
                    )}
                    {achievement.whoHelped && (
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        Кто помог: {achievement.whoHelped}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Испытания */}
          {report.pastYear.challenges && report.pastYear.challenges.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                💪 Испытания
              </h3>
              {report.pastYear.challenges.map((challenge, index) => (
                <div key={index} className="wizard-card" style={{ marginBottom: '12px' }}>
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">Испытание {index + 1}</div>
                    {challenge.challenge && (
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        {challenge.challenge}
                      </p>
                    )}
                    {challenge.whoHelped && (
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        Кто помог: {challenge.whoHelped}
                      </p>
                    )}
                    {challenge.whatLearned && (
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        Что узнал(а): {challenge.whatLearned}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Прощение */}
          {report.pastYear.forgiveness && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                🙏 Прощение
              </h3>
              <div className="wizard-card">
                <div className="wizard-card-content">
                  <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap' }}>
                    {report.pastYear.forgiveness}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Итоги */}
          {report.pastYear.summary && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                📖 Итоги года
              </h3>
              {report.pastYear.summary.threeWords && report.pastYear.summary.threeWords.some(w => w) && (
                <div className="wizard-card" style={{ marginBottom: '12px' }}>
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">Прошедший год в трёх словах</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px', fontSize: '16px', fontWeight: '600' }}>
                      {report.pastYear.summary.threeWords.filter(w => w).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {report.pastYear.summary.bookTitle && (
                <div className="wizard-card" style={{ marginBottom: '12px' }}>
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">Книга моего прошлого года</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px', fontSize: '16px', fontWeight: '600' }}>
                      {report.pastYear.summary.bookTitle}
                    </p>
                  </div>
                </div>
              )}
              {report.pastYear.summary.goodbye && (
                <div className="wizard-card">
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">До свидания, прошлый год!</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                      {report.pastYear.summary.goodbye}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Будущий год */}
        <section id="future-year" style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🌟 Будущий год
          </h2>

          {/* Мечты */}
          {report.futureYear.dreams && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Мечты
              </h3>
              <div className="wizard-card">
                <div className="wizard-card-content">
                  <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap' }}>
                    {report.futureYear.dreams}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Сферы жизни (будущее) */}
          {report.futureYear.lifeAreas && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Цели по сферам жизни
              </h3>
              <LifeAreaCard icon="👨‍👩‍👧‍👦" title="Личная жизнь, семья" content={report.futureYear.lifeAreas.personal} />
              <LifeAreaCard icon="👥" title="Друзья, сообщество" content={report.futureYear.lifeAreas.friends} />
              <LifeAreaCard icon="💪" title="Физическое здоровье, спорт" content={report.futureYear.lifeAreas.health} />
              <LifeAreaCard icon="🔥" title="Привычки" content={report.futureYear.lifeAreas.habits} />
              <LifeAreaCard icon="💼" title="Карьера, обучение" content={report.futureYear.lifeAreas.career} />
              <LifeAreaCard icon="🎨" title="Отдых, хобби, творчество" content={report.futureYear.lifeAreas.hobbies} />
              <LifeAreaCard icon="🧠" title="Психология, самопознание" content={report.futureYear.lifeAreas.psychology} />
              <LifeAreaCard icon="🌍" title="Лучшее завтра" content={report.futureYear.lifeAreas.betterTomorrow} />
            </div>
          )}

          {/* Планы на год - часть 1 */}
          {report.futureYear.magicTriples1 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Планы на год
              </h3>
              {report.futureYear.magicTriples1.love && report.futureYear.magicTriples1.love.some(v => v) && (
                <div className="wizard-card" style={{ marginBottom: '12px' }}>
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">❤️ Эти три вещи я буду любить в себе</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {report.futureYear.magicTriples1.love.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {report.futureYear.magicTriples1.letGo && report.futureYear.magicTriples1.letGo.some(v => v) && (
                <div className="wizard-card" style={{ marginBottom: '12px' }}>
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">🕊️ Эти три вещи я готов(а) отпустить</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {report.futureYear.magicTriples1.letGo.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {report.futureYear.magicTriples1.achieve && report.futureYear.magicTriples1.achieve.some(v => v) && (
                <div className="wizard-card" style={{ marginBottom: '12px' }}>
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">🎯 Три вещи, которых я хочу добиться больше всего</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {report.futureYear.magicTriples1.achieve.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {report.futureYear.magicTriples1.support && report.futureYear.magicTriples1.support.some(v => v) && (
                <div className="wizard-card" style={{ marginBottom: '12px' }}>
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">🤝 Эти три человека будут моей опорой</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {report.futureYear.magicTriples1.support.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {report.futureYear.magicTriples1.try && report.futureYear.magicTriples1.try.some(v => v) && (
                <div className="wizard-card" style={{ marginBottom: '12px' }}>
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">🚀 Эти три вещи я решусь попробовать</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {report.futureYear.magicTriples1.try.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {report.futureYear.magicTriples1.sayNo && report.futureYear.magicTriples1.sayNo.some(v => v) && (
                <div className="wizard-card" style={{ marginBottom: '12px' }}>
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">✋ Этим трём вещам я готов(а) сказать "нет"</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {report.futureYear.magicTriples1.sayNo.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Планы на год - часть 2 */}
          {report.futureYear.magicTriples2 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Планы на год - часть 2
              </h3>
              {report.futureYear.magicTriples2.coziness && report.futureYear.magicTriples2.coziness.some(v => v) && (
                <div className="wizard-card" style={{ marginBottom: '12px' }}>
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">🏠 Этими тремя вещами я создам уют</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {report.futureYear.magicTriples2.coziness.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {report.futureYear.magicTriples2.morning && report.futureYear.magicTriples2.morning.some(v => v) && (
                <div className="wizard-card" style={{ marginBottom: '12px' }}>
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">🌅 Эти три вещи я буду делать каждое утро</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {report.futureYear.magicTriples2.morning.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {report.futureYear.magicTriples2.treat && report.futureYear.magicTriples2.treat.some(v => v) && (
                <div className="wizard-card" style={{ marginBottom: '12px' }}>
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">🎁 Три вещи, которыми я буду баловать себя</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {report.futureYear.magicTriples2.treat.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {report.futureYear.magicTriples2.places && report.futureYear.magicTriples2.places.some(v => v) && (
                <div className="wizard-card" style={{ marginBottom: '12px' }}>
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">✈️ Я побываю в этих трех местах</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {report.futureYear.magicTriples2.places.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {report.futureYear.magicTriples2.relationships && report.futureYear.magicTriples2.relationships.some(v => v) && (
                <div className="wizard-card" style={{ marginBottom: '12px' }}>
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">💕 Этими тремя способами я буду налаживать отношения</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {report.futureYear.magicTriples2.relationships.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {report.futureYear.magicTriples2.gifts && report.futureYear.magicTriples2.gifts.some(v => v) && (
                <div className="wizard-card" style={{ marginBottom: '12px' }}>
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">🎉 Этими тремя подарками я отблагодарю себя</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {report.futureYear.magicTriples2.gifts.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Пожелания */}
          {report.futureYear.wishes && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                🎋 Пожелания
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {report.futureYear.wishes.notPostpone && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">⏰ В этом году я не буду откладывать в долгий ящик...</div>
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        {report.futureYear.wishes.notPostpone}
                      </p>
                    </div>
                  </div>
                )}
                {report.futureYear.wishes.energyFrom && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">⚡ В этом году я буду черпать энергию из...</div>
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        {report.futureYear.wishes.energyFrom}
                      </p>
                    </div>
                  </div>
                )}
                {report.futureYear.wishes.bravestWhen && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">🦁 В этом году я буду самым храбрым, когда...</div>
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        {report.futureYear.wishes.bravestWhen}
                      </p>
                    </div>
                  </div>
                )}
                {report.futureYear.wishes.sayYesWhen && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">✅ В этом году я скажу "да", когда...</div>
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        {report.futureYear.wishes.sayYesWhen}
                      </p>
                    </div>
                  </div>
                )}
                {report.futureYear.wishes.advice && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">💡 В этом году я советую себе...</div>
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        {report.futureYear.wishes.advice}
                      </p>
                    </div>
                  </div>
                )}
                {report.futureYear.wishes.specialBecause && (
                  <div className="wizard-card">
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">🌟 Этот год будет для меня особенным, потому что...</div>
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        {report.futureYear.wishes.specialBecause}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Слово года */}
          {report.futureYear.wordOfYear && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                🔤 Слово года
              </h3>
              <div className="wizard-card">
                <div className="wizard-card-content">
                  <p className="wizard-card-description" style={{ fontSize: '24px', fontWeight: '600', textAlign: 'center' }}>
                    {report.futureYear.wordOfYear}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Секретное желание */}
          {report.futureYear.secretWish && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                🔮 Секретное желание
              </h3>
              <div className="wizard-card">
                <div className="wizard-card-content">
                  <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap' }}>
                    {report.futureYear.secretWish}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
