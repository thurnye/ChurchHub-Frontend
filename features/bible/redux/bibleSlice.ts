/**
 * Backward compatibility wrapper for existing Bible feature imports.
 * The actual implementation has moved to redux/slices/bible.slice.ts
 * to follow the new feature-based architecture.
 */

export { loadBibles, loadBooks, setSelectedBibleId, setBooksFilter } from './slices/bible.slice';
export { default } from './slices/bible.slice';
