const STORAGE_KEY = 'favoriteBooks';
const FAVORITES_EVENT = 'bookstore:favorites-updated';

const canUseStorage = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const normalizeFavoriteIds = (value) => (
  Array.isArray(value)
    ? value
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id))
    : []
);

export const getFavoriteBookIds = () => {
  if (!canUseStorage()) return [];

  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    return normalizeFavoriteIds(JSON.parse(rawValue || '[]'));
  } catch (error) {
    console.error('Unable to read favorite books', error);
    return [];
  }
};

const persistFavoriteBookIds = (ids) => {
  if (!canUseStorage()) return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: ids }));
};

export const isBookFavorite = (bookId) => getFavoriteBookIds().includes(Number(bookId));

export const toggleFavoriteBook = (bookId) => {
  const normalizedId = Number(bookId);
  const currentIds = getFavoriteBookIds();
  const nextIds = currentIds.includes(normalizedId)
    ? currentIds.filter((id) => id !== normalizedId)
    : [...currentIds, normalizedId];

  persistFavoriteBookIds(nextIds);
  return nextIds.includes(normalizedId);
};

export const subscribeToFavoriteBooks = (listener) => {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (event) => {
    listener(normalizeFavoriteIds(event.detail));
  };

  const handleStorageEvent = (event) => {
    if (event.key !== STORAGE_KEY) return;
    listener(getFavoriteBookIds());
  };

  window.addEventListener(FAVORITES_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(FAVORITES_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
};
