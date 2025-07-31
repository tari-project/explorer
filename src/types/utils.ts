// Utility Types and Helper Functions Types

// === Common Utility Types ===
// Note: These are built-in TypeScript types, but we're redefining them for documentation purposes

/**
 * Make all properties optional (built-in TypeScript utility type)
 */
// export type Partial<T> = {
//   [P in keyof T]?: T[P];
// };

/**
 * Make all properties required (built-in TypeScript utility type)
 */
// export type Required<T> = {
//   [P in keyof T]-?: T[P];
// };

/**
 * Pick specific properties from a type (built-in TypeScript utility type)
 */
// export type Pick<T, K extends keyof T> = {
//   [P in K]: T[P];
// };

/**
 * Omit specific properties from a type (built-in TypeScript utility type)
 */
// export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Extract keys that have values of a specific type
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Make specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

// === API-related Utility Types ===

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Query parameters for API calls
 */
export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Request configuration
 */
export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: QueryParams;
  data?: unknown;
  timeout?: number;
}

// === Form and Validation Types ===

/**
 * Form field validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Form field state
 */
export interface FieldState<T> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
  validating: boolean;
}

/**
 * Form validation schema
 */
export type ValidationSchema<T> = {
  [K in keyof T]?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: T[K]) => ValidationResult;
  };
};

// === Event Handler Types ===

/**
 * Generic event handler
 */
export type EventHandler<T = unknown> = (event: T) => void;

/**
 * Async event handler
 */
export type AsyncEventHandler<T = unknown> = (event: T) => Promise<void>;

/**
 * Click event handler
 */
export type ClickHandler = EventHandler<React.MouseEvent>;

/**
 * Change event handler for input elements
 */
export type ChangeHandler = EventHandler<React.ChangeEvent<HTMLInputElement>>;

/**
 * Submit event handler for forms
 */
export type SubmitHandler = EventHandler<React.FormEvent<HTMLFormElement>>;

// === Theme-related Types ===

/**
 * Theme mode
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Color scheme
 */
export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: string;
  divider: string;
  error: string;
  warning: string;
  info: string;
  success: string;
}

/**
 * Breakpoint definitions
 */
export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

/**
 * Spacing scale
 */
export type SpacingScale =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 8
  | 10
  | 12
  | 16
  | 20
  | 24
  | 32
  | 40
  | 48
  | 56
  | 64;

/**
 * Theme object structure
 */
export interface Theme {
  mode: ThemeMode;
  colors: ColorScheme;
  breakpoints: Breakpoints;
  spacing: (scale: SpacingScale) => string;
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

// === Mock Theme for Testing ===

/**
 * Mock theme interface for testing
 */
export interface MockTheme {
  mode?: ThemeMode;
  spacing?: (value: number) => string;
  breakpoints: {
    down: (breakpoint: string) => string;
    up?: (breakpoint: string) => string;
    between?: (start: string, end: string) => string;
  };
  palette?: {
    primary?: {
      main: string;
      light?: string;
      dark?: string;
    };
    secondary?: {
      main: string;
      light?: string;
      dark?: string;
    };
    background: {
      paper: string;
      default?: string;
    };
    text?: {
      primary: string;
      secondary?: string;
    };
    divider: string;
    error?: {
      main: string;
    };
    warning?: {
      main: string;
    };
    info?: {
      main: string;
    };
    success?: {
      main: string;
    };
  };
}

// === Data Formatting Types ===

/**
 * Number formatting options
 */
export interface NumberFormatOptions {
  decimals?: number;
  thousandsSeparator?: string;
  decimalSeparator?: string;
  prefix?: string;
  suffix?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Date formatting options
 */
export interface DateFormatOptions {
  format: 'relative' | 'absolute' | 'timestamp';
  includeTime?: boolean;
  timezone?: string;
  locale?: string;
}

/**
 * Hash formatting options
 */
export interface HashFormatOptions {
  format: 'full' | 'shortened';
  startChars?: number;
  endChars?: number;
  separator?: string;
}

// === Search and Filter Types ===

/**
 * Search filter configuration
 */
export interface SearchFilter {
  field: string;
  operator:
    | 'equals'
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'gt'
    | 'lt'
    | 'gte'
    | 'lte';
  value: unknown;
}

/**
 * Sort configuration
 */
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Search and filter state
 */
export interface SearchState {
  query: string;
  filters: SearchFilter[];
  sort: SortConfig[];
  pagination: {
    page: number;
    limit: number;
  };
}

// === Storage Types ===

/**
 * Storage interface for data persistence
 */
export interface StorageInterface {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  key(index: number): string | null;
  length: number;
}

/**
 * Async storage interface
 */
export interface AsyncStorageInterface {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}

// === Error Types ===

/**
 * Application error with context
 */
export interface AppError extends Error {
  code?: string;
  context?: Record<string, unknown>;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Validation error
 */
export interface ValidationError extends AppError {
  field?: string;
  constraint?: string;
}

/**
 * Network error
 */
export interface NetworkError extends AppError {
  status?: number;
  statusText?: string;
  url?: string;
  method?: HttpMethod;
}

// === Performance and Monitoring Types ===

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  apiResponseTime: number;
  memoryUsage?: number;
  timestamp: number;
}

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

// === Device and Browser Types ===

/**
 * Device information
 */
export interface DeviceInfo {
  type: 'desktop' | 'tablet' | 'mobile';
  os: string;
  browser: string;
  screenSize: {
    width: number;
    height: number;
  };
  isTouchDevice: boolean;
}

/**
 * Browser capabilities
 */
export interface BrowserCapabilities {
  supportsLocalStorage: boolean;
  supportsSessionStorage: boolean;
  supportsWebWorkers: boolean;
  supportsWebSockets: boolean;
  supportsCrypto: boolean;
  supportsClipboard: boolean;
}

// === Component State Types ===

/**
 * Async state for components
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Loadable state with additional states
 */
export interface LoadableState<T> extends AsyncState<T> {
  isInitialized: boolean;
  isRefreshing: boolean;
  lastUpdated: number | null;
}

// === Route and Navigation Types ===

/**
 * Route parameters
 */
export interface RouteParams {
  [key: string]: string | undefined;
}

/**
 * Navigation state
 */
export interface NavigationState {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
}

/**
 * Route configuration
 */
export interface RouteConfig {
  path: string;
  component: React.ComponentType<unknown>;
  exact?: boolean;
  title?: string;
  requiresAuth?: boolean;
  children?: RouteConfig[];
}

// === Configuration Types ===

/**
 * Application configuration
 */
export interface AppConfig {
  apiUrl: string;
  wsUrl?: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  features: {
    enableAnalytics: boolean;
    enableDarkMode: boolean;
    enableNotifications: boolean;
    enableAutoRefresh: boolean;
  };
  timeouts: {
    api: number;
    websocket: number;
  };
  limits: {
    maxSearchResults: number;
    maxRecentSearches: number;
    maxNotifications: number;
  };
}
