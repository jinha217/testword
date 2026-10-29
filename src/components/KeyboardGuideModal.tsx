import React, { useEffect } from 'react';
import { X, Keyboard, Sparkles } from 'lucide-react';

interface KeyboardGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardGuideModal: React.FC<KeyboardGuideModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: '카드 3D 뒤집기 (앞면 ↔ 뒷면)' },
    { key: '1  또는  ←', desc: "'헷갈림 / 오답'으로 평가하고 다음 카드로 이동" },
    { key: '2  또는  →', desc: "'아는 개념'으로 평가하고 다음 카드로 이동" },
    { key: '↑  또는  J', desc: '이전 카드로 돌아가기' },
    { key: '↓  또는  K', desc: '다음 카드로 이동' },
    { key: 'S', desc: '현재 덱 무작위 섞기 (셔플)' },
    { key: 'Esc', desc: '현재 창 닫기' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="닫기"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">직전 스피드 암기 단축키</h3>
            <p className="text-xs text-slate-400">마우스 없이 손끝으로 초고속 복습이 가능합니다.</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {shortcuts.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs"
            >
              <span className="text-slate-300 font-medium">{item.desc}</span>
              <kbd className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-indigo-300 font-mono font-semibold text-[11px] shadow-sm whitespace-nowrap">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>시험 30분 전 최대 효율을 발휘하세요!</span>
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
