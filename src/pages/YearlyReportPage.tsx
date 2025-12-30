import { useState } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import { generateId, type YearlyReport, type PastYearData, type FutureYearData } from '../utils/storage';
import { useOnboarding } from '../hooks/useOnboarding';
import LottieAnimation from '../components/LottieAnimation';
import WizardContainer from '../components/Wizard/WizardContainer';
import { sectionColors } from '../utils/sectionColors';
import Step1Welcome from '../components/YearlyReport/CreateReport/Step1Welcome';
import Step2Calendar from '../components/YearlyReport/CreateReport/Step2Calendar';
import Step3LifeAreas from '../components/YearlyReport/CreateReport/Step3LifeAreas';
import Step4ImportantMoments from '../components/YearlyReport/CreateReport/Step4ImportantMoments';
import Step5Questions from '../components/YearlyReport/CreateReport/Step5Questions';
import Step6BestMoments from '../components/YearlyReport/CreateReport/Step6BestMoments';
import Step7Achievements from '../components/YearlyReport/CreateReport/Step7Achievements';
import Step8Challenges from '../components/YearlyReport/CreateReport/Step8Challenges';
import Step9Forgiveness from '../components/YearlyReport/CreateReport/Step9Forgiveness';
import Step10Summary from '../components/YearlyReport/CreateReport/Step10Summary';
import Step11Dreams from '../components/YearlyReport/CreateReport/Step11Dreams';
import Step12FutureGoals from '../components/YearlyReport/CreateReport/Step12FutureGoals';
import Step13MagicTriples1 from '../components/YearlyReport/CreateReport/Step13MagicTriples1';
import Step14MagicTriples2 from '../components/YearlyReport/CreateReport/Step14MagicTriples2';
import Step15Wishes from '../components/YearlyReport/CreateReport/Step15Wishes';
import Step16WordOfYear from '../components/YearlyReport/CreateReport/Step16WordOfYear';
import Step17SecretWish from '../components/YearlyReport/CreateReport/Step17SecretWish';
import Step18Final from '../components/YearlyReport/CreateReport/Step18Final';

interface YearlyReportPageProps {
  storage: ReturnType<typeof useCloudStorage>;
}

