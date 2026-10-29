export type CardStatus = 'unlearned' | 'confused' | 'mastered';
export type CardImportance = 'high' | 'medium' | 'normal';
export type FilterType = 'all' | 'confused' | 'mastered' | 'unlearned';

export interface Flashcard {
  id: string;
  keyword: string;
  meaning: string;
  category: string;
  importance: CardImportance;
  status: CardStatus;
  reviewCount: number;
  lastReviewedAt?: string;
  createdAt: string;
}

export interface DeckStats {
  total: number;
  mastered: number;
  confused: number;
  unlearned: number;
  masteryPercentage: number;
}
