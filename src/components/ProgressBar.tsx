import React from 'react';
import { DeckStats } from '../types/flashcard';
import { CheckCircle2, HelpCircle, AlertTriangle, Layers } from 'lucide-react';

interface ProgressBarProps {
  stats: DeckStats;
  currentFilterLabel?: string;
  filteredCount?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ stats, currentFilterLabel, filteredCount }) => {
  const { total, mastered, confused, unlearned, masteryPercentage } = stats;

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-300">시험 직전 암기 진행률</h2>
            {currentFilterLabel && (
              <span className="text-xs text-indigo-400 font-medium">
                · {currentFilterLabel} ({filteredCount ?? total}개)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            '아는 개념'으로 분류된 카드의 마스터 달성도입니다.
          </p>
        </div>

        <div className="flex items-baseline gap-1.5 self-end sm:self-auto">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-emerald-400">
            {masteryPercentage}%
          </span>
          <span className="text-xs text-slate-400">달성</span>
        </div>
      </div>

      {/* Segmented / Combined Multi-Color Progress Bar */}
      <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 flex">
        {total > 0 ? (
          <>
            {/* Mastered portion (Emerald) */}
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out"
              style={{ width: `${(mastered / total) * 100}%` }}
              title={`아는 개념: ${mastered}개 (${Math.round((mastered / total) * 100)}%)`}
            />
            {/* Confused portion (Rose/Red) */}
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500 ease-out"
              style={{ width: `${(confused / total) * 100}%` }}
              title={`헷갈림/오답: ${confused}개 (${Math.round((confused / total) * 100)}%)`}
            />
            {/* Unlearned portion (Slate/Dark) */}
            <div
              className="h-full bg-slate-800/60 transition-all duration-500 ease-out"
              style={{ width: `${(unlearned / total) * 100}%` }}
              title={`미학습: ${unlearned}개 (${Math.round((unlearned / total) * 100)}%)`}
            />
          </>
        ) : (
          <div className="w-full h-full bg-slate-800" />
        )}
      </div>

      {/* Detail Stats Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-3.5 pt-3 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>전체 카드</span>
          <span className="font-mono tabular-nums font-semibold text-slate-200 ml-auto">{total}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>아는 개념</span>
          <span className="font-mono tabular-nums font-semibold text-emerald-400 ml-auto">
            {mastered}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>헷갈림/오답</span>
          <span className="font-mono tabular-nums font-semibold text-rose-400 ml-auto">
            {confused}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>미학습</span>
          <span className="font-mono tabular-nums font-semibold text-slate-400 ml-auto">
            {unlearned}
          </span>
        </div>
      </div>
    </div>
  );
};
