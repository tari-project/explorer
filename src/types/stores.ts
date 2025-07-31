// Store and State Management Types

// === Main Store Types ===

/**
 * Main application store state
 */
export interface MainStore {
  // Mobile menu state
  showMobileMenu: boolean;
  setShowMobileMenu: (showMobileMenu: boolean) => void;

  // Download modal state
  showDownloadModal: boolean;
  setShowDownloadModal: (showDownloadModal: boolean) => void;

  // Mobile detection state
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;

  // Search dialog state
  searchOpen: boolean;
  setSearchOpen: (searchOpen: boolean) => void;
}

/**
 * Main store state selector type
 */
export interface MainStoreState {
  showMobileMenu: boolean;
  showDownloadModal: boolean;
  isMobile: boolean;
  searchOpen: boolean;
  setShowMobileMenu?: (showMobileMenu: boolean) => void;
  setShowDownloadModal?: (showDownloadModal: boolean) => void;
  setIsMobile?: (isMobile: boolean) => void;
  setSearchOpen?: (searchOpen: boolean) => void;
}

// === Search Status Store Types ===

/**
 * Search status store state
 */
export interface SearchStatusStore {
  // Loading state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Error state
  isError: boolean;
  setError: (error: boolean) => void;

  // Success state
  isSuccess: boolean;
  setSuccess: (success: boolean) => void;

  // Reset all states
  reset: () => void;

  // Error message
  errorMessage?: string;
  setErrorMessage: (message: string | undefined) => void;

  // Success message
  successMessage?: string;
  setSuccessMessage: (message: string | undefined) => void;
}

// === Theme Store Types ===

/**
 * Theme preference store
 */
export interface ThemeStore {
  // Current theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  // System theme detection
  systemTheme: 'light' | 'dark';
  setSystemTheme: (theme: 'light' | 'dark') => void;

  // Follow system theme preference
  followSystem: boolean;
  setFollowSystem: (followSystem: boolean) => void;

  // Get effective theme (considers system preference)
  getEffectiveTheme: () => 'light' | 'dark';
}

// === Navigation Store Types ===

/**
 * Navigation state store
 */
export interface NavigationStore {
  // Current page
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // Breadcrumb trail
  breadcrumbs: Array<{
    label: string;
    path: string;
  }>;
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; path: string }>) => void;
  addBreadcrumb: (breadcrumb: { label: string; path: string }) => void;

  // Page title
  pageTitle: string;
  setPageTitle: (title: string) => void;

  // Loading state for page transitions
  isNavigating: boolean;
  setNavigating: (navigating: boolean) => void;
}

// === Data Cache Store Types ===

/**
 * Data cache store for frequently accessed data
 */
export interface DataCacheStore {
  // Cached network stats
  networkStats: {
    bestBlockHeight: number;
    totalDifficulty: number;
    networkHashrate: number;
    blockTimeAvg: number;
    lastUpdated: number;
  } | null;
  setNetworkStats: (stats: DataCacheStore['networkStats']) => void;

  // Cached recent blocks
  recentBlocks: Array<{
    height: number;
    hash: string;
    timestamp: number;
    cached: number;
  }>;
  setRecentBlocks: (blocks: DataCacheStore['recentBlocks']) => void;
  addRecentBlock: (block: {
    height: number;
    hash: string;
    timestamp: number;
  }) => void;

  // Clear all cached data
  clearCache: () => void;

  // Check if data is stale
  isStale: (timestamp: number, maxAge: number) => boolean;
}

// === User Preferences Store Types ===

/**
 * User preferences store
 */
