/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Flashcard, FilterType, DeckStats } from './types/flashcard';
import { DEFAULT_FLASHCARDS } from './data/defaultCards';
import { 
  loadStoredCards, 
  saveStoredCards, 
  loadSoundSetting, 
  saveSoundSetting 
} from './utils/storage';
import { 
  setSoundEnabled, 
  playFlipSound, 
  playMasteredSound, 
  playConfusedSound 
} from './utils/audio';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { FlashcardView } from './components/Flashcard';
import { StudyControls } from './components/StudyControls';
import { CardManager } from './components/CardManager';
import { TimerWidget } from './components/TimerWidget';
import { KeyboardGuideModal } from './components/KeyboardGuideModal';
import { QuickAddModal } from './components/QuickAddModal';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RotateCcw, 
  Plus, 
  BookOpen, 
  Filter,
  CheckCheck
} from 'lucide-react';

export default function App() {
  // Main Data States
  const [cards, setCards] = useState<Flashcard[]>(() => loadStoredCards());
  const [soundOn, setSoundOn] = useState<boolean>(() => {
    const s = loadSoundSetting();
    setSoundEnabled(s);
    return s;
  });

  // UI View States
  const [activeTab, setActiveTab] = useState<'study' | 'confused_only' | 'manage'>('study');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isKeyboardModalOpen, setIsKeyboardModalOpen] = useState(false);

  // Save cards whenever they change
  useEffect(() => {
    saveStoredCards(cards);
  }, [cards]);

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    saveSoundSetting(next);
  };

  // Filtered Cards List
  const filteredCards = useMemo(() => {
    switch (currentFilter) {
      case 'confused':
        return cards.filter((c) => c.status === 'confused');
      case 'mastered':
        return cards.filter((c) => c.status === 'mastered');
      case 'unlearned':
        return cards.filter((c) => c.status === 'unlearned');
      case 'all':
      default:
        return cards;
    }
  }, [cards, currentFilter]);

  // Keep currentIndex bounded
  useEffect(() => {
    if (currentIndex >= filteredCards.length && filteredCards.length > 0) {
      setCurrentIndex(filteredCards.length - 1);
    } else if (filteredCards.length === 0) {
      setCurrentIndex(0);
    }
    setIsFlipped(false);
  }, [filteredCards.length, currentIndex]);

  // Overall Deck Statistics
  const stats: DeckStats = useMemo(() => {
    const total = cards.length;
    const mastered = cards.filter((c) => c.status === 'mastered').length;
    const confused = cards.filter((c) => c.status === 'confused').length;
    const unlearned = cards.filter((c) => c.status === 'unlearned').length;
    const masteryPercentage = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { total, mastered, confused, unlearned, masteryPercentage };
  }, [cards]);

  const currentCard = filteredCards[currentIndex];

  // Actions
  const handleFlip = useCallback(() => {
    if (filteredCards.length === 0) return;
    setIsFlipped((prev) => {
      playFlipSound();
      return !prev;
    });
  }, [filteredCards.length]);

  const handleNext = useCallback(() => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, filteredCards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleMarkStatus = useCallback(
    (newStatus: 'confused' | 'mastered') => {
      if (!currentCard) return;

      if (newStatus === 'mastered') {
        playMasteredSound();
      } else {
        playConfusedSound();
      }

      setCards((prev) =>
        prev.map((c) => {
          if (c.id === currentCard.id) {
            return {
              ...c,
              status: newStatus,
              reviewCount: c.reviewCount + 1,
              lastReviewedAt: new Date().toISOString(),
            };
          }
          return c;
        })
      );

      // Smooth auto-advance to next card if available
      if (currentIndex < filteredCards.length - 1) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setIsFlipped(false);
        }, 150);
      }
    },
    [currentCard, currentIndex, filteredCards.length]
  );

  const handleShuffle = useCallback(() => {
    if (cards.length === 0) return;
    setCards((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
    setCurrentIndex(0);
    setIsFlipped(false);
    playFlipSound();
  }, [cards.length]);

  const handleResetDeckStatus = () => {
    if (window.confirm('모든 카드의 학습 상태(아는 개념/오답)를 초기화하시겠습니까?')) {
      setCards((prev) =>
        prev.map((c) => ({
          ...c,
          status: 'unlearned',
        }))
      );
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in inputs or textareas
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      if (activeTab === 'manage') return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === '1' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handleMarkStatus('confused');
      } else if (e.key === '2' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleMarkStatus('mastered');
      } else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'j') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleNext();
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleShuffle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, handleFlip, handleMarkStatus, handlePrev, handleNext, handleShuffle]);

  // Tab Selection
  const handleSelectTab = (tab: 'study' | 'confused_only' | 'manage') => {
    setActiveTab(tab);
    if (tab === 'confused_only') {
      setCurrentFilter('confused');
      setCurrentIndex(0);
      setIsFlipped(false);
    } else if (tab === 'study') {
      setCurrentFilter('all');
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  const handleAddCard = (newCardData: Omit<Flashcard, 'id' | 'createdAt' | 'reviewCount' | 'status'>) => {
    const newCard: Flashcard = {
      ...newCardData,
      id: `card-${Date.now()}`,
      status: 'unlearned',
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCards((prev) => [newCard, ...prev]);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleUpdateCard = (updated: Flashcard) => {
    setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleResetToDefault = () => {
    setCards(DEFAULT_FLASHCARDS);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleLoadPreset = (presetCards: Flashcard[]) => {
    setCards(presetCards);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleImportCards = (importedCards: Flashcard[]) => {
    setCards(importedCards);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Check if current filter is completed
  const isDeckCompleted =
    filteredCards.length > 0 &&
    currentFilter === 'all' &&
    stats.unlearned === 0;

  const existingCategories = Array.from(new Set(cards.map((c) => c.category))).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Top Bar Header */}
      <Header
        currentTab={activeTab}
        onSelectTab={handleSelectTab}
        soundEnabled={soundOn}
        onToggleSound={handleToggleSound}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        confusedCount={stats.confused}
        totalCards={stats.total}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-5 pb-12">
        {activeTab === 'manage' ? (
          /* ================= CARD MANAGEMENT VIEW ================= */
          <CardManager
            cards={cards}
            onAddCard={handleAddCard}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
            onResetDefault={handleResetToDefault}
            onLoadPreset={handleLoadPreset}
            onImportCards={handleImportCards}
            onClose={() => setActiveTab('study')}
          />
        ) : (
          /* ================= SPEED CRAMMING VIEW ================= */
          <div className="flex flex-col gap-6">
            {/* Top Info Strip: Exam Timer & High Yield Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 border border-slate-800/80 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-slate-300">
                  시험 직전 초스피드 암기 루프
                </span>
                <span className="text-slate-500 text-xs hidden sm:inline">
                  · 카드를 뒤집어 확인 후 '아는 개념' 또는 '헷갈림'으로 즉시 분류하세요.
                </span>
              </div>

              {/* 30-Minute Sprint Timer */}
              <div className="self-end sm:self-auto">
                <TimerWidget initialMinutes={30} />
              </div>
            </div>

            {/* Visual Mastery Progress Bar */}
            <ProgressBar
              stats={stats}
              currentFilterLabel={
                currentFilter === 'confused'
                  ? '오답 집중 모드'
                  : currentFilter === 'mastered'
                  ? '아는 개념'
                  : currentFilter === 'unlearned'
                  ? '미학습'
                  : '전체'
              }
              filteredCount={filteredCards.length}
            />

            {/* If deck is completely reviewed */}
            {isDeckCompleted && currentFilter === 'all' && (
              <div className="bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 text-center animate-fade-in shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                  모든 카드의 1차 검토를 마쳤습니다!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-4">
                  아는 개념 {stats.mastered}개, 헷갈리는 오답 {stats.confused}개입니다.
                  {stats.confused > 0
                    ? ' 시험 직전 가장 중요한 오답들만 골라 최종 복습하세요!'
                    : ' 축하합니다! 모든 핵심 개념을 마스터했습니다!'}
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {stats.confused > 0 && (
                    <button
                      onClick={() => setCurrentFilter('confused')}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>오답 {stats.confused}개만 집중 복습하기</span>
                    </button>
                  )}
                  <button
                    onClick={handleShuffle}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors border border-slate-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>순서 섞어서 다시 보기</span>
                  </button>
                </div>
              </div>
            )}

            {/* Flashcard Area or Empty State */}
            {filteredCards.length > 0 ? (
              <div className="my-2">
                <FlashcardView
                  card={currentCard}
                  isFlipped={isFlipped}
                  onFlip={handleFlip}
                  currentIndex={currentIndex}
                  totalCards={filteredCards.length}
                />

                {/* Interactive Assessment & Navigation Controls */}
                <StudyControls
                  currentFilter={currentFilter}
                  onChangeFilter={(filter) => {
                    setCurrentFilter(filter);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  stats={stats}
                  onMarkStatus={handleMarkStatus}
                  onFlip={handleFlip}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  onShuffle={handleShuffle}
                  onResetDeckStatus={handleResetDeckStatus}
                  onOpenKeyboardGuide={() => setIsKeyboardModalOpen(true)}
                  hasCards={filteredCards.length > 0}
                  canPrev={currentIndex > 0}
                  canNext={currentIndex < filteredCards.length - 1}
                  currentCardStatus={currentCard?.status}
                />
              </div>
            ) : (
              /* Empty Filter State */
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 sm:p-14 text-center my-6 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mb-4">
                  {currentFilter === 'confused' ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <Filter className="w-7 h-7 text-indigo-400" />
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {currentFilter === 'confused'
                    ? '헷갈림/오답으로 분류된 카드가 없습니다!'
                    : currentFilter === 'mastered'
                    ? '아직 아는 개념으로 분류된 카드가 없습니다.'
                    : '조건에 해당하는 카드가 없습니다.'}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6">
                  {currentFilter === 'confused'
                    ? '모든 카드를 잘 숙지하고 계시거나 아직 학습을 시작하지 않았습니다. 전체 카드 보기로 돌아가 학습해보세요.'
                    : '암기 모드에서 카드를 뒤집고 아는 개념/오답으로 분류해보세요.'}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setCurrentFilter('all');
                      setCurrentIndex(0);
                      setIsFlipped(false);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>전체 카드 보기로 이동</span>
                  </button>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors border border-slate-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>새 카드 추가하기</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-5 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>30분 벼락치기</span>
            <span aria-hidden="true">·</span>
            <span>브라우저 LocalStorage 자동 저장</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <button
              onClick={() => setIsKeyboardModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              단축키 안내 (Space, 1, 2)
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleResetToDefault}
              className="hover:text-amber-400 transition-colors"
            >
              기본 샘플 복원
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <QuickAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCard={handleAddCard}
        existingCategories={existingCategories}
      />

      <KeyboardGuideModal
        isOpen={isKeyboardModalOpen}
        onClose={() => setIsKeyboardModalOpen(false)}
      />
    </div>
  );
}
