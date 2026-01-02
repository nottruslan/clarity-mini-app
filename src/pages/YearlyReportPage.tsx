import { useState } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import { generateId, type YearlyReport, type PastYearData, type FutureYearData } from '../utils/storage';
import WizardContainer from '../components/Wizard/WizardContainer';
import { sectionColors } from '../utils/sectionColors';
import Step1Welcome from '../components/YearlyReport/CreateReport/Step1Welcome';
import Step2Calendar from '../components/YearlyReport/CreateReport/Step2Calendar';
import Step3PersonalLife from '../components/YearlyReport/CreateReport/Step3PersonalLife';
import Step4Friends from '../components/YearlyReport/CreateReport/Step4Friends';
import Step5Health from '../components/YearlyReport/CreateReport/Step5Health';
import Step6Habits from '../components/YearlyReport/CreateReport/Step6Habits';
import Step7Career from '../components/YearlyReport/CreateReport/Step7Career';
import Step8Hobbies from '../components/YearlyReport/CreateReport/Step8Hobbies';
import Step9Psychology from '../components/YearlyReport/CreateReport/Step9Psychology';
import Step10BetterTomorrow from '../components/YearlyReport/CreateReport/Step10BetterTomorrow';
import Step11ImportantMoments from '../components/YearlyReport/CreateReport/Step11ImportantMoments';
import Step12Questions from '../components/YearlyReport/CreateReport/Step12Questions';
import Step13BestMoments from '../components/YearlyReport/CreateReport/Step13BestMoments';
import Step14Achievements from '../components/YearlyReport/CreateReport/Step14Achievements';
import Step15Challenges from '../components/YearlyReport/CreateReport/Step15Challenges';
import Step16Forgiveness from '../components/YearlyReport/CreateReport/Step16Forgiveness';
import Step17Summary from '../components/YearlyReport/CreateReport/Step17Summary';
import Step18Dreams from '../components/YearlyReport/CreateReport/Step18Dreams';
import Step19PersonalLifeFuture from '../components/YearlyReport/CreateReport/Step19PersonalLifeFuture';
import Step20FriendsFuture from '../components/YearlyReport/CreateReport/Step20FriendsFuture';
import Step21HealthFuture from '../components/YearlyReport/CreateReport/Step21HealthFuture';
import Step22HabitsFuture from '../components/YearlyReport/CreateReport/Step22HabitsFuture';
import Step23CareerFuture from '../components/YearlyReport/CreateReport/Step23CareerFuture';
import Step24HobbiesFuture from '../components/YearlyReport/CreateReport/Step24HobbiesFuture';
import Step25PsychologyFuture from '../components/YearlyReport/CreateReport/Step25PsychologyFuture';
import Step26BetterTomorrowFuture from '../components/YearlyReport/CreateReport/Step26BetterTomorrowFuture';
import Step27MagicTriples1 from '../components/YearlyReport/CreateReport/Step27MagicTriples1';
import Step28MagicTriples2 from '../components/YearlyReport/CreateReport/Step28MagicTriples2';
import Step29Wishes from '../components/YearlyReport/CreateReport/Step29Wishes';
import Step30WordOfYear from '../components/YearlyReport/CreateReport/Step30WordOfYear';
import Step31SecretWish from '../components/YearlyReport/CreateReport/Step31SecretWish';
import Step32Final from '../components/YearlyReport/CreateReport/Step32Final';
import YearlyReportBottomSheet from '../components/YearlyReport/YearlyReportBottomSheet';
import ReportBottomSheet from '../components/YearlyReport/ReportBottomSheet';

interface YearlyReportPageProps {
  storage: ReturnType<typeof useCloudStorage>;
}

