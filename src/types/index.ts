// Central Types Export
// Re-export all types from specific type files for easy importing

// === API Types ===
export * from './api';

// === Component Types ===
export * from './components';

// === Store Types ===
export * from './stores';

// === Utility Types ===
export * from './utils';

// === Legacy Types (for backward compatibility) ===
// These are kept for existing code that might still use them

/**
 * @deprecated Use AccordionItem from './components' instead
 */
export interface AccordionProps {
  adjustedIndex: number;
  tabName: string;
  items: unknown[];
}

/**
 * @deprecated Use KernelSearchItem from './api' instead
 */
export interface KernelItem {
  signature: unknown;
  [key: string]: unknown;
}

/**
 * @deprecated Use HashRatesData from './api' instead
 */
export interface ZoomConfig {
  start: number;
  end: number;
}