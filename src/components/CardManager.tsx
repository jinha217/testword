import React, { useState, useRef } from 'react';
import { Flashcard, CardImportance } from '../types/flashcard';
import { PRESET_DECKS } from '../data/defaultCards';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  X, 
  Star, 
  BookOpen,
  Sparkles,
  Layers
} from 'lucide-react';
import { exportCardsAsJson, parseImportedJson } from '../utils/storage';

interface CardManagerProps {
  cards: Flashcard[];
  onAddCard: (card: Omit<Flashcard, 'id' | 'createdAt' | 'reviewCount' | 'status'>) => void;
  onUpdateCard: (updatedCard: Flashcard) => void;
  onDeleteCard: (id: string) => void;
  onResetDefault: () => void;
  onLoadPreset: (presetCards: Flashcard[]) => void;
  onImportCards: (cards: Flashcard[]) => void;
  onClose: () => void;
}

export const CardManager: React.FC<CardManagerProps> = ({
  cards,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onResetDefault,
  onLoadPreset,
  onImportCards,
  onClose,
}) => {
  // Form State
  const [keyword, setKeyword] = useState('');
  const [meaning, setMeaning] = useState('');
  const [category, setCategory] = useState('일반');
  const [importance, setImportance] = useState<CardImportance>('normal');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const categories = Array.from(new Set(cards.map((c) => c.category))).filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || !meaning.trim()) {
      showToast('키워드(앞면)와 설명(뒷면)을 모두 입력해주세요.');
      return;
    }

    if (editingCardId) {
      const existing = cards.find((c) => c.id === editingCardId);
      if (existing) {
        onUpdateCard({
          ...existing,
          keyword: keyword.trim(),
          meaning: meaning.trim(),
          category: category.trim() || '일반',
          importance,
        });
        showToast('카드가 성공적으로 수정되었습니다.');
      }
      setEditingCardId(null);
    } else {
      onAddCard({
        keyword: keyword.trim(),
        meaning: meaning.trim(),
        category: category.trim() || '일반',
        importance,
      });
      showToast('새 카드가 등록되었습니다!');
    }

    // Reset Form
    setKeyword('');
    setMeaning('');
    setCategory('일반');
    setImportance('normal');
  };

  const startEdit = (card: Flashcard) => {
    setEditingCardId(card.id);
    setKeyword(card.keyword);
    setMeaning(card.meaning);
    setCategory(card.category);
    setImportance(card.importance);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingCardId(null);
    setKeyword('');
    setMeaning('');
    setCategory('일반');
    setImportance('normal');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = parseImportedJson(content);
        onImportCards(parsed);
        showToast(`${parsed.length}개의 카드를 성공적으로 불러왔습니다.`);
      } catch (err: unknown) {
        showToast(`가져오기 실패: ${(err as Error).message}`);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || card.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full max-w-4xl mx-auto pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-xl animate-fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            개념 카드 등록 및 관리
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            총 {cards.length}개의 핵심 카드가 브라우저에 안전하게 저장되어 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportCardsAsJson(cards)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="현재 카드들을 JSON 파일로 백업"
          >
            <Download className="w-3.5 h-3.5" />
            <span>백업 다운로드</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="JSON 파일에서 카드 목록 불러오기"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>불러오기</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => {
              if (window.confirm('기본 탑재 5개 샘플 데이터로 복원하시겠습니까? 기존 카드는 덮어씌워집니다.')) {
                onResetDefault();
                showToast('기본 샘플 5개 카드로 복원되었습니다.');
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-amber-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="기본 5개 샘플 데이터로 복원"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>기본값 복원</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm ml-auto sm:ml-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>암기 모드로 돌아가기</span>
          </button>
        </div>
      </div>

      {/* Preset Decks Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 mb-6">
        <div className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>추천 프리셋 덱 불러오기:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_DECKS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                if (window.confirm(`'${preset.name}' 덱을 불러오시겠습니까?`)) {
                  onLoadPreset(preset.cards);
                  showToast(`'${preset.name}' 덱이 로드되었습니다.`);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= CARD REGISTRATION / EDIT FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl mb-8 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
              {editingCardId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {editingCardId ? '카드 수정하기' : '새 암기 카드 등록'}
            </h3>
          </div>
          {editingCardId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
              <span>수정 취소</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Keyword Front */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              앞면: 키워드 / 질문 / 개념 <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: 트랜잭션 ACID, HTTP Status 404, 데드락..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          {/* Category & Importance */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                과목 / 카테고리
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="예: 운영체제, DB, 영어..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                시험 중요도
              </label>
              <select
                value={importance}
                onChange={(e) => setImportance(e.target.value as CardImportance)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              >
                <option value="high">★ 핵심 필수</option>
                <option value="medium">▲ 보통 중요</option>
                <option value="normal">● 일반 개념</option>
              </select>
            </div>
          </div>
        </div>

        {/* Meaning Back */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            뒷면: 핵심 설명 및 뜻 (줄바꿈 가능) <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={4}
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            placeholder="시험 직전 3초 안에 떠올릴 핵심 내용, 요약 키워드, 암기 팁 등을 적어주세요."
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all leading-relaxed"
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          {editingCardId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
          >
            {editingCardId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{editingCardId ? '카드 수정 완료' : '카드 추가하기'}</span>
          </button>
        </div>
      </form>

      {/* ================= REGISTERED CARDS LIST ================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>등록된 카드 목록</span>
            <span className="text-xs text-slate-400 font-normal">
              ({filteredCards.length} / {cards.length}개)
            </span>
          </h3>

          <div className="flex items-center gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-slate-700"
            >
              <option value="all">모든 과목</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="키워드/설명 검색..."
                className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500 w-44 sm:w-56"
              />
            </div>
          </div>
        </div>

        {filteredCards.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 text-center text-slate-500 text-sm">
            검색 결과에 맞는 카드가 없습니다. 상단에서 카드를 새로 추가해보세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredCards.map((c) => (
              <div
                key={c.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-indigo-400 font-semibold">{c.category}</span>
                      <span aria-hidden="true">·</span>
                      {c.importance === 'high' && (
                        <span className="text-amber-400 flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>핵심</span>
                        </span>
                      )}
                      {c.status === 'mastered' && (
                        <span className="text-emerald-400 font-medium">아는 개념</span>
                      )}
                      {c.status === 'confused' && (
                        <span className="text-rose-400 font-medium">헷갈림/오답</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(c)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                        title="카드 수정"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`'${c.keyword}' 카드를 삭제하시겠습니까?`)) {
                            onDeleteCard(c.id);
                            showToast('카드가 삭제되었습니다.');
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="카드 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2">{c.keyword}</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 whitespace-pre-line">
                    {c.meaning}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60 font-mono">
                  <span>복습 횟수: {c.reviewCount}회</span>
                  <span>{new Date(c.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