export default function YearlyReportPage({ storage }: YearlyReportPageProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [viewingReportId, setViewingReportId] = useState<string | null>(null);
  const [editingReport, setEditingReport] = useState<YearlyReport | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  const [reportData, setReportData] = useState<{ pastYear: PastYearData; futureYear: FutureYearData }>({
    pastYear: {},
    futureYear: {}
  });
  const currentYear = new Date().getFullYear();

  // Проверка состояния загрузки
  if (storage.loading) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px'
      }}>
        <p style={{ color: 'var(--tg-theme-hint-color)' }}>Загрузка...</p>
      </div>
    );
  }

  // Безопасный доступ к данным
  const yearlyReports = storage.yearlyReports ?? [];

  const handleCreateNew = () => {
    const existingReport = yearlyReports.find(r => r.year === currentYear);
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

    const existingIndex = yearlyReports.findIndex(r => r.id === updatedReport.id);
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
      setViewingReportId(null);
      setShowMenuId(null);
    }
  };

  const handleDuplicate = async (report: YearlyReport) => {
    const duplicatedReport: YearlyReport = {
      ...report,
      id: generateId(),
      year: new Date().getFullYear(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await storage.addYearlyReport(duplicatedReport);
    setShowMenuId(null);
  };

  const handleView = (report: YearlyReport) => {
    setViewingReportId(report.id);
  };

  const handleCloseView = () => {
    setViewingReportId(null);
  };


  if (isCreating && editingReport) {
    const colors = sectionColors['yearly-report'];
    const totalSteps = 32;

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

        {/* Step 3-10: Life Areas (Past) */}
        {currentStep >= 2 && (
          <div className={`wizard-slide ${currentStep === 2 ? 'active' : currentStep > 2 ? 'prev' : 'next'}`}>
            <Step3PersonalLife
              onNext={(value) => {
                setReportData({ 
                  ...reportData, 
                  pastYear: { 
                    ...reportData.pastYear, 
                    lifeAreas: { ...reportData.pastYear.lifeAreas, personal: value } 
                  } 
                });
                setCurrentStep(3);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.lifeAreas?.personal}
            />
          </div>
        )}

        {currentStep >= 3 && (
          <div className={`wizard-slide ${currentStep === 3 ? 'active' : currentStep > 3 ? 'prev' : 'next'}`}>
            <Step4Friends
              onNext={(value) => {
                setReportData({ 
                  ...reportData, 
                  pastYear: { 
                    ...reportData.pastYear, 
                    lifeAreas: { ...reportData.pastYear.lifeAreas, friends: value } 
                  } 
                });
                setCurrentStep(4);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.lifeAreas?.friends}
            />
          </div>
        )}

        {currentStep >= 4 && (
          <div className={`wizard-slide ${currentStep === 4 ? 'active' : currentStep > 4 ? 'prev' : 'next'}`}>
            <Step5Health
              onNext={(value) => {
                setReportData({ 
                  ...reportData, 
                  pastYear: { 
                    ...reportData.pastYear, 
                    lifeAreas: { ...reportData.pastYear.lifeAreas, health: value } 
                  } 
                });
                setCurrentStep(5);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.lifeAreas?.health}
            />
          </div>
        )}

        {currentStep >= 5 && (
          <div className={`wizard-slide ${currentStep === 5 ? 'active' : currentStep > 5 ? 'prev' : 'next'}`}>
            <Step6Habits
              onNext={(value) => {
                setReportData({ 
                  ...reportData, 
                  pastYear: { 
                    ...reportData.pastYear, 
                    lifeAreas: { ...reportData.pastYear.lifeAreas, habits: value } 
                  } 
                });
                setCurrentStep(6);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.lifeAreas?.habits}
            />
          </div>
        )}

        {currentStep >= 6 && (
          <div className={`wizard-slide ${currentStep === 6 ? 'active' : currentStep > 6 ? 'prev' : 'next'}`}>
            <Step7Career
              onNext={(value) => {
                setReportData({ 
                  ...reportData, 
                  pastYear: { 
                    ...reportData.pastYear, 
                    lifeAreas: { ...reportData.pastYear.lifeAreas, career: value } 
                  } 
                });
                setCurrentStep(7);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.lifeAreas?.career}
            />
          </div>
        )}

        {currentStep >= 7 && (
          <div className={`wizard-slide ${currentStep === 7 ? 'active' : currentStep > 7 ? 'prev' : 'next'}`}>
            <Step8Hobbies
              onNext={(value) => {
                setReportData({ 
                  ...reportData, 
                  pastYear: { 
                    ...reportData.pastYear, 
                    lifeAreas: { ...reportData.pastYear.lifeAreas, hobbies: value } 
                  } 
                });
                setCurrentStep(8);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.lifeAreas?.hobbies}
            />
          </div>
        )}

        {currentStep >= 8 && (
          <div className={`wizard-slide ${currentStep === 8 ? 'active' : currentStep > 8 ? 'prev' : 'next'}`}>
            <Step9Psychology
              onNext={(value) => {
                setReportData({ 
                  ...reportData, 
                  pastYear: { 
                    ...reportData.pastYear, 
                    lifeAreas: { ...reportData.pastYear.lifeAreas, psychology: value } 
                  } 
                });
                setCurrentStep(9);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.lifeAreas?.psychology}
            />
          </div>
        )}

        {currentStep >= 9 && (
          <div className={`wizard-slide ${currentStep === 9 ? 'active' : currentStep > 9 ? 'prev' : 'next'}`}>
            <Step10BetterTomorrow
              onNext={(value) => {
                setReportData({ 
                  ...reportData, 
                  pastYear: { 
                    ...reportData.pastYear, 
                    lifeAreas: { ...reportData.pastYear.lifeAreas, betterTomorrow: value } 
                  } 
                });
                setCurrentStep(10);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.lifeAreas?.betterTomorrow}
            />
          </div>
        )}

        {/* Step 11: Important Moments */}
        {currentStep >= 10 && (
          <div className={`wizard-slide ${currentStep === 10 ? 'active' : currentStep > 10 ? 'prev' : 'next'}`}>
            <Step11ImportantMoments
              onNext={(moments) => {
                setReportData({ ...reportData, pastYear: { ...reportData.pastYear, importantMoments: moments } });
                setCurrentStep(11);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.importantMoments}
            />
          </div>
        )}

        {/* Step 12: Questions */}
        {currentStep >= 11 && (
          <div className={`wizard-slide ${currentStep === 11 ? 'active' : currentStep > 11 ? 'prev' : 'next'}`}>
            <Step12Questions
              onNext={(questions) => {
                setReportData({ ...reportData, pastYear: { ...reportData.pastYear, questions } });
                setCurrentStep(12);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.questions}
            />
          </div>
        )}

        {/* Step 13: Best Moments */}
        {currentStep >= 12 && (
          <div className={`wizard-slide ${currentStep === 12 ? 'active' : currentStep > 12 ? 'prev' : 'next'}`}>
            <Step13BestMoments
              onNext={(bestMoments) => {
                setReportData({ ...reportData, pastYear: { ...reportData.pastYear, bestMoments } });
                setCurrentStep(13);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.bestMoments}
            />
          </div>
        )}

        {/* Step 14: Achievements */}
        {currentStep >= 13 && (
          <div className={`wizard-slide ${currentStep === 13 ? 'active' : currentStep > 13 ? 'prev' : 'next'}`}>
            <Step14Achievements
              onNext={(achievements) => {
                setReportData({ ...reportData, pastYear: { ...reportData.pastYear, achievements } });
                setCurrentStep(14);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.achievements}
            />
          </div>
        )}

        {/* Step 15: Challenges */}
        {currentStep >= 14 && (
          <div className={`wizard-slide ${currentStep === 14 ? 'active' : currentStep > 14 ? 'prev' : 'next'}`}>
            <Step15Challenges
              onNext={(challenges) => {
                setReportData({ ...reportData, pastYear: { ...reportData.pastYear, challenges } });
                setCurrentStep(15);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.challenges}
            />
          </div>
        )}

        {/* Step 16: Forgiveness */}
        {currentStep >= 15 && (
          <div className={`wizard-slide ${currentStep === 15 ? 'active' : currentStep > 15 ? 'prev' : 'next'}`}>
            <Step16Forgiveness
              onNext={(forgiveness) => {
                setReportData({ ...reportData, pastYear: { ...reportData.pastYear, forgiveness } });
                setCurrentStep(16);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.forgiveness}
            />
          </div>
        )}

        {/* Step 17: Summary */}
        {currentStep >= 16 && (
          <div className={`wizard-slide ${currentStep === 16 ? 'active' : currentStep > 16 ? 'prev' : 'next'}`}>
            <Step17Summary
              onNext={(summary) => {
                setReportData({ ...reportData, pastYear: { ...reportData.pastYear, summary } });
                setCurrentStep(17);
              }}
              onBack={handleBack}
              initialData={reportData.pastYear.summary}
            />
          </div>
        )}

        {/* Step 18: Dreams */}
        {currentStep >= 17 && (
          <div className={`wizard-slide ${currentStep === 17 ? 'active' : currentStep > 17 ? 'prev' : 'next'}`}>
            <Step18Dreams
              onNext={(dreams) => {
                setReportData({ ...reportData, futureYear: { ...reportData.futureYear, dreams } });
                setCurrentStep(18);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.dreams}
            />
          </div>
        )}

        {/* Step 19-26: Life Areas (Future) */}
        {currentStep >= 18 && (
          <div className={`wizard-slide ${currentStep === 18 ? 'active' : currentStep > 18 ? 'prev' : 'next'}`}>
            <Step19PersonalLifeFuture
              onNext={(value) => {
                setReportData({ 
                  ...reportData, 
                  futureYear: { 
                    ...reportData.futureYear, 
                    lifeAreas: { ...reportData.futureYear.lifeAreas, personal: value } 
                  } 
                });
                setCurrentStep(19);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.lifeAreas?.personal}
            />
          </div>
        )}

        {currentStep >= 19 && (
          <div className={`wizard-slide ${currentStep === 19 ? 'active' : currentStep > 19 ? 'prev' : 'next'}`}>
            <Step20FriendsFuture
              onNext={(value) => {
                setReportData({ 
                  ...reportData, 
                  futureYear: { 
                    ...reportData.futureYear, 
                    lifeAreas: { ...reportData.futureYear.lifeAreas, friends: value } 
                  } 
                });
                setCurrentStep(20);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.lifeAreas?.friends}
            />
          </div>
        )}

        {currentStep >= 20 && (
          <div className={`wizard-slide ${currentStep === 20 ? 'active' : currentStep > 20 ? 'prev' : 'next'}`}>
            <Step21HealthFuture
              onNext={(value) => {
                setReportData({ 
                  ...reportData, 
                  futureYear: { 
                    ...reportData.futureYear, 
                    lifeAreas: { ...reportData.futureYear.lifeAreas, health: value } 
                  } 
                });
                setCurrentStep(21);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.lifeAreas?.health}
            />
          </div>
        )}

        {currentStep >= 21 && (
          <div className={`wizard-slide ${currentStep === 21 ? 'active' : currentStep > 21 ? 'prev' : 'next'}`}>
            <Step22HabitsFuture
              onNext={(value) => {
                setReportData({ 
                  ...reportData, 
                  futureYear: { 
                    ...reportData.futureYear, 
                    lifeAreas: { ...reportData.futureYear.lifeAreas, habits: value } 
                  } 
                });
                setCurrentStep(22);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.lifeAreas?.habits}
            />
          </div>
        )}

        {currentStep >= 22 && (
          <div className={`wizard-slide ${currentStep === 22 ? 'active' : currentStep > 22 ? 'prev' : 'next'}`}>
            <Step23CareerFuture
              onNext={(value) => {
                setReportData({ 
                  ...reportData, 
                  futureYear: { 
                    ...reportData.futureYear, 
                    lifeAreas: { ...reportData.futureYear.lifeAreas, career: value } 
                  } 
                });
                setCurrentStep(23);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.lifeAreas?.career}
            />
          </div>
        )}

        {currentStep >= 23 && (
          <div className={`wizard-slide ${currentStep === 23 ? 'active' : currentStep > 23 ? 'prev' : 'next'}`}>
            <Step24HobbiesFuture
              onNext={(value) => {
                setReportData({ 
                  ...reportData, 
                  futureYear: { 
                    ...reportData.futureYear, 
                    lifeAreas: { ...reportData.futureYear.lifeAreas, hobbies: value } 
                  } 
                });
                setCurrentStep(24);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.lifeAreas?.hobbies}
            />
          </div>
        )}

        {currentStep >= 24 && (
          <div className={`wizard-slide ${currentStep === 24 ? 'active' : currentStep > 24 ? 'prev' : 'next'}`}>
            <Step25PsychologyFuture
              onNext={(value) => {
                setReportData({ 
                  ...reportData, 
                  futureYear: { 
                    ...reportData.futureYear, 
                    lifeAreas: { ...reportData.futureYear.lifeAreas, psychology: value } 
                  } 
                });
                setCurrentStep(25);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.lifeAreas?.psychology}
            />
          </div>
        )}

        {currentStep >= 25 && (
          <div className={`wizard-slide ${currentStep === 25 ? 'active' : currentStep > 25 ? 'prev' : 'next'}`}>
            <Step26BetterTomorrowFuture
              onNext={(value) => {
                setReportData({ 
                  ...reportData, 
                  futureYear: { 
                    ...reportData.futureYear, 
                    lifeAreas: { ...reportData.futureYear.lifeAreas, betterTomorrow: value } 
                  } 
                });
                setCurrentStep(26);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.lifeAreas?.betterTomorrow}
            />
          </div>
        )}

        {/* Step 27: Magic Triples 1 */}
        {currentStep >= 26 && (
          <div className={`wizard-slide ${currentStep === 26 ? 'active' : currentStep > 26 ? 'prev' : 'next'}`}>
            <Step27MagicTriples1
              onNext={(triples) => {
                setReportData({ ...reportData, futureYear: { ...reportData.futureYear, magicTriples1: triples } });
                setCurrentStep(27);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.magicTriples1}
            />
          </div>
        )}

        {/* Step 28: Magic Triples 2 */}
        {currentStep >= 27 && (
          <div className={`wizard-slide ${currentStep === 27 ? 'active' : currentStep > 27 ? 'prev' : 'next'}`}>
            <Step28MagicTriples2
              onNext={(triples) => {
                setReportData({ ...reportData, futureYear: { ...reportData.futureYear, magicTriples2: triples } });
                setCurrentStep(28);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.magicTriples2}
            />
          </div>
        )}

        {/* Step 29: Wishes */}
        {currentStep >= 28 && (
          <div className={`wizard-slide ${currentStep === 28 ? 'active' : currentStep > 28 ? 'prev' : 'next'}`}>
            <Step29Wishes
              onNext={(wishes) => {
                setReportData({ ...reportData, futureYear: { ...reportData.futureYear, wishes } });
                setCurrentStep(29);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.wishes}
            />
          </div>
        )}

        {/* Step 30: Word of Year */}
        {currentStep >= 29 && (
          <div className={`wizard-slide ${currentStep === 29 ? 'active' : currentStep > 29 ? 'prev' : 'next'}`}>
            <Step30WordOfYear
              onNext={(wordOfYear) => {
                setReportData({ ...reportData, futureYear: { ...reportData.futureYear, wordOfYear } });
                setCurrentStep(30);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.wordOfYear}
            />
          </div>
        )}

        {/* Step 31: Secret Wish */}
        {currentStep >= 30 && (
          <div className={`wizard-slide ${currentStep === 30 ? 'active' : currentStep > 30 ? 'prev' : 'next'}`}>
            <Step31SecretWish
              onNext={(secretWish) => {
                setReportData({ ...reportData, futureYear: { ...reportData.futureYear, secretWish } });
                setCurrentStep(31);
              }}
              onBack={handleBack}
              initialData={reportData.futureYear.secretWish}
            />
          </div>
        )}

        {/* Step 32: Final */}
        {currentStep >= 31 && (
          <div className={`wizard-slide ${currentStep === 31 ? 'active' : currentStep > 31 ? 'prev' : 'next'}`}>
            <Step32Final
              onComplete={handleStepComplete}
              onBack={handleBack}
              year={editingReport.year}
            />
          </div>
        )}
      </WizardContainer>
    );
  }

  const viewingReport = viewingReportId 
    ? yearlyReports.find(r => r.id === viewingReportId)
    : null;

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        paddingBottom: 'calc(116px + env(safe-area-inset-bottom))'
      }}>
        {yearlyReports.length === 0 ? (
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
            {yearlyReports
              .sort((a, b) => b.year - a.year)
              .map((report) => {
                const progress = calculateProgress(report);
                return (
                  <div
                    key={report.id}
                    className="list-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onClick={() => handleView(report)}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        minWidth: 0
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          margin: 0
                        }}>
                          Отчет за {report.year}
                        </h3>
                        <div style={{
                          fontSize: '14px',
                          color: 'var(--tg-theme-hint-color)',
                          flexShrink: 0,
                          marginLeft: '8px'
                        }}>
                          {progress}%
                        </div>
                      </div>
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
                      {/* Превью отчета */}
                      {(report.futureYear.wordOfYear || report.pastYear.summary?.threeWords?.some(w => w)) && (
                        <div style={{
                          fontSize: '12px',
                          color: 'var(--tg-theme-hint-color)',
                          marginTop: '4px'
                        }}>
                          {report.futureYear.wordOfYear && (
                            <span>Слово года: <strong style={{ color: 'var(--tg-theme-text-color)' }}>{report.futureYear.wordOfYear}</strong></span>
                          )}
                          {report.futureYear.wordOfYear && report.pastYear.summary?.threeWords?.some(w => w) && ' • '}
                          {report.pastYear.summary?.threeWords?.some(w => w) && (
                            <span>Три слова: {report.pastYear.summary.threeWords.filter(w => w).join(', ')}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenuId(report.id);
                      }}
                      style={{
                        padding: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--tg-theme-text-color)',
                        cursor: 'pointer',
                        fontSize: '20px',
                        lineHeight: '1',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      ⋯
                    </button>
                    {showMenuId === report.id && (
                      <ReportBottomSheet
                        onClose={() => setShowMenuId(null)}
                        onEdit={() => {
                          setShowMenuId(null);
                          handleEdit(report);
                        }}
                        onDuplicate={() => {
                          handleDuplicate(report);
                        }}
                        onDelete={() => {
                          handleDelete(report.id);
                        }}
                      />
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
      {!isCreating && !viewingReport && (
        <button 
          className="fab"
          onClick={handleCreateNew}
          aria-label="Создать отчет"
          style={{ zIndex: 10001 }}
        >
          +
        </button>
      )}
      {viewingReport && (
        <YearlyReportBottomSheet
          report={viewingReport}
          onClose={handleCloseView}
          onUpdate={async (updatedReport) => {
            await storage.updateYearlyReport(updatedReport.id, updatedReport);
          }}
          onEdit={() => {
            handleEdit(viewingReport);
          }}
          onDuplicate={() => {
            handleDuplicate(viewingReport);
          }}
          onDelete={() => {
            handleDelete(viewingReport.id);
          }}
        />
      )}
    </div>
  );
}

function calculateProgress(report: YearlyReport): number {
  let completed = 0;
  let total = 32; // Общее количество шагов

  // Step 1: Welcome (always completed if report exists)
  completed++;
  
  // Step 2: Calendar
  if (report.pastYear.calendarEvents && report.pastYear.calendarEvents.length > 0) completed++;
  
  // Steps 3-10: Life Areas (Past) - 8 steps
  if (report.pastYear.lifeAreas?.personal) completed++;
  if (report.pastYear.lifeAreas?.friends) completed++;
  if (report.pastYear.lifeAreas?.health) completed++;
  if (report.pastYear.lifeAreas?.habits) completed++;
  if (report.pastYear.lifeAreas?.career) completed++;
  if (report.pastYear.lifeAreas?.hobbies) completed++;
  if (report.pastYear.lifeAreas?.psychology) completed++;
  if (report.pastYear.lifeAreas?.betterTomorrow) completed++;
  
  // Steps 11-17: Past Year Additional - 7 steps
  if (report.pastYear.importantMoments) completed++;
  if (report.pastYear.questions) completed++;
  if (report.pastYear.bestMoments) completed++;
  if (report.pastYear.achievements && report.pastYear.achievements.length > 0) completed++;
  if (report.pastYear.challenges && report.pastYear.challenges.length > 0) completed++;
  if (report.pastYear.forgiveness) completed++;
  if (report.pastYear.summary) completed++;

  // Step 18: Dreams
  if (report.futureYear.dreams) completed++;
  
  // Steps 19-26: Life Areas (Future) - 8 steps
  if (report.futureYear.lifeAreas?.personal) completed++;
  if (report.futureYear.lifeAreas?.friends) completed++;
  if (report.futureYear.lifeAreas?.health) completed++;
  if (report.futureYear.lifeAreas?.habits) completed++;
  if (report.futureYear.lifeAreas?.career) completed++;
  if (report.futureYear.lifeAreas?.hobbies) completed++;
  if (report.futureYear.lifeAreas?.psychology) completed++;
  if (report.futureYear.lifeAreas?.betterTomorrow) completed++;
  
  // Steps 27-31: Future Year Additional - 5 steps
  if (report.futureYear.magicTriples1) completed++;
  if (report.futureYear.magicTriples2) completed++;
  if (report.futureYear.wishes) completed++;
  if (report.futureYear.wordOfYear) completed++;
  if (report.futureYear.secretWish) completed++;

  return Math.round((completed / total) * 100);
}

