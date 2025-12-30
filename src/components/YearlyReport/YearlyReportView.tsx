import { useRef, useState, useEffect } from 'react';
import { type YearlyReport } from '../../utils/storage';
import LifeAreaCard from './LifeAreaCard';
import EditFieldModal from './EditFieldModal';

interface YearlyReportViewProps {
  report: YearlyReport;
  onClose: () => void;
  onUpdate: (updatedReport: YearlyReport) => Promise<void>;
}

interface EditingField {
  path: string[];
  title: string;
  value: string;
  multiline?: boolean;
  isArray?: boolean;
}

export default function YearlyReportView({ report, onClose, onUpdate }: YearlyReportViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [localReport, setLocalReport] = useState<YearlyReport>(report);

  useEffect(() => {
    setLocalReport(report);
  }, [report]);

  const handleFieldClick = (path: string[], title: string, value: string, multiline: boolean = true, isArray: boolean = false) => {
    setEditingField({ path, title, value: value || '', multiline, isArray });
  };

  const handleSaveField = async (newValue: string) => {
    if (!editingField) return;

    const updatedReport = { ...localReport };
    let current: any = updatedReport;

    // Навигация по пути и обновление значения
    for (let i = 0; i < editingField.path.length - 1; i++) {
      const key = editingField.path[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }

    const lastKey = editingField.path[editingField.path.length - 1];
    
    // Если это массив (magicTriples, threeWords, threePeopleInfluenced), разбиваем строку на массив
    if (editingField.isArray) {
      // Пробуем разные разделители
      const separators = [' • ', ', ', ','];
      let values: string[] = [];
      for (const sep of separators) {
        if (newValue.includes(sep)) {
          values = newValue.split(sep).map(v => v.trim()).filter(v => v);
          break;
        }
      }
      if (values.length === 0) {
        values = newValue.split(/\s+/).filter(v => v.trim());
      }
      current[lastKey] = values;
    } else {
      current[lastKey] = newValue;
    }

    updatedReport.updatedAt = Date.now();
    setLocalReport(updatedReport);
    await onUpdate(updatedReport);
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

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
          Отчет за {localReport.year}
        </h2>
      </div>
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px'
        }}
      >
        {editingField && (
          <EditFieldModal
            title={editingField.title}
            value={editingField.value}
            multiline={editingField.multiline}
            onSave={handleSaveField}
            onCancel={handleCancelEdit}
          />
        )}
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
          {localReport.pastYear.calendarEvents && localReport.pastYear.calendarEvents.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Важные события
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {localReport.pastYear.calendarEvents.map((event, index) => (
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
          {localReport.pastYear.lifeAreas && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Сферы жизни
              </h3>
              <LifeAreaCard 
                icon="👨‍👩‍👧‍👦" 
                title="Личная жизнь, семья" 
                content={localReport.pastYear.lifeAreas.personal}
                onClick={() => handleFieldClick(['pastYear', 'lifeAreas', 'personal'], 'Личная жизнь, семья', localReport.pastYear.lifeAreas?.personal || '')}
              />
              <LifeAreaCard 
                icon="👥" 
                title="Друзья, сообщество" 
                content={localReport.pastYear.lifeAreas.friends}
                onClick={() => handleFieldClick(['pastYear', 'lifeAreas', 'friends'], 'Друзья, сообщество', localReport.pastYear.lifeAreas?.friends || '')}
              />
              <LifeAreaCard 
                icon="💪" 
                title="Физическое здоровье, спорт" 
                content={localReport.pastYear.lifeAreas.health}
                onClick={() => handleFieldClick(['pastYear', 'lifeAreas', 'health'], 'Физическое здоровье, спорт', localReport.pastYear.lifeAreas?.health || '')}
              />
              <LifeAreaCard 
                icon="🔥" 
                title="Привычки" 
                content={localReport.pastYear.lifeAreas.habits}
                onClick={() => handleFieldClick(['pastYear', 'lifeAreas', 'habits'], 'Привычки', localReport.pastYear.lifeAreas?.habits || '')}
              />
              <LifeAreaCard 
                icon="💼" 
                title="Карьера, обучение" 
                content={localReport.pastYear.lifeAreas.career}
                onClick={() => handleFieldClick(['pastYear', 'lifeAreas', 'career'], 'Карьера, обучение', localReport.pastYear.lifeAreas?.career || '')}
              />
              <LifeAreaCard 
                icon="🎨" 
                title="Отдых, хобби, творчество" 
                content={localReport.pastYear.lifeAreas.hobbies}
                onClick={() => handleFieldClick(['pastYear', 'lifeAreas', 'hobbies'], 'Отдых, хобби, творчество', localReport.pastYear.lifeAreas?.hobbies || '')}
              />
              <LifeAreaCard 
                icon="🧠" 
                title="Психология, самопознание" 
                content={localReport.pastYear.lifeAreas.psychology}
                onClick={() => handleFieldClick(['pastYear', 'lifeAreas', 'psychology'], 'Психология, самопознание', localReport.pastYear.lifeAreas?.psychology || '')}
              />
              <LifeAreaCard 
                icon="🌍" 
                title="Лучшее завтра" 
                content={localReport.pastYear.lifeAreas.betterTomorrow}
                onClick={() => handleFieldClick(['pastYear', 'lifeAreas', 'betterTomorrow'], 'Лучшее завтра', localReport.pastYear.lifeAreas?.betterTomorrow || '')}
              />
            </div>
          )}

          {/* Важные моменты */}
          {localReport.pastYear.importantMoments && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Важные моменты
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {localReport.pastYear.importantMoments.wisestDecision && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['pastYear', 'importantMoments', 'wisestDecision'], '🧠 Самое мудрое решение', localReport.pastYear.importantMoments?.wisestDecision || '')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">🧠 Самое мудрое решение</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {localReport.pastYear.importantMoments.wisestDecision}
                      </p>
                    </div>
                  </div>
                )}
                {localReport.pastYear.importantMoments.biggestLesson && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['pastYear', 'importantMoments', 'biggestLesson'], '📚 Самый большой урок', localReport.pastYear.importantMoments?.biggestLesson || '')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">📚 Самый большой урок</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {localReport.pastYear.importantMoments.biggestLesson}
                      </p>
                    </div>
                  </div>
                )}
                {localReport.pastYear.importantMoments.biggestRisk && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['pastYear', 'importantMoments', 'biggestRisk'], '🎲 Самый крупный риск', localReport.pastYear.importantMoments?.biggestRisk || '')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">🎲 Самый крупный риск</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {localReport.pastYear.importantMoments.biggestRisk}
                      </p>
                    </div>
                  </div>
                )}
                {localReport.pastYear.importantMoments.biggestSurprise && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['pastYear', 'importantMoments', 'biggestSurprise'], '🎁 Самый большой сюрприз', localReport.pastYear.importantMoments?.biggestSurprise || '')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">🎁 Самый большой сюрприз</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {localReport.pastYear.importantMoments.biggestSurprise}
                      </p>
                    </div>
                  </div>
                )}
                {localReport.pastYear.importantMoments.importantForOthers && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['pastYear', 'importantMoments', 'importantForOthers'], '❤️ Самая важная вещь для других', localReport.pastYear.importantMoments?.importantForOthers || '')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">❤️ Самая важная вещь для других</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {localReport.pastYear.importantMoments.importantForOthers}
                      </p>
                    </div>
                  </div>
                )}
                {localReport.pastYear.importantMoments.biggestCompletion && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['pastYear', 'importantMoments', 'biggestCompletion'], '✅ Самое большое дело', localReport.pastYear.importantMoments?.biggestCompletion || '')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">✅ Самое большое дело</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {localReport.pastYear.importantMoments.biggestCompletion}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Вопросы */}
          {localReport.pastYear.questions && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Вопросы о прошедшем годе
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {localReport.pastYear.questions.proudOf && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['pastYear', 'questions', 'proudOf'], 'Чем ты гордишься больше всего?', localReport.pastYear.questions?.proudOf || '')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">Чем ты гордишься больше всего?</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {localReport.pastYear.questions.proudOf}
                      </p>
                    </div>
                  </div>
                )}
                {localReport.pastYear.questions.threePeopleInfluenced && localReport.pastYear.questions.threePeopleInfluenced.some(p => p) && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['pastYear', 'questions', 'threePeopleInfluenced'], 'Какие три человека оказали на тебя наибольшее влияние?', localReport.pastYear.questions?.threePeopleInfluenced?.filter(p => p).join(', ') || '', false, true)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">Какие три человека оказали на тебя наибольшее влияние?</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {localReport.pastYear.questions.threePeopleInfluenced.filter(p => p).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
                {localReport.pastYear.questions.threePeopleInfluencedBy && localReport.pastYear.questions.threePeopleInfluencedBy.some(p => p) && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['pastYear', 'questions', 'threePeopleInfluencedBy'], 'На каких трех людей оказывал(а) наибольшее влияние ты?', localReport.pastYear.questions?.threePeopleInfluencedBy?.filter(p => p).join(', ') || '', false, true)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">На каких трех людей оказывал(а) наибольшее влияние ты?</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {localReport.pastYear.questions.threePeopleInfluencedBy.filter(p => p).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
                {localReport.pastYear.questions.unfinished && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['pastYear', 'questions', 'unfinished'], 'Что у тебя не получилось завершить?', localReport.pastYear.questions?.unfinished || '')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">Что у тебя не получилось завершить?</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {localReport.pastYear.questions.unfinished}
                      </p>
                    </div>
                  </div>
                )}
                {localReport.pastYear.questions.bestDiscovery && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['pastYear', 'questions', 'bestDiscovery'], 'Самое лучшее, что ты открыл(а) в себе?', localReport.pastYear.questions?.bestDiscovery || '')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">Самое лучшее, что ты открыл(а) в себе?</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {localReport.pastYear.questions.bestDiscovery}
                      </p>
                    </div>
                  </div>
                )}
                {localReport.pastYear.questions.mostGrateful && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['pastYear', 'questions', 'mostGrateful'], 'За что ты больше всего благодарен(а)?', localReport.pastYear.questions?.mostGrateful || '')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">За что ты больше всего благодарен(а)?</div>
                      <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                        {localReport.pastYear.questions.mostGrateful}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Лучшие моменты */}
          {localReport.pastYear.bestMoments && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                ✨ Лучшие моменты
              </h3>
              <div 
                className="wizard-card"
                onClick={() => handleFieldClick(['pastYear', 'bestMoments'], '✨ Лучшие моменты', localReport.pastYear.bestMoments || '')}
                style={{ cursor: 'pointer' }}
              >
                <div className="wizard-card-content">
                  <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap' }}>
                    {localReport.pastYear.bestMoments}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Достижения */}
          {localReport.pastYear.achievements && localReport.pastYear.achievements.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                🏆 Достижения
              </h3>
              {localReport.pastYear.achievements.map((achievement, index) => (
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
          {localReport.pastYear.challenges && localReport.pastYear.challenges.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                💪 Испытания
              </h3>
              {localReport.pastYear.challenges.map((challenge, index) => (
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
          {localReport.pastYear.forgiveness && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                🙏 Прощение
              </h3>
              <div 
                className="wizard-card"
                onClick={() => handleFieldClick(['pastYear', 'forgiveness'], '🙏 Прощение', localReport.pastYear.forgiveness || '')}
                style={{ cursor: 'pointer' }}
              >
                <div className="wizard-card-content">
                  <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap' }}>
                    {localReport.pastYear.forgiveness}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Итоги */}
          {localReport.pastYear.summary && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                📖 Итоги года
              </h3>
              {localReport.pastYear.summary.threeWords && localReport.pastYear.summary.threeWords.some(w => w) && (
                <div 
                  className="wizard-card" 
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => handleFieldClick(['pastYear', 'summary', 'threeWords'], 'Прошедший год в трёх словах', localReport.pastYear.summary?.threeWords?.filter(w => w).join(' • ') || '', false, true)}
                >
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">Прошедший год в трёх словах</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px', fontSize: '16px', fontWeight: '600' }}>
                      {localReport.pastYear.summary.threeWords.filter(w => w).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {localReport.pastYear.summary.bookTitle && (
                <div 
                  className="wizard-card" 
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => handleFieldClick(['pastYear', 'summary', 'bookTitle'], 'Книга моего прошлого года', localReport.pastYear.summary?.bookTitle || '', false)}
                >
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">Книга моего прошлого года</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px', fontSize: '16px', fontWeight: '600' }}>
                      {localReport.pastYear.summary.bookTitle}
                    </p>
                  </div>
                </div>
              )}
              {localReport.pastYear.summary.goodbye && (
                <div 
                  className="wizard-card"
                  onClick={() => handleFieldClick(['pastYear', 'summary', 'goodbye'], 'До свидания, прошлый год!', localReport.pastYear.summary?.goodbye || '')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">До свидания, прошлый год!</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                      {localReport.pastYear.summary.goodbye}
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
          {localReport.futureYear.dreams && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Мечты
              </h3>
              <div 
                className="wizard-card"
                onClick={() => handleFieldClick(['futureYear', 'dreams'], 'Мечты', localReport.futureYear.dreams || '')}
                style={{ cursor: 'pointer' }}
              >
                <div className="wizard-card-content">
                  <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap' }}>
                    {localReport.futureYear.dreams}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Сферы жизни (будущее) */}
          {localReport.futureYear.lifeAreas && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Цели по сферам жизни
              </h3>
              <LifeAreaCard 
                icon="👨‍👩‍👧‍👦" 
                title="Личная жизнь, семья" 
                content={localReport.futureYear.lifeAreas.personal}
                onClick={() => handleFieldClick(['futureYear', 'lifeAreas', 'personal'], 'Личная жизнь, семья', localReport.futureYear.lifeAreas?.personal || '')}
              />
              <LifeAreaCard 
                icon="👥" 
                title="Друзья, сообщество" 
                content={localReport.futureYear.lifeAreas.friends}
                onClick={() => handleFieldClick(['futureYear', 'lifeAreas', 'friends'], 'Друзья, сообщество', localReport.futureYear.lifeAreas?.friends || '')}
              />
              <LifeAreaCard 
                icon="💪" 
                title="Физическое здоровье, спорт" 
                content={localReport.futureYear.lifeAreas.health}
                onClick={() => handleFieldClick(['futureYear', 'lifeAreas', 'health'], 'Физическое здоровье, спорт', localReport.futureYear.lifeAreas?.health || '')}
              />
              <LifeAreaCard 
                icon="🔥" 
                title="Привычки" 
                content={localReport.futureYear.lifeAreas.habits}
                onClick={() => handleFieldClick(['futureYear', 'lifeAreas', 'habits'], 'Привычки', localReport.futureYear.lifeAreas?.habits || '')}
              />
              <LifeAreaCard 
                icon="💼" 
                title="Карьера, обучение" 
                content={localReport.futureYear.lifeAreas.career}
                onClick={() => handleFieldClick(['futureYear', 'lifeAreas', 'career'], 'Карьера, обучение', localReport.futureYear.lifeAreas?.career || '')}
              />
              <LifeAreaCard 
                icon="🎨" 
                title="Отдых, хобби, творчество" 
                content={localReport.futureYear.lifeAreas.hobbies}
                onClick={() => handleFieldClick(['futureYear', 'lifeAreas', 'hobbies'], 'Отдых, хобби, творчество', localReport.futureYear.lifeAreas?.hobbies || '')}
              />
              <LifeAreaCard 
                icon="🧠" 
                title="Психология, самопознание" 
                content={localReport.futureYear.lifeAreas.psychology}
                onClick={() => handleFieldClick(['futureYear', 'lifeAreas', 'psychology'], 'Психология, самопознание', localReport.futureYear.lifeAreas?.psychology || '')}
              />
              <LifeAreaCard 
                icon="🌍" 
                title="Лучшее завтра" 
                content={localReport.futureYear.lifeAreas.betterTomorrow}
                onClick={() => handleFieldClick(['futureYear', 'lifeAreas', 'betterTomorrow'], 'Лучшее завтра', localReport.futureYear.lifeAreas?.betterTomorrow || '')}
              />
            </div>
          )}

          {/* Планы на год - часть 1 */}
          {localReport.futureYear.magicTriples1 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Планы на год
              </h3>
              {localReport.futureYear.magicTriples1.love && localReport.futureYear.magicTriples1.love.some(v => v) && (
                <div 
                  className="wizard-card" 
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => handleFieldClick(['futureYear', 'magicTriples1', 'love'], '❤️ Эти три вещи я буду любить в себе', localReport.futureYear.magicTriples1?.love?.filter(v => v).join(' • ') || '', false, true)}
                >
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">❤️ Эти три вещи я буду любить в себе</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {localReport.futureYear.magicTriples1.love.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {localReport.futureYear.magicTriples1.letGo && localReport.futureYear.magicTriples1.letGo.some(v => v) && (
                <div 
                  className="wizard-card" 
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => handleFieldClick(['futureYear', 'magicTriples1', 'letGo'], '🕊️ Эти три вещи я готов(а) отпустить', localReport.futureYear.magicTriples1?.letGo?.filter(v => v).join(' • ') || '', false, true)}
                >
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">🕊️ Эти три вещи я готов(а) отпустить</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {localReport.futureYear.magicTriples1.letGo.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {localReport.futureYear.magicTriples1.achieve && localReport.futureYear.magicTriples1.achieve.some(v => v) && (
                <div 
                  className="wizard-card" 
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => handleFieldClick(['futureYear', 'magicTriples1', 'achieve'], '🎯 Три вещи, которых я хочу добиться больше всего', localReport.futureYear.magicTriples1?.achieve?.filter(v => v).join(' • ') || '', false, true)}
                >
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">🎯 Три вещи, которых я хочу добиться больше всего</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {localReport.futureYear.magicTriples1.achieve.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {localReport.futureYear.magicTriples1.support && localReport.futureYear.magicTriples1.support.some(v => v) && (
                <div 
                  className="wizard-card" 
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => handleFieldClick(['futureYear', 'magicTriples1', 'support'], '🤝 Эти три человека будут моей опорой', localReport.futureYear.magicTriples1?.support?.filter(v => v).join(' • ') || '', false, true)}
                >
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">🤝 Эти три человека будут моей опорой</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {localReport.futureYear.magicTriples1.support.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {localReport.futureYear.magicTriples1.try && localReport.futureYear.magicTriples1.try.some(v => v) && (
                <div 
                  className="wizard-card" 
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => handleFieldClick(['futureYear', 'magicTriples1', 'try'], '🚀 Эти три вещи я решусь попробовать', localReport.futureYear.magicTriples1?.try?.filter(v => v).join(' • ') || '', false, true)}
                >
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">🚀 Эти три вещи я решусь попробовать</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {localReport.futureYear.magicTriples1.try.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {localReport.futureYear.magicTriples1.sayNo && localReport.futureYear.magicTriples1.sayNo.some(v => v) && (
                <div 
                  className="wizard-card" 
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => handleFieldClick(['futureYear', 'magicTriples1', 'sayNo'], '✋ Этим трём вещам я готов(а) сказать "нет"', localReport.futureYear.magicTriples1?.sayNo?.filter(v => v).join(' • ') || '', false, true)}
                >
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">✋ Этим трём вещам я готов(а) сказать "нет"</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {localReport.futureYear.magicTriples1.sayNo.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Планы на год - часть 2 */}
          {localReport.futureYear.magicTriples2 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                Планы на год - часть 2
              </h3>
              {localReport.futureYear.magicTriples2.coziness && localReport.futureYear.magicTriples2.coziness.some(v => v) && (
                <div 
                  className="wizard-card" 
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => handleFieldClick(['futureYear', 'magicTriples2', 'coziness'], '🏠 Этими тремя вещами я создам уют', localReport.futureYear.magicTriples2?.coziness?.filter(v => v).join(' • ') || '', false, true)}
                >
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">🏠 Этими тремя вещами я создам уют</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {localReport.futureYear.magicTriples2.coziness.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {localReport.futureYear.magicTriples2.morning && localReport.futureYear.magicTriples2.morning.some(v => v) && (
                <div 
                  className="wizard-card" 
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => handleFieldClick(['futureYear', 'magicTriples2', 'morning'], '🌅 Эти три вещи я буду делать каждое утро', localReport.futureYear.magicTriples2?.morning?.filter(v => v).join(' • ') || '', false, true)}
                >
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">🌅 Эти три вещи я буду делать каждое утро</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {localReport.futureYear.magicTriples2.morning.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {localReport.futureYear.magicTriples2.treat && localReport.futureYear.magicTriples2.treat.some(v => v) && (
                <div 
                  className="wizard-card" 
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => handleFieldClick(['futureYear', 'magicTriples2', 'treat'], '🎁 Три вещи, которыми я буду баловать себя', localReport.futureYear.magicTriples2?.treat?.filter(v => v).join(' • ') || '', false, true)}
                >
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">🎁 Три вещи, которыми я буду баловать себя</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {localReport.futureYear.magicTriples2.treat.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {localReport.futureYear.magicTriples2.places && localReport.futureYear.magicTriples2.places.some(v => v) && (
                <div 
                  className="wizard-card" 
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => handleFieldClick(['futureYear', 'magicTriples2', 'places'], '✈️ Я побываю в этих трех местах', localReport.futureYear.magicTriples2?.places?.filter(v => v).join(' • ') || '', false, true)}
                >
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">✈️ Я побываю в этих трех местах</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {localReport.futureYear.magicTriples2.places.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {localReport.futureYear.magicTriples2.relationships && localReport.futureYear.magicTriples2.relationships.some(v => v) && (
                <div 
                  className="wizard-card" 
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => handleFieldClick(['futureYear', 'magicTriples2', 'relationships'], '💕 Этими тремя способами я буду налаживать отношения', localReport.futureYear.magicTriples2?.relationships?.filter(v => v).join(' • ') || '', false, true)}
                >
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">💕 Этими тремя способами я буду налаживать отношения</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {localReport.futureYear.magicTriples2.relationships.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
              {localReport.futureYear.magicTriples2.gifts && localReport.futureYear.magicTriples2.gifts.some(v => v) && (
                <div 
                  className="wizard-card" 
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => handleFieldClick(['futureYear', 'magicTriples2', 'gifts'], '🎉 Этими тремя подарками я отблагодарю себя', localReport.futureYear.magicTriples2?.gifts?.filter(v => v).join(' • ') || '', false, true)}
                >
                  <div className="wizard-card-content">
                    <div className="wizard-card-title">🎉 Этими тремя подарками я отблагодарю себя</div>
                    <p className="wizard-card-description" style={{ marginTop: '8px' }}>
                      {localReport.futureYear.magicTriples2.gifts.filter(v => v).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Пожелания */}
          {localReport.futureYear.wishes && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                🎋 Пожелания
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {localReport.futureYear.wishes.notPostpone && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['futureYear', 'wishes', 'notPostpone'], '⏰ В этом году я не буду откладывать в долгий ящик...', localReport.futureYear.wishes?.notPostpone || '')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">⏰ В этом году я не буду откладывать в долгий ящик...</div>
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        {localReport.futureYear.wishes.notPostpone}
                      </p>
                    </div>
                  </div>
                )}
                {localReport.futureYear.wishes.energyFrom && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['futureYear', 'wishes', 'energyFrom'], '⚡ В этом году я буду черпать энергию из...', localReport.futureYear.wishes?.energyFrom || '')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">⚡ В этом году я буду черпать энергию из...</div>
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        {localReport.futureYear.wishes.energyFrom}
                      </p>
                    </div>
                  </div>
                )}
                {localReport.futureYear.wishes.bravestWhen && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['futureYear', 'wishes', 'bravestWhen'], '🦁 В этом году я буду самым храбрым, когда...', localReport.futureYear.wishes?.bravestWhen || '')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">🦁 В этом году я буду самым храбрым, когда...</div>
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        {localReport.futureYear.wishes.bravestWhen}
                      </p>
                    </div>
                  </div>
                )}
                {localReport.futureYear.wishes.sayYesWhen && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['futureYear', 'wishes', 'sayYesWhen'], '✅ В этом году я скажу "да", когда...', localReport.futureYear.wishes?.sayYesWhen || '')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">✅ В этом году я скажу "да", когда...</div>
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        {localReport.futureYear.wishes.sayYesWhen}
                      </p>
                    </div>
                  </div>
                )}
                {localReport.futureYear.wishes.advice && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['futureYear', 'wishes', 'advice'], '💡 В этом году я советую себе...', localReport.futureYear.wishes?.advice || '')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">💡 В этом году я советую себе...</div>
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        {localReport.futureYear.wishes.advice}
                      </p>
                    </div>
                  </div>
                )}
                {localReport.futureYear.wishes.specialBecause && (
                  <div 
                    className="wizard-card"
                    onClick={() => handleFieldClick(['futureYear', 'wishes', 'specialBecause'], '🌟 Этот год будет для меня особенным, потому что...', localReport.futureYear.wishes?.specialBecause || '')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wizard-card-content">
                      <div className="wizard-card-title">🌟 Этот год будет для меня особенным, потому что...</div>
                      <p className="wizard-card-description" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        {localReport.futureYear.wishes.specialBecause}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Слово года */}
          {localReport.futureYear.wordOfYear && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                🔤 Слово года
              </h3>
              <div 
                className="wizard-card"
                onClick={() => handleFieldClick(['futureYear', 'wordOfYear'], '🔤 Слово года', localReport.futureYear.wordOfYear || '', false)}
                style={{ cursor: 'pointer' }}
              >
                <div className="wizard-card-content">
                  <p className="wizard-card-description" style={{ fontSize: '24px', fontWeight: '600', textAlign: 'center' }}>
                    {localReport.futureYear.wordOfYear}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Секретное желание */}
          {localReport.futureYear.secretWish && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                🔮 Секретное желание
              </h3>
              <div 
                className="wizard-card"
                onClick={() => handleFieldClick(['futureYear', 'secretWish'], '🔮 Секретное желание', localReport.futureYear.secretWish || '')}
                style={{ cursor: 'pointer' }}
              >
                <div className="wizard-card-content">
                  <p className="wizard-card-description" style={{ whiteSpace: 'pre-wrap' }}>
                    {localReport.futureYear.secretWish}
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
