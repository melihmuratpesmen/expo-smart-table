// types.ts
import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { TableTheme } from './theme/tokens';

export type SortDirection = 'asc' | 'desc' | null;
export type Density = 'compact' | 'standard' | 'comfortable';
export type FilterType = 'text' | 'select' | 'boolean' | 'number-range';

// New: Translations Interface
export interface TableTranslations {
  searchPlaceholder: string;
  noData: string;
  columns: string;
  filter: string;
  apply: string;
  clear: string;
  selected: string;
  unknownFilter: string;
  all: string;
  yesActive: string;
  noPassive: string;
  min: string;
  max: string;
}

export const DEFAULT_TRANSLATIONS: TableTranslations = {
  searchPlaceholder: "Search...",
  noData: "No data found.",
  columns: "Columns",
  filter: "Filter",
  apply: "Apply Filters",
  clear: "Clear",
  selected: "selected",
  unknownFilter: "Unknown filter type",
  all: "All",
  yesActive: "Yes / Active",
  noPassive: "No / Passive",
  min: "Min",
  max: "Max",
};

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
  translations?: Partial<TableTranslations>; // New Prop for localization

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

  // Drag & Drop
  onColumnReorder?: (newOrder: string[]) => void;
  enableRowReorder?: boolean;
  onRowReorder?: (fromIndex: number, toIndex: number) => void;

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