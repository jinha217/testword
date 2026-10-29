import React from 'react';
import { FilterType, Flashcard } from '../types/flashcard';
import { 
  Check, 
  X, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  RotateCcw, 
  Keyboard,
  Layers,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface StudyControlsProps {
  currentFilter: FilterType;
  onChangeFilter: (filter: FilterType) => void;
  stats: {
    total: number;
    mastered: number;
    confused: number;
    unlearned: number;
  };
  onMarkStatus: (status: 'confused' | 'mastered') => void;
  onFlip: () => void;
  onPrev: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onResetDeckStatus: () => void;
  onOpenKeyboardGuide: () => void;
  hasCards: boolean;
  canPrev: boolean;
  canNext: boolean;
  currentCardStatus?: Flashcard['status'];
}

export const StudyControls: React.FC<StudyControlsProps> = ({
  currentFilter,
  onChangeFilter,
  stats,
  onMarkStatus,
  onFlip,
  onPrev,
  onNext,
  onShuffle,
  onResetDeckStatus,
  onOpenKeyboardGuide,
  hasCards,
  canPrev,
  canNext,
  currentCardStatus,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5 mt-6">
      {/* 1. Filter Tabs (Segmented Buttons) */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => onChangeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentFilter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>전체 ({stats.total})</span>
          </button>

          <button
            onClick={() => onChangeFilter('confused')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentFilter === 'confused'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>헷갈림/오답 ({stats.confused})</span>
          </button>

          <button
            onClick={() => onChangeFilter('mastered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentFilter === 'mastered'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>아는 개념 ({stats.mastered})</span>
          </button>

          <button
            onClick={() => onChangeFilter('unlearned')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentFilter === 'unlearned'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>미학습 ({stats.unlearned})</span>
          </button>
        </div>
      </div>

      {/* 2. Core Assessment Action Buttons (Large, high-contrast, tactile) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Confused / Needs Review button */}
        <button
          onClick={() => onMarkStatus('confused')}
          disabled={!hasCards}
          className={`group flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
            currentCardStatus === 'confused'
              ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-rose-900/30'
              : 'bg-slate-900 hover:bg-rose-950/40 text-rose-400 border border-rose-500/30 hover:border-rose-500/60 shadow-black/20'
          }`}
          title="단축키: 1 또는 ←"
        >
          <div className="w-6 h-6 rounded-lg bg-rose-500/20 flex items-center justify-center group-hover:bg-rose-500/30">
            <X className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-left">
            <div className="text-sm">헷갈림 / 오답</div>
            <div className="text-[10px] text-rose-400/80 font-mono font-normal">단축키: 1 또는 ←</div>
          </div>
        </button>

        {/* Flip Card button */}
        <button
          onClick={onFlip}
          disabled={!hasCards}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-100 border border-slate-700 font-semibold text-sm transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
          title="단축키: Space"
        >
          <RotateCw className="w-4 h-4 text-indigo-400" />
          <div className="text-left">
            <div className="text-sm">카드 뒤집기</div>
            <div className="text-[10px] text-slate-400 font-mono font-normal">단축키: Space</div>
          </div>
        </button>

        {/* Mastered / Known button */}
        <button
          onClick={() => onMarkStatus('mastered')}
          disabled={!hasCards}
          className={`group flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
            currentCardStatus === 'mastered'
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-emerald-900/30'
              : 'bg-slate-900 hover:bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 shadow-black/20'
          }`}
          title="단축키: 2 또는 →"
        >
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30">
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-left">
            <div className="text-sm">아는 개념</div>
            <div className="text-[10px] text-emerald-400/80 font-mono font-normal">단축키: 2 또는 →</div>
          </div>
        </button>
      </div>

      {/* 3. Navigation & Utility Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={!canPrev}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-300 font-medium flex items-center gap-1 transition-colors"
            title="이전 카드 (↑ 또는 J)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>이전</span>
          </button>

          <button
            onClick={onNext}
            disabled={!canNext}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-300 font-medium flex items-center gap-1 transition-colors"
            title="다음 카드 (↓ 또는 K)"
          >
            <span>다음</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onShuffle}
            disabled={!hasCards}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="카드 무작위 섞기 (셔플)"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={onResetDeckStatus}
            disabled={!hasCards}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="현재 덱 학습 상태 초기화 (전체 미학습으로 변경)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenKeyboardGuide}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
            title="단축키 안내"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">단축키</span>
          </button>
        </div>
      </div>
    </div>
  );
};
