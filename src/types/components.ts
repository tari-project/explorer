// Component Props and UI-related Types

import React from 'react';
import type { BlockHeader } from './api';

// === Base Component Props ===

/**
 * Base props for components that accept children
 */
export interface BaseComponentProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Props for components that work with block data
 */
export interface BlockComponentProps {
  blockHeight: string;
}

// === Layout Component Props ===

/**
 * Page layout component props
 */
export interface PageLayoutProps {
  title?: string;
  customHeader?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Main layout component props
 */
export interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Gradient paper component props
 */
export interface GradientPaperProps {
  children: React.ReactNode;
  height?: string;
  [key: string]: unknown;
}

// === Header Component Props ===

/**
 * Header component props
 */
export interface HeaderProps {
  isMobile?: boolean;
}

/**
 * Mobile menu button props
 */
export interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * Search field props
 */
export interface SearchFieldProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Stats box props
 */
export interface StatsBoxProps {
  title: string;
  value: string | number;
  subtitle?: string;
  loading?: boolean;
}

/**
 * Download modal props
 */
export interface DownloadModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * OS button props
 */
export interface OSButtonProps {
  os: 'windows' | 'mac' | 'linux';
  downloadLink: string;
}

// === Block Component Props ===

/**
 * Block table props
 */
export interface BlockTableProps {
  blocks?: BlockHeader[];
  loading?: boolean;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}

/**
 * Block widget props
 */
export interface BlockWidgetProps {
  limit?: number;
  showPagination?: boolean;
}

/**
 * Block header component props
 */
export interface BlockHeaderProps extends BlockComponentProps {
  showNavigation?: boolean;
}

/**
 * Block info component props
 */
export interface BlockInfoProps extends BlockComponentProps {
  expanded?: boolean;
}

/**
 * Block parts component props
 */
export interface BlockPartsProps extends BlockComponentProps {
  type: 'inputs' | 'outputs' | 'kernels';
  itemsPerPage?: number;
}

/**
 * Block rewards component props
 */
export interface BlockRewardsProps extends BlockComponentProps {
  showDetails?: boolean;
}

// === Accordion Component Props ===

/**
 * Generate accordion props
 */
export interface GenerateAccordionProps {
  items: AccordionItem[];
  adjustedIndex: number;
  expanded: boolean | string;
  handleChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
  expandedPanel: string;
  tabName: string;
  isHighlighted?: boolean;
}

/**
 * Accordion item structure
 */
export interface AccordionItem {
  label: string;
  value?: string | number | number[];
  copy?: boolean | string;
  children?: AccordionItem[];
}

/**
 * Styled accordion props
 */
export interface StyledAccordionProps {
  children: React.ReactNode;
  expanded: boolean | string;
  onChange?: (event: unknown, expanded: boolean) => void;
  isHighlighted?: boolean;
  [key: string]: unknown;
}

/**
 * Styled accordion summary props
 */
export interface StyledAccordionSummaryProps {
  children: React.ReactNode;
  expandIcon?: React.ReactNode;
  isHighlighted?: boolean;
  expanded?: boolean | string;
  [key: string]: unknown;
}

/**
 * Grid item props
 */
export interface GridItemProps {
  label: string;
  value: string | number;
  copy?: boolean | string;
  adjustedIndex?: number;
  childIndex?: number;
}

// === Chart Component Props ===

/**
 * Base chart props
 */
export interface BaseChartProps {
  loading?: boolean;
  error?: string;
  height?: number | string;
}

/**
 * Block times chart props
 */
export interface BlockTimesChartProps extends BaseChartProps {
  data?: number[];
  targetTime?: number;
  type?: 'all' | 'randomx' | 'sha3';
}

/**
 * Hash rates chart props
 */
export interface HashRatesChartProps extends BaseChartProps {
  data?: Array<{ blockNumber: number; hashRate: number }>;
  type?: 'all' | 'randomx' | 'sha3';
}

/**
 * POW chart props
 */
export interface POWChartProps extends BaseChartProps {
  data?: {
    moneroRx10: number;
    moneroRx20: number;
    sha3x: number;
  };
}

/**
 * VN chart props
 */
export interface VNChartProps extends BaseChartProps {
  data?: Array<{
    committee: string;
    count: number;
  }>;
}

// === Table Component Props ===

/**
 * Mempool table props
 */
export interface MempoolTableProps {
  transactions?: Array<{
    hash: string;
    fee: number;
    size: number;
    timestamp: number;
  }>;
  loading?: boolean;
}

/**
 * VN table props
 */
export interface VNTableProps {
  validators?: Array<{
    publicKey: string;
    shardKey: string;
    committee: string;
  }>;
  loading?: boolean;
}

// === Search Component Props ===

/**
 * Search kernel props
 */
export interface SearchKernelProps {
  onSearch: (nonces: string[], signatures: string[]) => void;
  loading?: boolean;
  results?: Array<{
    blockHeight: number;
    kernelIndex: number;
    signature: string;
  }>;
}

/**
 * Search PayRef props
 */
export interface SearchPayRefProps {
  onSearch: (payref: string) => void;
  loading?: boolean;
  results?: Array<{
    blockHeight: number;
    outputIndex: number;
    paymentReference: string;
  }>;
}

/**
 * Search page header props
 */
export interface SearchPageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

// === Utility Component Props ===

/**
 * Copy to clipboard props
 */
export interface CopyToClipboardProps {
  copy: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

/**
 * Loading component props
 */
export interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

/**
 * Error component props
 */
export interface ErrorProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

/**
 * Fetch status check props
 */
export interface FetchStatusProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  children?: React.ReactNode;
}

/**
 * Skeleton loader props
 */
export interface SkeletonLoaderProps {
  height: number | string;
  count?: number;
  variant?: 'text' | 'rectangular' | 'rounded';
}

/**
 * Snackbar alert props
 */
export interface SnackbarAlertProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

/**
 * Version info props
 */
export interface VersionInfoProps {
  version: string;
  buildDate?: string;
  commitHash?: string;
}

/**
 * Social links props
 */
export interface SocialLinksProps {
  links: Array<{
    name: string;
    url: string;
    icon: React.ComponentType;
  }>;
}

// === MUI Component Mock Props (for testing) ===

/**
 * Typography component props
 */
export interface TypographyProps {
  children: React.ReactNode;
  variant?: string;
  component?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
  gutterBottom?: boolean;
  noWrap?: boolean;
}

/**
 * Grid component props
 */
export interface GridProps {
  children: React.ReactNode;
  item?: boolean;
  container?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  spacing?: number;
  direction?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

/**
 * Button component props
 */
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

/**
 * Skeleton component props
 */
export interface SkeletonProps {
  variant: 'text' | 'rectangular' | 'rounded' | 'circular';
  width?: string | number;
  height: string | number;
  animation?: 'pulse' | 'wave' | false;
}

/**
 * Alert component props
 */
export interface AlertProps {
  severity: 'error' | 'warning' | 'info' | 'success';
  variant?: 'standard' | 'filled' | 'outlined';
  children: React.ReactNode;
  onClose?: () => void;
  action?: React.ReactNode;
}

/**
 * Divider component props
 */
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'fullWidth' | 'inset' | 'middle';
  flexItem?: boolean;
  color?: string;
  style?: React.CSSProperties;
}

/**
 * Chip component props
 */
export interface ChipProps {
  label: string;
  variant?: 'filled' | 'outlined';
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: 'small' | 'medium';
  onDelete?: () => void;
  onClick?: () => void;
  icon?: React.ReactElement;
  deleteIcon?: React.ReactElement;
}

// === Motion Component Props ===

/**
 * Motion div props
 */
export interface MotionDivProps {
  children: React.ReactNode;
  initial?: object;
  animate?: object;
  exit?: object;
  transition?: object;
  whileHover?: object;
  whileTap?: object;
  [key: string]: unknown;
}

// === Form Component Props ===

/**
 * Text field props
 */
export interface TextFieldProps {
  label?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'standard' | 'filled' | 'outlined';
  multiline?: boolean;
  rows?: number;
  type?: string;
}

/**
 * Select props
 */
export interface SelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Array<{
    value: string | number;
    label: string;
  }>;
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

// === Pagination Props ===

/**
 * Pagination component props
 */
export interface PaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  disabled?: boolean;
  hideNextButton?: boolean;
  hidePrevButton?: boolean;
  showFirstButton?: boolean;
  showLastButton?: boolean;
  size?: 'small' | 'medium' | 'large';
}