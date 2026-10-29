import React from 'react';
import { Volume2, VolumeX, Plus, Sparkles, BookOpen, AlertCircle, ListPlus, RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentTab: 'study' | 'confused_only' | 'manage';
  onSelectTab: (tab: 'study' | 'confused_only' | 'manage') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAddModal: () => void;
  confusedCount: number;
  totalCards: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  soundEnabled,
  onToggleSound,
  onOpenAddModal,
  confusedCount,
  totalCards,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
              30분 벼락치기
            </h1>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('study')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'study'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>스피드 암기</span>
          </button>

          <button
            onClick={() => onSelectTab('confused_only')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'confused_only'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>오답 집중</span>
            {confusedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[11px] font-bold">
                {confusedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('manage')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'manage'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ListPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">개념 등록/관리</span>
            <span className="sm:hidden">카드</span>
            <span className="text-slate-500 text-xs font-mono">({totalCards})</span>
          </button>
        </nav>

        {/* Zone 3: Quick Action & Sound Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            aria-label="효과음 토글"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold rounded-lg text-xs sm:text-sm flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">카드 추가</span>
          </button>
        </div>
      </div>
    </header>
  );
};
