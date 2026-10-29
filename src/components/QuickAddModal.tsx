import React, { useState, useEffect } from 'react';
import { Flashcard, CardImportance } from '../types/flashcard';
import { X, Plus, Sparkles } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: Omit<Flashcard, 'id' | 'createdAt' | 'reviewCount' | 'status'>) => void;
  existingCategories: string[];
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddCard,
  existingCategories,
}) => {
  const [keyword, setKeyword] = useState('');
  const [meaning, setMeaning] = useState('');
  const [category, setCategory] = useState('핵심개념');
  const [importance, setImportance] = useState<CardImportance>('high');

  useEffect(() => {
    if (isOpen) {
      setKeyword('');
      setMeaning('');
      setCategory(existingCategories[0] || '핵심개념');
      setImportance('high');
    }
  }, [isOpen, existingCategories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || !meaning.trim()) return;

    onAddCard({
      keyword: keyword.trim(),
      meaning: meaning.trim(),
      category: category.trim() || '핵심개념',
      importance,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="닫기"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">암기 카드 빠른 등록</h3>
            <p className="text-xs text-slate-400">시험에 나올 단어와 핵심 뜻을 등록하세요.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              앞면: 키워드 / 용어 <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: 뮤텍스와 세마포어의 차이점"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                과목 / 카테고리
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="예: 운영체제, 네트워크"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                시험 중요도
              </label>
              <select
                value={importance}
                onChange={(e) => setImportance(e.target.value as CardImportance)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="high">★ 핵심 필수</option>
                <option value="medium">▲ 보통 중요</option>
                <option value="normal">● 일반 개념</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              뒷면: 핵심 설명 및 뜻 <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="직전 3초 안에 외울 수 있도록 명확하고 간결하게 작성하세요."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>등록 완료</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
