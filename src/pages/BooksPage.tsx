import { useState, useRef } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import { generateId, type Book } from '../utils/storage';
import BookList from '../components/Books/BookList';
import BooksStatisticsView from '../components/Books/BooksStatisticsView';
import WizardContainer from '../components/Wizard/WizardContainer';
import Step1Title from '../components/Books/CreateBook/Step1Title';
import Step2Author from '../components/Books/CreateBook/Step2Author';
import Step3Status from '../components/Books/CreateBook/Step3Status';
import Step4Genre from '../components/Books/CreateBook/Step4Genre';
import Step5Cover from '../components/Books/CreateBook/Step5Cover';
import BookBottomSheet from '../components/Books/BookBottomSheet';
import BookDetailsBottomSheet from '../components/Books/BookDetailsBottomSheet';
import EditBookModal from '../components/Books/EditBookModal';
import CreateGoalModal from '../components/Books/Goals/CreateGoalModal';
import { sectionColors } from '../utils/sectionColors';

interface BooksPageProps {
  storage: ReturnType<typeof useCloudStorage>;
}

const sectionTitles = ['Книги', 'Статистика'];

export default function BooksPage({ storage }: BooksPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);
  const minSwipeDistance = 50;
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createStep, setCreateStep] = useState(0);
  const [bookData, setBookData] = useState<{
    title?: string;
    author?: string;
    status?: 'want-to-read' | 'reading' | 'completed' | 'paused' | 'abandoned';
    genre?: string;
    coverUrl?: string;
  }>({});
  const [menuBook, setMenuBook] = useState<Book | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);

  const handleStartCreate = () => {
    setIsCreating(true);
    setCreateStep(0);
    setBookData({});
  };

  const handleStep1Complete = (title: string) => {
    setBookData({ title });
    setCreateStep(1);
  };

  const handleStep2Complete = (author?: string) => {
    setBookData(prev => ({ ...prev, author }));
    setCreateStep(2);
  };

  const handleStep3Complete = (status: 'want-to-read' | 'reading' | 'completed' | 'paused' | 'abandoned') => {
    setBookData(prev => ({ ...prev, status }));
    setCreateStep(3);
  };

  const handleStep4Complete = (genre?: string) => {
    setBookData(prev => ({ ...prev, genre }));
    setCreateStep(4);
  };

  const handleStep5Complete = async (coverUrl?: string) => {
    const newBook: Book = {
      id: generateId(),
      title: bookData.title!,
      author: bookData.author,
      status: bookData.status || 'want-to-read',
      genre: bookData.genre,
      coverUrl: coverUrl,
      notes: [],
      quotes: [],
      reflections: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await storage.addBook(newBook);
    setIsCreating(false);
    setCreateStep(0);
    setBookData({});
  };

  const handleBack = () => {
    if (createStep > 0) {
      setCreateStep(createStep - 1);
    } else {
      setIsCreating(false);
      setBookData({});
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const deltaX = touchStartRef.current.x - touchEndRef.current.x;
    const deltaY = touchStartRef.current.y - touchEndRef.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Игнорируем горизонтальный свайп, если вертикальное движение больше
    if (absDeltaY > absDeltaX) return;

    const isLeftSwipe = deltaX > minSwipeDistance;
    const isRightSwipe = deltaX < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < sectionTitles.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleOpenDetails = (book: Book) => {
    setSelectedBook(book);
    setShowDetails(true);
  };

  const handleOpenMenu = (book: Book) => {
    setMenuBook(book);
    setShowMenu(true);
  };

  const handleDelete = async (id: string) => {
    await storage.deleteBook(id);
    setShowMenu(false);
    setMenuBook(null);
  };

  if (isCreating) {
    const colors = sectionColors.books;
    
    return (
      <WizardContainer 
        currentStep={createStep + 1} 
        totalSteps={5}
        progressColor={colors.primary}
      >
        <div 
          className={`wizard-slide ${createStep === 0 ? 'active' : createStep > 0 ? 'prev' : 'next'}`}
        >
          <Step1Title onNext={handleStep1Complete} onBack={handleBack} />
        </div>
        <div 
          className={`wizard-slide ${createStep === 1 ? 'active' : createStep > 1 ? 'prev' : 'next'}`}
        >
          <Step2Author 
            title={bookData.title!}
            onNext={handleStep2Complete}
            onBack={handleBack}
          />
        </div>
        <div 
          className={`wizard-slide ${createStep === 2 ? 'active' : createStep > 2 ? 'prev' : 'next'}`}
        >
          <Step3Status 
            title={bookData.title!}
            onNext={handleStep3Complete}
            onBack={handleBack}
          />
        </div>
        <div 
          className={`wizard-slide ${createStep === 3 ? 'active' : createStep > 3 ? 'prev' : 'next'}`}
        >
          <Step4Genre 
            title={bookData.title!}
            onNext={handleStep4Complete}
            onBack={handleBack}
          />
        </div>
        <div 
          className={`wizard-slide ${createStep === 4 ? 'active' : createStep > 4 ? 'prev' : 'next'}`}
        >
          <Step5Cover 
            title={bookData.title!}
            onNext={handleStep5Complete}
            onBack={handleBack}
          />
        </div>
      </WizardContainer>
    );
  }

  return (
    <>
      {/* FAB кнопка для создания книги */}
      <button 
        onClick={handleStartCreate}
        aria-label="Добавить книгу"
        style={{
          position: 'fixed',
          bottom: 'calc(20px + env(safe-area-inset-bottom))',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--tg-theme-button-color)',
          color: 'var(--tg-theme-button-text-color)',
          border: 'none',
          fontSize: '32px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001,
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
      >
        +
      </button>

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Заголовки разделов */}
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

        {/* Контейнер со слайдами */}
        <div
          className="slide-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Слайд 0: Список */}
          <div className={`slide ${currentSlide === 0 ? 'active' : currentSlide > 0 ? 'prev' : 'next'}`}>
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              position: 'relative',
              paddingTop: '0px',
              paddingBottom: 'calc(100px + env(safe-area-inset-bottom))',
              overflow: 'hidden'
            }}>
              <BookList 
                books={storage.books.books}
                onOpenDetails={handleOpenDetails}
                onOpenMenu={handleOpenMenu}
              />
            </div>
          </div>

          {/* Слайд 1: Статистика */}
          <div className={`slide ${currentSlide === 1 ? 'active' : currentSlide > 1 ? 'prev' : 'next'}`}>
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              position: 'relative',
              paddingTop: '0px',
              paddingBottom: 'calc(100px + env(safe-area-inset-bottom))',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>
              <BooksStatisticsView 
                booksData={storage.books}
                onCreateGoal={() => setShowCreateGoal(true)}
                onDeleteGoal={async (goalId) => {
                  await storage.deleteBookGoal(goalId);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BottomSheet для детального просмотра */}
      {showDetails && selectedBook && (
        <BookDetailsBottomSheet
          book={selectedBook}
          onClose={() => {
            setShowDetails(false);
            setSelectedBook(null);
          }}
          onUpdate={async (updatedBook) => {
            await storage.updateBook(updatedBook.id, {
              ...updatedBook,
              updatedAt: Date.now()
            });
            setSelectedBook(updatedBook);
          }}
        />
      )}

      {/* BottomSheet для меню */}
      {showMenu && menuBook && (
        <BookBottomSheet
          onClose={() => {
            setShowMenu(false);
            setMenuBook(null);
          }}
          onEdit={() => {
            if (menuBook) {
              setEditBook(menuBook);
              setShowEditModal(true);
              setShowMenu(false);
              setMenuBook(null);
            }
          }}
          onDelete={() => handleDelete(menuBook.id)}
        />
      )}

      {/* Модальное окно создания цели */}
      {showCreateGoal && (
        <CreateGoalModal
          onSave={async (goal) => {
            await storage.addBookGoal(goal);
            setShowCreateGoal(false);
          }}
          onClose={() => setShowCreateGoal(false)}
        />
      )}

      {/* Модальное окно редактирования книги */}
      {showEditModal && editBook && (
        <EditBookModal
          book={editBook}
          onSave={async (updates) => {
            await storage.updateBook(editBook.id, updates);
            setShowEditModal(false);
            setEditBook(null);
          }}
          onClose={() => {
            setShowEditModal(false);
            setEditBook(null);
          }}
        />
      )}
    </>
  );
}

