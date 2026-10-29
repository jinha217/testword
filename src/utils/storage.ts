import { Flashcard } from '../types/flashcard';
import { DEFAULT_FLASHCARDS } from '../data/defaultCards';

const CARDS_STORAGE_KEY = 'cram30_flashcards_v1';
const SOUND_STORAGE_KEY = 'cram30_sound_enabled';

export function loadStoredCards(): Flashcard[] {
  try {
    const raw = localStorage.getItem(CARDS_STORAGE_KEY);
    if (!raw) {
      saveStoredCards(DEFAULT_FLASHCARDS);
      return DEFAULT_FLASHCARDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_FLASHCARDS;
  } catch (err) {
    console.error('Failed to load flashcards from storage', err);
    return DEFAULT_FLASHCARDS;
  }
}

export function saveStoredCards(cards: Flashcard[]): void {
  try {
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
  } catch (err) {
    console.error('Failed to save flashcards to storage', err);
  }
}

export function loadSoundSetting(): boolean {
  try {
    const val = localStorage.getItem(SOUND_STORAGE_KEY);
    return val !== 'false';
  } catch {
    return true;
  }
}

export function saveSoundSetting(enabled: boolean): void {
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
  } catch {
    // Ignore error
  }
}

export function exportCardsAsJson(cards: Flashcard[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cards, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `30분벼락치기_핵심개념_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function parseImportedJson(jsonStr: string): Flashcard[] {
  const parsed = JSON.parse(jsonStr);
  if (!Array.isArray(parsed)) {
    throw new Error('유효한 카드 배열 형식이 아닙니다.');
  }
  return parsed.map((item, index) => {
    if (!item.keyword || !item.meaning) {
      throw new Error(`카드 #${index + 1}에 키워드 또는 설명이 누락되었습니다.`);
    }
    return {
      id: item.id || `card-${Date.now()}-${index}`,
      keyword: String(item.keyword).trim(),
      meaning: String(item.meaning).trim(),
      category: String(item.category || '일반').trim(),
      importance: (['high', 'medium', 'normal'].includes(item.importance) ? item.importance : 'normal') as Flashcard['importance'],
      status: (['unlearned', 'confused', 'mastered'].includes(item.status) ? item.status : 'unlearned') as Flashcard['status'],
      reviewCount: Number(item.reviewCount) || 0,
      createdAt: item.createdAt || new Date().toISOString(),
    };
  });
}