export interface UserPreferencesStore {
  // Display preferences
  displayPreferences: {
    // Number format (with/without thousands separators)
    useThousandsSeparator: boolean;

    // Hash display format (full/shortened)
    hashDisplayFormat: 'full' | 'shortened';

    // Timestamp format
    timestampFormat: 'relative' | 'absolute' | 'both';

    // Default items per page for tables
    defaultItemsPerPage: number;

    // Auto-refresh intervals
    autoRefreshInterval: number; // in milliseconds, 0 = disabled
  };
  setDisplayPreferences: (
    prefs: Partial<UserPreferencesStore['displayPreferences']>
  ) => void;

  // Search preferences
  searchPreferences: {
    // Recently searched terms
    recentSearches: string[];

    // Maximum number of recent searches to keep
    maxRecentSearches: number;

    // Auto-complete enabled
    autoCompleteEnabled: boolean;
  };
  setSearchPreferences: (
    prefs: Partial<UserPreferencesStore['searchPreferences']>
  ) => void;
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;

  // Chart preferences
  chartPreferences: {
    // Default chart type for multi-type charts
    defaultChartType: 'line' | 'area' | 'bar';

    // Show/hide chart animations
    enableAnimations: boolean;

    // Chart color scheme
    colorScheme: 'default' | 'colorblind' | 'highContrast';
  };
  setChartPreferences: (
    prefs: Partial<UserPreferencesStore['chartPreferences']>
  ) => void;

  // Reset all preferences to defaults
  resetToDefaults: () => void;
}

// === Notification Store Types ===

/**
 * Notification/Alert store
 */
export interface NotificationStore {
  // Active notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: number;
    autoClose?: boolean;
    duration?: number; // in milliseconds
  }>;

  // Add notification
  addNotification: (
    notification: Omit<
      NotificationStore['notifications'][0],
      'id' | 'timestamp'
    >
  ) => void;

  // Remove notification
  removeNotification: (id: string) => void;

  // Clear all notifications
  clearNotifications: () => void;

  // Mark notification as read
  markAsRead: (id: string) => void;

  // Get unread count
  getUnreadCount: () => number;
}

// === Zustand Store Creator Types ===

/**
 * Generic Zustand store creator type
 */
export type StoreCreator<T> = (
  set: (partial: T | Partial<T> | ((state: T) => T | Partial<T>)) => void,
  get: () => T
) => T;

/**
 * Store selector function type
 */
export type StoreSelector<T, U> = (state: T) => U;

/**
 * Store equality function type
 */
export type StoreEqualityFn<T> = (a: T, b: T) => boolean;

// === Store Middleware Types ===

/**
 * Persist middleware options
 */
export interface PersistOptions<T> {
  name: string;
  storage?: {
    getItem: (name: string) => string | null | Promise<string | null>;
    setItem: (name: string, value: string) => void | Promise<void>;
    removeItem: (name: string) => void | Promise<void>;
  };
  partialize?: (state: T) => Partial<T>;
  version?: number;
  migrate?: (persistedState: unknown, version: number) => T;
  merge?: (persistedState: unknown, currentState: T) => T;
}

/**
 * Devtools middleware options
 */
export interface DevtoolsOptions {
  name?: string;
  enabled?: boolean;
  anonymousActionType?: string;
  store?: string;
}

// === Store Hook Types ===

/**
 * Store hook return type with selector
 */
export type UseStoreWithSelector<T, U> = (
  selector: StoreSelector<T, U>,
  equalityFn?: StoreEqualityFn<U>
) => U;

/**
 * Store hook return type without selector
 */
export type UseStoreWithoutSelector<T> = () => T;

/**
 * Combined store hook type
 */
export type UseStore<T> = {
  (): T;
  <U>(selector: StoreSelector<T, U>, equalityFn?: StoreEqualityFn<U>): U;
};

// === Store State Hydration Types ===

/**
 * Store hydration state
 */
export interface StoreHydrationState {
  isHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}

/**
 * Store initialization state
 */
export interface StoreInitializationState {
  isInitialized: boolean;
  setInitialized: (initialized: boolean) => void;
  initializationError?: Error;
  setInitializationError: (error: Error | undefined) => void;
}