export default function YearlyReportPage({ storage }: YearlyReportPageProps) {
  const { shouldShow: showOnboarding, handleClose: closeOnboarding } = useOnboarding('yearly-report');
  const [isCreating, setIsCreating] = useState(false);
  const [editingReport, setEditingReport] = useState<YearlyReport | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [reportData, setReportData] = useState<{ pastYear: PastYearData; futureYear: FutureYearData }>({
    pastYear: {},
    futureYear: {}
  });
  const currentYear = new Date().getFullYear();

  const handleCreateNew = () => {
    const existingReport = storage.yearlyReports.find(r => r.year === currentYear);
    if (existingReport) {
      setEditingReport(existingReport);
      setReportData({
        pastYear: existingReport.pastYear || {},
        futureYear: existingReport.futureYear || {}
      });
    } else {
      const newReport: YearlyReport = {
        id: generateId(),
        year: currentYear,
        pastYear: {},
        futureYear: {},
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setEditingReport(newReport);
      setReportData({ pastYear: {}, futureYear: {} });
    }
    setCurrentStep(0);
    setIsCreating(true);
  };

  const handleEdit = (report: YearlyReport) => {
    setEditingReport(report);
    setReportData({
      pastYear: report.pastYear || {},
      futureYear: report.futureYear || {}
    });
    setCurrentStep(0);
    setIsCreating(true);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setIsCreating(false);
      setEditingReport(null);
      setReportData({ pastYear: {}, futureYear: {} });
    }
  };

  const handleStepComplete = async () => {
    if (!editingReport) return;
    
    const updatedReport: YearlyReport = {
      ...editingReport,
      pastYear: reportData.pastYear,
      futureYear: reportData.futureYear,
      updatedAt: Date.now()
    };

    const existingIndex = storage.yearlyReports.findIndex(r => r.id === updatedReport.id);
    if (existingIndex >= 0) {
      await storage.updateYearlyReport(updatedReport.id, updatedReport);
    } else {
      await storage.addYearlyReport(updatedReport);
    }
    setIsCreating(false);
    setEditingReport(null);
    setReportData({ pastYear: {}, futureYear: {} });
    setCurrentStep(0);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот отчет?')) {
      await storage.deleteYearlyReport(id);
    }
  };

  if (showOnboarding) {
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
        <div style={{ width: '200px', height: '200px', marginBottom: '24px' }}>
          <LottieAnimation loop={true} autoplay={true} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
          Годовой отчет
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: 'var(--tg-theme-hint-color)',
          marginBottom: '32px',
          maxWidth: '300px'
        }}>
          Проанализируйте прошедший год и спланируйте следующий с помощью YearCompass.
        </p>
        <button className="tg-button" onClick={closeOnboarding}>
          Понятно
        </button>
      </div>
    );
  }

  if (isCreating && editingReport) {
    const colors = sectionColors['yearly-report'];
    const totalSteps = 18;

    return (
      <WizardContainer 
        currentStep={currentStep + 1} 
        totalSteps={totalSteps}
        progressColor={colors.primary}
      >
        {/* Step 1: Welcome */}
        <div className={`wizard-slide ${currentStep === 0 ? 'active' : currentStep > 0 ? 'prev' : 'next'}`}>
          <Step1Welcome onNext={() => setCurrentStep(1)} />
        </div>

        {/* Step 2: Calendar */}
        {currentStep >= 1 && (
          <div className={`wizard-slide ${currentStep === 1 ? 'active' : currentStep > 1 ? 'prev' : 'next'}`}>
            <Step2Calendar
              onNext={(events) => {
                setReportData({ ...reportData, pastYear: { ...reportData.pastYear, calendarEvents: events } });
                setCurrentStep(2);
              }}
              onBack={handleBack}
              initialEvents={reportData.pastYear.calendarEvents}
            />
          </div>
        )}

        {/* Step 3: Life Areas (Past) */}
        {currentStep >= 2 && (
          <div className={`wizard-slide ${currentStep === 2 ? 'active' : currentStep > 2 ? 'prev' : 'next'}`}>
            <Step3LifeAreas
              onNext={(lifeAreas) => {
                setReportData({ ...reportData, pastYear: { ...reportData.pastYear, lifeAreas } });
                setCurrentStep(3);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.lifeAreas}
            />
          </div>
        )}

        {/* Step 4: Important Moments */}
        {currentStep >= 3 && (
          <div className={`wizard-slide ${currentStep === 3 ? 'active' : currentStep > 3 ? 'prev' : 'next'}`}>
            <Step4ImportantMoments
              onNext={(moments) => {
                setReportData({ ...reportData, pastYear: { ...reportData.pastYear, importantMoments: moments } });
                setCurrentStep(4);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.importantMoments}
            />
          </div>
        )}

        {/* Step 5: Questions */}
        {currentStep >= 4 && (
          <div className={`wizard-slide ${currentStep === 4 ? 'active' : currentStep > 4 ? 'prev' : 'next'}`}>
            <Step5Questions
              onNext={(questions) => {
                setReportData({ ...reportData, pastYear: { ...reportData.pastYear, questions } });
                setCurrentStep(5);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.questions}
            />
          </div>
        )}

        {/* Step 6: Best Moments */}
        {currentStep >= 5 && (
          <div className={`wizard-slide ${currentStep === 5 ? 'active' : currentStep > 5 ? 'prev' : 'next'}`}>
            <Step6BestMoments
              onNext={(bestMoments) => {
                setReportData({ ...reportData, pastYear: { ...reportData.pastYear, bestMoments } });
                setCurrentStep(6);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.bestMoments}
            />
          </div>
        )}

        {/* Step 7: Achievements */}
        {currentStep >= 6 && (
          <div className={`wizard-slide ${currentStep === 6 ? 'active' : currentStep > 6 ? 'prev' : 'next'}`}>
            <Step7Achievements
              onNext={(achievements) => {
                setReportData({ ...reportData, pastYear: { ...reportData.pastYear, achievements } });
                setCurrentStep(7);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.achievements}
            />
          </div>
        )}

        {/* Step 8: Challenges */}
        {currentStep >= 7 && (
          <div className={`wizard-slide ${currentStep === 7 ? 'active' : currentStep > 7 ? 'prev' : 'next'}`}>
            <Step8Challenges
              onNext={(challenges) => {
                setReportData({ ...reportData, pastYear: { ...reportData.pastYear, challenges } });
                setCurrentStep(8);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.challenges}
            />
          </div>
        )}

        {/* Step 9: Forgiveness */}
        {currentStep >= 8 && (
          <div className={`wizard-slide ${currentStep === 8 ? 'active' : currentStep > 8 ? 'prev' : 'next'}`}>
            <Step9Forgiveness
              onNext={(forgiveness) => {
                setReportData({ ...reportData, pastYear: { ...reportData.pastYear, forgiveness } });
                setCurrentStep(9);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.forgiveness}
            />
          </div>
        )}

        {/* Step 10: Summary */}
        {currentStep >= 9 && (
          <div className={`wizard-slide ${currentStep === 9 ? 'active' : currentStep > 9 ? 'prev' : 'next'}`}>
            <Step10Summary
              onNext={(summary) => {
                setReportData({ ...reportData, pastYear: { ...reportData.pastYear, summary } });
                setCurrentStep(10);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.summary}
            />
          </div>
        )}

        {/* Step 11: Dreams */}
        {currentStep >= 10 && (
          <div className={`wizard-slide ${currentStep === 10 ? 'active' : currentStep > 10 ? 'prev' : 'next'}`}>
            <Step11Dreams
              onNext={(dreams) => {
                setReportData({ ...reportData, futureYear: { ...reportData.futureYear, dreams } });
                setCurrentStep(11);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.dreams}
            />
          </div>
        )}

        {/* Step 12: Future Goals */}
        {currentStep >= 11 && (
          <div className={`wizard-slide ${currentStep === 11 ? 'active' : currentStep > 11 ? 'prev' : 'next'}`}>
            <Step12FutureGoals
              onNext={(lifeAreas) => {
                setReportData({ ...reportData, futureYear: { ...reportData.futureYear, lifeAreas } });
                setCurrentStep(12);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.lifeAreas}
            />
          </div>
        )}

        {/* Step 13: Magic Triples 1 */}
        {currentStep >= 12 && (
          <div className={`wizard-slide ${currentStep === 12 ? 'active' : currentStep > 12 ? 'prev' : 'next'}`}>
            <Step13MagicTriples1
              onNext={(triples) => {
                setReportData({ ...reportData, futureYear: { ...reportData.futureYear, magicTriples1: triples } });
                setCurrentStep(13);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.magicTriples1}
            />
          </div>
        )}

        {/* Step 14: Magic Triples 2 */}
        {currentStep >= 13 && (
          <div className={`wizard-slide ${currentStep === 13 ? 'active' : currentStep > 13 ? 'prev' : 'next'}`}>
            <Step14MagicTriples2
              onNext={(triples) => {
                setReportData({ ...reportData, futureYear: { ...reportData.futureYear, magicTriples2: triples } });
                setCurrentStep(14);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.magicTriples2}
            />
          </div>
        )}

        {/* Step 15: Wishes */}
        {currentStep >= 14 && (
          <div className={`wizard-slide ${currentStep === 14 ? 'active' : currentStep > 14 ? 'prev' : 'next'}`}>
            <Step15Wishes
              onNext={(wishes) => {
                setReportData({ ...reportData, futureYear: { ...reportData.futureYear, wishes } });
                setCurrentStep(15);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.wishes}
            />
          </div>
        )}

        {/* Step 16: Word of Year */}
        {currentStep >= 15 && (
          <div className={`wizard-slide ${currentStep === 15 ? 'active' : currentStep > 15 ? 'prev' : 'next'}`}>
            <Step16WordOfYear
              onNext={(wordOfYear) => {
                setReportData({ ...reportData, futureYear: { ...reportData.futureYear, wordOfYear } });
                setCurrentStep(16);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.wordOfYear}
            />
          </div>
        )}

        {/* Step 17: Secret Wish */}
        {currentStep >= 16 && (
          <div className={`wizard-slide ${currentStep === 16 ? 'active' : currentStep > 16 ? 'prev' : 'next'}`}>
            <Step17SecretWish
              onNext={(secretWish) => {
                setReportData({ ...reportData, futureYear: { ...reportData.futureYear, secretWish } });
                setCurrentStep(17);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.secretWish}
            />
          </div>
        )}

        {/* Step 18: Final */}
        {currentStep >= 17 && (
          <div className={`wizard-slide ${currentStep === 17 ? 'active' : currentStep > 17 ? 'prev' : 'next'}`}>
            <Step18Final
              onComplete={handleStepComplete}
              onBack={handleBack}
              year={editingReport.year}
            />
          </div>
        )}
      </WizardContainer>
    );
  }

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--tg-theme-secondary-bg-color)'
      }}>
        <button
          className="tg-button"
          onClick={handleCreateNew}
          style={{ width: '100%' }}
        >
          📅 Создать отчет за {currentYear}
        </button>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px'
      }}>
        {storage.yearlyReports.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            textAlign: 'center',
            color: 'var(--tg-theme-hint-color)'
          }}>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>
              У вас пока нет годовых отчетов
            </p>
            <p style={{ fontSize: '14px' }}>
              Создайте первый отчет, чтобы начать
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {storage.yearlyReports
              .sort((a, b) => b.year - a.year)
              .map((report) => {
                const progress = calculateProgress(report);
                return (
                  <div
                    key={report.id}
                    style={{
                      backgroundColor: 'var(--tg-theme-section-bg-color)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid var(--tg-theme-secondary-bg-color)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600'
                      }}>
                        Отчет за {report.year}
                      </h3>
                      <div style={{
                        fontSize: '14px',
                        color: 'var(--tg-theme-hint-color)'
                      }}>
                        {progress}%
                      </div>
                    </div>
                    <div style={{
                      height: '4px',
                      backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                      borderRadius: '2px',
                      marginBottom: '12px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        backgroundColor: 'var(--tg-theme-button-color)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button
                        className="tg-button"
                        onClick={() => handleEdit(report)}
                        style={{
                          flex: 1,
                          fontSize: '14px',
                          padding: '10px 16px'
                        }}
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '8px',
                          border: '1px solid var(--tg-theme-destructive-text-color)',
                          backgroundColor: 'transparent',
                          color: 'var(--tg-theme-destructive-text-color)',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

function calculateProgress(report: YearlyReport): number {
  let completed = 0;
  let total = 18; // Общее количество шагов

  // Проверяем прошлый год (10 шагов)
  if (report.pastYear.calendarEvents && report.pastYear.calendarEvents.length > 0) completed++;
  if (report.pastYear.lifeAreas) completed++;
  if (report.pastYear.importantMoments) completed++;
  if (report.pastYear.questions) completed++;
  if (report.pastYear.bestMoments) completed++;
  if (report.pastYear.achievements && report.pastYear.achievements.length > 0) completed++;
  if (report.pastYear.challenges && report.pastYear.challenges.length > 0) completed++;
  if (report.pastYear.forgiveness) completed++;
  if (report.pastYear.summary) completed++;

  // Проверяем будущий год (8 шагов)
  if (report.futureYear.dreams) completed++;
  if (report.futureYear.lifeAreas) completed++;
  if (report.futureYear.magicTriples1) completed++;
  if (report.futureYear.magicTriples2) completed++;
  if (report.futureYear.wishes) completed++;
  if (report.futureYear.wordOfYear) completed++;
  if (report.futureYear.secretWish) completed++;

  return Math.round((completed / total) * 100);
}

