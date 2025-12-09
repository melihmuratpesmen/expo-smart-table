import React, { useRef, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListFilter,
} from "lucide-react-native";
import { ModernTableProps, Column, Density } from "../Table.types";
import { TableToolbar } from "./TableToolbar";
import { Checkbox } from "./Checkbox";
import { ColumnFilterModal } from "./ColumnFilterModal";
import { useTableTheme } from "../hooks/useTableTheme";
import { TableTheme } from "../theme/tokens";

const CHECKBOX_WIDTH = 50;

const ROW_HEIGHTS: Record<Density, number> = {
  compact: 36,
  standard: 48,
  comfortable: 64,
};

export function ModernTable<T extends { id: string | number }>({
  data,
  columns,
  onSort,
  sortColumn,
  sortDirection,
  pagination,
  containerStyle,
  headerStyle,
  rowStyle,
  emptyMessage = "Veri bulunamadı.",
  // Toolbar Props
  searchQuery,
  onSearchChange,
  density = "standard",
  onDensityChange,
  visibleColumns,
  onToggleColumn,
  // Selection Props
  enableSelection,
  selectedIds,
  onToggleOne,
  onToggleAll,
  isAllSelected,
  // Edit Props
  onRowChange,
  stickyColumns,
  onToggleSticky,
  filters,
  onFilterChange,
  // Theme Props
  theme = "light",
  themeConfig,
}: ModernTableProps<T>) {
  const tableTheme = useTableTheme(theme, themeConfig);
  const styles = useMemo(() => createStyles(tableTheme), [tableTheme]);

  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;

  // Edit Mode State
  const [editingCell, setEditingCell] = useState<{
    id: string | number;
    key: string;
  } | null>(null);

  const [tempValue, setTempValue] = useState("");
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(
    null
  );

  // 1. Prepare Active Columns
  const activeColumns = visibleColumns
    ? columns.filter((col) => visibleColumns.includes(col.key as string))
    : columns;

  // 2. Pre-calculate Offsets (Memoized)
  const columnsWithOffsets = useMemo(() => {
    let currentX = enableSelection ? CHECKBOX_WIDTH : 0;
    let stickyAccumulator = enableSelection ? CHECKBOX_WIDTH : 0;

    return activeColumns.map((col) => {
      const width = col.width || 100;
      const colData = {
        ...col,
        offsetX: currentX,
        stickyOffset: stickyAccumulator,
      };

      currentX += width;

      const isSticky = stickyColumns
        ? stickyColumns.includes(col.key as string)
        : col.isSticky;

      if (isSticky) {
        stickyAccumulator += width;
      }

      return { ...colData, isSticky };
    });
  }, [activeColumns, enableSelection, stickyColumns]);

  const contentWidth = activeColumns.reduce(
    (acc, col) => acc + (col.width || 100),
    0
  );
  const totalWidth = enableSelection
    ? contentWidth + CHECKBOX_WIDTH
    : contentWidth;
  const currentRowHeight = ROW_HEIGHTS[density];

  // --- EDIT LOGIC ---
  const handleStartEdit = (item: T, key: string, value: any) => {
    setEditingCell({ id: item.id, key });
    setTempValue(String(value));
  };

  const handleFinishEdit = (item: T, key: string) => {
    if (editingCell && onRowChange) {
      const newItem = { ...item, [key]: tempValue };
      onRowChange(newItem);
    }
    setEditingCell(null);
  };

  // --- STICKY STYLE GENERATOR ---
  const getStickyStyle = (col: any, index: number, backgroundColor: string) => {
    if (!col.isSticky) return {};

    const threshold = col.offsetX - col.stickyOffset;

    return {
      position: "relative",
      zIndex: 100 - index,
      backgroundColor,
      transform: [
        {
          translateX: scrollX.interpolate({
            inputRange: [-1, threshold, threshold + 1],
            outputRange: [0, 0, 1],
            extrapolateLeft: "clamp",
          }),
        },
      ],
      borderRightWidth: 1,
      borderRightColor: tableTheme.border,
      shadowColor: "#000",
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 3,
    } as unknown as StyleProp<ViewStyle>;
  };

  const getAlign = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "center";
      case "right":
        return "flex-end";
      default:
        return "flex-start";
    }
  };

  // --- RENDERERS ---

  const renderCheckboxColumn = (
    type: "header" | "row",
    item?: T,
    bgColor: string = tableTheme.background
  ) => {
    const isHeader = type === "header";

    return (
      <Animated.View
        style={[
          styles.stickyCheckbox,
          {
            height: currentRowHeight,
            backgroundColor: bgColor,
            transform: [
              {
                translateX: scrollX.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0, 0, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Checkbox
          checked={
            isHeader
              ? !!isAllSelected
              : item
                ? selectedIds?.has(item.id) || false
                : false
          }
          onPress={() =>
            isHeader ? onToggleAll?.() : item && onToggleOne?.(item.id)
          }
          activeColor={tableTheme.primary}
          borderColor={tableTheme.textSecondary}
        />
      </Animated.View>
    );
  };

  const renderHeaderCell = useCallback(
    (
      col: Column<T> & { offsetX: number; isSticky?: boolean },
      index: number
    ) => {
      const stickyStyle = getStickyStyle(
        col,
        index,
        tableTheme.headerBackground
      );
      const isSortable = !!onSort;
      const isActiveSort = sortColumn === col.key;
      const isFiltered = filters && filters[col.key as string] !== undefined;

      return (
        <Animated.View
          key={col.key as string}
          style={[
            styles.headerCell,
            { width: col.width || 100 },
            col.align && {
              justifyContent:
                col.align === "right"
                  ? "flex-end"
                  : col.align === "center"
                    ? "center"
                    : "flex-start",
            },
            stickyStyle,
            headerStyle,
          ]}
        >
          <TouchableOpacity
            style={styles.headerContent}
            onPress={() => isSortable && onSort?.(col.key, "asc")}
            disabled={!isSortable}
          >
            <Text style={styles.headerText}>{col.title}</Text>
            {isActiveSort &&
              (sortDirection === "asc" ? (
                <ChevronUp size={16} color={tableTheme.text} />
              ) : (
                <ChevronDown size={16} color={tableTheme.text} />
              ))}
          </TouchableOpacity>

          {col.filterConfig && (
            <TouchableOpacity
              style={[styles.filterIcon, isFiltered && styles.filterIconActive]}
              onPress={() => setActiveFilterColumn(col.key as string)}
            >
              <ListFilter
                size={14}
                color={
                  isFiltered ? tableTheme.textInverse : tableTheme.textSecondary
                }
              />
            </TouchableOpacity>
          )}

          {activeFilterColumn === col.key && col.filterConfig && (
            <ColumnFilterModal
              visible={true}
              onClose={() => setActiveFilterColumn(null)}
              columnTitle={col.title}
              filterConfig={col.filterConfig}
              currentValue={filters?.[col.key as string]}
              onApply={(val) => {
                onFilterChange?.(col.key as string, val);
                setActiveFilterColumn(null);
              }}
              theme={tableTheme}
            />
          )}
        </Animated.View>
      );
    },
    [
      onSort,
      sortColumn,
      sortDirection,
      headerStyle,
      filters,
      activeFilterColumn,
      onFilterChange,
    ]
  );

  const renderRow = ({ item, index }: ListRenderItemInfo<T>) => {
    const isEven = index % 2 === 0;
    const isSelected = selectedIds?.has(item.id);
    const rowBgColor = isSelected
      ? tableTheme.rowSelected
      : isEven
        ? tableTheme.rowEven
        : tableTheme.rowOdd;

    return (
      <View
        style={[
          styles.row,
          { backgroundColor: rowBgColor, height: currentRowHeight },
          rowStyle,
        ]}
      >
        {enableSelection && renderCheckboxColumn("row", item, rowBgColor)}

        {columnsWithOffsets.map((col, colIndex) => {
          const stickyStyle = getStickyStyle(col, colIndex, rowBgColor);
          const isEditing =
            editingCell?.id === item.id && editingCell?.key === col.key;

          return (
            <Animated.View
              key={col.key as string}
              style={[
                styles.cellBase,
                {
                  width: col.width || 100,
                  justifyContent: getAlign(col.align),
                  height: currentRowHeight,
                },
                stickyStyle,
              ]}
            >
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={tempValue}
                  onChangeText={setTempValue}
                  onBlur={() => handleFinishEdit(item, col.key as string)}
                  onSubmitEditing={() =>
                    handleFinishEdit(item, col.key as string)
                  }
                  autoFocus
                  placeholderTextColor="#9ca3af"
                />
              ) : (
                <TouchableOpacity
                  disabled={!col.editable}
                  onPress={() =>
                    handleStartEdit(item, col.key as string, item[col.key])
                  }
                  style={{
                    flex: 1,
                    justifyContent: getAlign(col.align) || "center",
                    width: "100%",
                  }}
                >
                  {col.renderCell ? (
                    col.renderCell(item, index)
                  ) : (
                    <Text
                      style={[
                        styles.cellText,
                        col.editable && styles.editableText,
                        { textAlign: col.align || "left" },
                      ]}
                      numberOfLines={1}
                    >
                      {String(item[col.key])}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </Animated.View>
          );
        })}
      </View>
    );
  };

  const showToolbar = !!(onSearchChange && onDensityChange && onToggleColumn);

  return (
    <View style={[styles.container, containerStyle]}>
      {showToolbar && (
        <TableToolbar
          searchQuery={searchQuery || ""}
          onSearchChange={onSearchChange!}
          density={density}
          onDensityChange={onDensityChange!}
          columns={columns}
          visibleColumns={visibleColumns || []}
          onToggleColumn={onToggleColumn!}
          stickyColumns={stickyColumns}
          onToggleSticky={onToggleSticky}
          theme={tableTheme}
        />
      )}

      <View style={{ flex: 1 }}>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          bounces={false}
          scrollEventThrottle={16}
          contentContainerStyle={{ flexGrow: 1 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
        >
          <View style={{ flex: 1 }}>
            <View
              key={SCREEN_WIDTH} // Force re-render on orientation change
              style={{ width: Math.max(SCREEN_WIDTH, totalWidth), flex: 1 }}
            >
              {/* HEADER */}
              <View
                style={[
                  styles.header,
                  headerStyle,
                  { height: currentRowHeight },
                ]}
              >
                {enableSelection &&
                  renderCheckboxColumn(
                    "header",
                    undefined,
                    tableTheme.headerBackground
                  )}
                {columnsWithOffsets.map((col, index) =>
                  renderHeaderCell(col, index)
                )}
              </View>

              {/* BODY */}
              <View style={{ flex: 1, minHeight: 2 }}>
                <FlashList
                  data={data}
                  extraData={[SCREEN_WIDTH, selectedIds, editingCell]}
                  renderItem={renderRow}
                  keyExtractor={(item) => String(item.id)}
                  contentContainerStyle={styles.listContent}
                  // @ts-ignore: estimatedItemSize missing in types
                  estimatedItemSize={currentRowHeight}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>{emptyMessage}</Text>
                    </View>
                  }
                />
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </View>

      {pagination && (
        <View style={styles.paginationContainer}>
          <View style={styles.paginationLeft}>
            {/* Items Per Page Selector */}
            {pagination.itemsPerPageOptions &&
              pagination.onItemsPerPageChange && (
                <View style={styles.perPageContainer}>
                  <Text style={styles.perPageLabel}>Göster:</Text>
                  <View style={styles.perPageButtons}>
                    {pagination.itemsPerPageOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.perPageButton,
                          pagination.itemsPerPage === option &&
                            styles.perPageButtonActive,
                        ]}
                        onPress={() =>
                          pagination.onItemsPerPageChange?.(option)
                        }
                      >
                        <Text
                          style={[
                            styles.perPageButtonText,
                            pagination.itemsPerPage === option &&
                              styles.perPageButtonTextActive,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
          </View>

          <View style={styles.paginationRight}>
            <Text style={styles.pageInfo}>
              Sayfa {pagination.currentPage} / {pagination.totalPages}
            </Text>
            <View style={styles.paginationButtons}>
              <TouchableOpacity
                disabled={pagination.currentPage === 1}
                onPress={() =>
                  pagination.onPageChange(pagination.currentPage - 1)
                }
                style={[
                  styles.pageButton,
                  pagination.currentPage === 1 && styles.disabledButton,
                ]}
              >
                <ChevronLeft
                  size={20}
                  color={pagination.currentPage === 1 ? "#ccc" : "#333"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={pagination.currentPage === pagination.totalPages}
                onPress={() =>
                  pagination.onPageChange(pagination.currentPage + 1)
                }
                style={[
                  styles.pageButton,
                  pagination.currentPage === pagination.totalPages &&
                    styles.disabledButton,
                ]}
              >
                <ChevronRight
                  size={20}
                  color={
                    pagination.currentPage === pagination.totalPages
                      ? "#ccc"
                      : "#333"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: TableTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1, // Softer shadow
      shadowRadius: 12, // Larger spread
      elevation: 5,
    },
    header: {
      flexDirection: "row",
      backgroundColor: theme.headerBackground,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      alignItems: "center",
    },
    headerCell: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16, // More breathing room
      borderRightWidth: 0, // Removed vertical borders for cleaner look
      height: "100%",
      justifyContent: "space-between",
      minHeight: 56, // Slightly taller header
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      height: "100%",
      gap: 6,
    },
    filterIcon: {
      padding: 6,
      borderRadius: 6,
      backgroundColor: theme.surfaceHighlight,
    },
    filterIconActive: {
      backgroundColor: theme.primaryLight,
    },
    cellBase: {
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      borderRightWidth: 0, // Removing vertical borders
    },
    headerText: {
      fontWeight: "700",
      color: theme.headerText,
      fontSize: 13,
      textTransform: "uppercase", // Modern touch
      letterSpacing: 0.5,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    cellText: {
      fontSize: 14,
      color: theme.text,
      fontWeight: "500",
    },
    editableText: {
      color: theme.primary,
      fontWeight: "600",
    },
    stickyCheckbox: {
      width: CHECKBOX_WIDTH,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      zIndex: 101,
      borderRightWidth: 1, // Keep border for sticky separator
      borderRightColor: theme.border,
      shadowColor: "#000",
      shadowOffset: { width: 4, height: 0 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    editInput: {
      flex: 1,
      height: 36,
      padding: 0,
      borderWidth: 1.5,
      borderColor: theme.primary,
      borderRadius: 6,
      paddingHorizontal: 10,
      backgroundColor: theme.background,
      fontSize: 14,
      color: theme.text,
    },
    listContent: {
      paddingBottom: 0,
    },
    emptyContainer: {
      padding: 48,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      color: theme.textSecondary,
      fontSize: 16,
      marginTop: 12,
    },
    paginationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      backgroundColor: theme.background,
      zIndex: 200,
    },
    paginationLeft: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    paginationRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    perPageContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: theme.surfaceHighlight,
      padding: 4,
      borderRadius: 8,
    },
    perPageLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: 4,
    },
    perPageButtons: {
      flexDirection: "row",
      gap: 2,
    },
    perPageButton: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 6,
    },
    perPageButtonActive: {
      backgroundColor: theme.background,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    perPageButtonText: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    perPageButtonTextActive: {
      color: theme.primary,
      fontWeight: "700",
    },
    pageInfo: {
      fontSize: 13,
      color: theme.textSecondary,
      fontWeight: "500",
    },
    paginationButtons: {
      flexDirection: "row",
      gap: 8,
    },
    pageButton: {
      padding: 6,
      borderRadius: 8,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
    },
    disabledButton: {
      opacity: 0.4,
      backgroundColor: theme.surfaceHighlight,
    },
  });
