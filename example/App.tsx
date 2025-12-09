import React from "react";
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { ModernTable, useTable, Column } from "expo-smart-table";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock Data Type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
}

// Mock Data
const MOCK_DATA: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Editor" : "Viewer",
  status: i % 2 === 0 ? "active" : "inactive",
  lastLogin: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    .toISOString()
    .split("T")[0],
}));

export default function App() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const columns: Column<User>[] = [
    {
      key: "id",
      title: "ID",
      width: 60,
      align: "center",
      isSticky: true,
    },
    {
      key: "name",
      title: "Name",
      width: 150,
      isSticky: false,
      editable: true,
      filterConfig: { type: "text" },
    },
    {
      key: "email",
      title: "Email",
      width: 220,
      editable: true,
      filterConfig: { type: "text" },
    },
    {
      key: "role",
      title: "Role",
      width: 100,
      filterConfig: {
        type: "select",
        options: ["Admin", "Editor", "Viewer"],
      },
    },
    {
      key: "status",
      title: "Status",
      width: 120,
      filterConfig: { type: "select", options: ["active", "inactive"] },
      renderCell: (item) => (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: item.status === "active" ? "#d1fae5" : "#f3f4f6",
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: item.status === "active" ? "#065f46" : "#374151" },
            ]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>
      ),
    },
    { key: "lastLogin", title: "Last Login", width: 120, align: "right" },
  ];

  const {
    paginatedData,
    totalPages,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    sortConfig,
    handleSort,
    selectedIds,
    toggleSelection,
    toggleAllSelection,
    isAllSelected,
    density,
    setDensity,
    visibleColumns,
    toggleColumnVisibility,
    stickyColumns,
    toggleStickyColumn,
    itemsPerPage,
    setItemsPerPage,
    filters,
    setColumnFilter,
  } = useTable(MOCK_DATA, columns, 10);

  // Theme State
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  return (
    <SafeAreaView
      style={[
        styles.container,
        theme === "dark" && { backgroundColor: "#111827" },
      ]}
      edges={["top", "left", "right"]}
    >
      <View
        style={[
          styles.contentContainer,
          {
            paddingHorizontal: isLandscape ? 0 : 16,
            paddingTop: 24,
            paddingBottom: 0,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            paddingHorizontal: isLandscape ? 16 : 0,
          }}
        >
          <Text
            style={[
              styles.title,
              theme === "dark" && { color: "#f9fafb" },
              { marginBottom: 0 },
            ]}
          >
            Expo Smart Table
          </Text>
          <TouchableOpacity
            style={{
              padding: 8,
              backgroundColor: theme === "dark" ? "#374151" : "#e5e7eb",
              borderRadius: 8,
            }}
            onPress={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Text
              style={{
                fontWeight: "600",
                color: theme === "dark" ? "#f9fafb" : "#1f2937",
              }}
            >
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </Text>
          </TouchableOpacity>
        </View>

        <ModernTable
          key={theme} // Force re-render on theme change
          theme={theme}
          data={paginatedData}
          columns={columns}
          filters={filters}
          onFilterChange={setColumnFilter}
          // Sorting
          onSort={handleSort}
          sortColumn={sortConfig.key as keyof User}
          sortDirection={sortConfig.direction}
          // Pagination
          pagination={{
            currentPage,
            totalPages,
            itemsPerPage,
            onPageChange: setCurrentPage,
            itemsPerPageOptions: [5, 10, 20, 50],
            onItemsPerPageChange: setItemsPerPage,
          }}
          // Toolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          density={density}
          onDensityChange={setDensity}
          visibleColumns={visibleColumns}
          onToggleColumn={toggleColumnVisibility}
          stickyColumns={stickyColumns}
          onToggleSticky={toggleStickyColumn}
          // Selection
          enableSelection
          selectedIds={selectedIds}
          onToggleOne={toggleSelection}
          onToggleAll={toggleAllSelection}
          isAllSelected={isAllSelected}
          // Editing
          onRowChange={(newItem) => {
            console.log("Updated Item:", newItem);
            // In a real app, you would update your state here
          }}
          containerStyle={styles.tableContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111827",
  },
  tableContainer: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
