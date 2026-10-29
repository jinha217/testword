import React from 'react';
import { Flashcard } from '../types/flashcard';
import { RotateCw, CheckCircle2, AlertTriangle, Star, Bookmark } from 'lucide-react';

interface FlashcardProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  currentIndex: number;
  totalCards: number;
}

export const FlashcardView: React.FC<FlashcardProps> = ({
  card,
  isFlipped,
  onFlip,
  currentIndex,
  totalCards,
}) => {
  const getStatusBadge = (status: Flashcard['status']) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>아는 개념</span>
          </span>
        );
      case 'confused':
        return (
          <span className="inline-flex items-center gap-1 text-rose-400 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>헷갈림 / 오답</span>
          </span>
        );
      default:
        return (
          <span className="text-slate-500 text-xs">
            미학습
          </span>
        );
    }
  };

  const getImportanceBadge = (importance: Flashcard['importance']) => {
    switch (importance) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>핵심 출제</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-indigo-400 text-xs">
            <span>중요</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto perspective-1000 select-none">
      <div
        onClick={onFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onFlip();
          }
        }}
        className={`relative w-full min-h-[300px] sm:min-h-[340px] md:min-h-[360px] cursor-pointer transition-transform duration-500 transform-style-3d outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/80 rounded-3xl ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ================= FRONT SIDE (Keyword) ================= */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-slate-900 to-slate-950 border transition-all duration-300 shadow-2xl ${
            card.status === 'mastered'
              ? 'border-emerald-500/40 shadow-emerald-950/20'
              : card.status === 'confused'
              ? 'border-rose-500/40 shadow-rose-950/20'
              : 'border-slate-800 hover:border-slate-700 shadow-black/40'
          }`}
        >
          {/* Top Metadata Row (Zero-Pill Discipline: unboxed text with · separators) */}
          <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-indigo-400 font-semibold">{card.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              {getImportanceBadge(card.importance)}
              {card.reviewCount > 0 && (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="font-mono text-slate-500">복습 {card.reviewCount}회</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {getStatusBadge(card.status)}
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono text-slate-400 font-medium">
                {currentIndex + 1} / {totalCards}
              </span>
            </div>
          </div>

          {/* Center Keyword Zone */}
          <div className="my-auto py-6 sm:py-8 text-center flex flex-col items-center justify-center">
            <span className="text-xs font-semibold tracking-wider text-indigo-400/90 mb-3 uppercase">
              키워드 / 핵심 개념
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug px-2 text-balance max-w-xl">
              {card.keyword}
            </h3>
          </div>

          {/* Bottom Flip Cue */}
          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <RotateCw className="w-3.5 h-3.5 text-indigo-400 animate-spin-reverse" />
              <span>클릭하여 뜻 확인 (또는 스페이스바)</span>
            </span>
            <span className="hidden sm:inline font-mono text-slate-600">SPACE</span>
          </div>
        </div>

        {/* ================= BACK SIDE (Meaning / Explanation) ================= */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-slate-900 to-slate-950 border transition-all duration-300 shadow-2xl ${
            card.status === 'mastered'
              ? 'border-emerald-500/40 shadow-emerald-950/20'
              : card.status === 'confused'
              ? 'border-rose-500/40 shadow-rose-950/20'
              : 'border-indigo-500/40 shadow-indigo-950/20'
          }`}
        >
          {/* Top Bar on Back */}
          <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">핵심 설명 / 뜻</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{card.category}</span>
            </div>

            <div className="flex items-center gap-2">
              {getStatusBadge(card.status)}
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono text-slate-400 font-medium">
                {currentIndex + 1} / {totalCards}
              </span>
            </div>
          </div>

          {/* Center Meaning Content Zone */}
          <div className="my-auto py-4 sm:py-6 overflow-y-auto max-h-[220px] sm:max-h-[240px] pr-1">
            <div className="mb-2.5">
              <span className="text-xs font-semibold text-slate-400">앞면: </span>
              <span className="text-xs font-bold text-slate-200">{card.keyword}</span>
            </div>
            <div className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal font-sans">
              {card.meaning}
            </div>
          </div>

          {/* Bottom Return Cue */}
          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>다시 뒤집기 (앞면 키워드 보기)</span>
            </span>
            <span className="hidden sm:inline font-mono text-slate-600">SPACE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
