// types.ts
import { ReactNode } from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { TableTheme } from './theme/tokens';

export type SortDirection = 'asc' | 'desc' | null;
export type Density = 'compact' | 'standard' | 'comfortable';
export type FilterType = 'text' | 'select' | 'boolean' | 'number-range';

export interface FilterConfig {
  type: FilterType;
  options?: string[]; // For 'select' type
}

export interface Column<T> {
  key: keyof T;
  title: string;
  width?: number;
  isSticky?: boolean;
  align?: 'left' | 'center' | 'right';
  renderCell?: (item: T, index: number) => ReactNode;
  editable?: boolean;
  hidden?: boolean;
  filterConfig?: FilterConfig; // New: Filtering configuration
}

export interface FilterState {
  [key: string]: any; // value of the filter
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemsPerPageOptions?: number[]; // [10, 20, 50, 100]
  onItemsPerPageChange?: (perPage: number) => void;
}

export interface ModernTableProps<T> {
  data: T[];
  columns: Column<T>[];
  stickyHeader?: boolean;

  // Tematik Props
  theme?: 'light' | 'dark';
  themeConfig?: Partial<TableTheme>;

  // Yeni Props
  enableSelection?: boolean; // Checkbox aktif mi?
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  enableGlobalSearch?: boolean; // Arama aktif mi?
  isLoading?: boolean; // Skeleton için

  // Mevcut Props
  onSort?: (columnKey: keyof T, direction: SortDirection) => void;
  sortColumn?: keyof T;
  sortDirection?: SortDirection;
  pagination?: PaginationProps;

  // Toolbar & State Props
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  density?: Density;
  onDensityChange?: (d: Density) => void;
  visibleColumns?: string[];
  onToggleColumn?: (key: string) => void;
  stickyColumns?: string[];
  onToggleSticky?: (key: string) => void;

  filters?: FilterState;
  onFilterChange?: (columnKey: string, value: any) => void;

  // Selection Actions
  selectedIds?: Set<string | number>;
  isAllSelected?: boolean;
  onToggleAll?: () => void;
  onToggleOne?: (id: string | number) => void;

  // Stil
  containerStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  rowStyle?: StyleProp<ViewStyle>;
  emptyMessage?: string;

  onRowChange?: (newItem: T) => void;
}