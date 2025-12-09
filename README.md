# 📊 Expo Smart Table

**Expo Smart Table** is a powerful, customizable, and high-performance table component built for React Native and Expo. It features support for sorting, filtering, selection, sticky columns, row/column reordering, dark mode, and localization.

![License](https://img.shields.io/npm/l/expo-smart-table)
![Version](https://img.shields.io/npm/v/expo-smart-table)
![Downloads](https://img.shields.io/npm/dm/expo-smart-table)

## ✨ Features

- **High Performance**: Built with `@shopify/flash-list` for handling large datasets efficiently.
- **Sorting & Filtering**: Built-in support for column sorting and advanced filtering (text, select, boolean, number range).
- **Sticky Columns**: Keep important columns visible while scrolling horizontally.
- **Drag & Drop**: Reorder rows and columns with intuitive touch gestures (powered by `react-native-reanimated` and `react-native-gesture-handler`).
- **Selection**: Multi-row selection with "Select All" capability.
- **Dark Mode**: Fully distinct Light and Dark themes, customizable via config.
- **Localization**: Full i18n support for all UI text using the `translations` prop.
- **Responsive**: Adapts to different screen sizes and orientations.

## 📦 Installation

This library relies on several peer dependencies that you must install in your project:

```bash
npm install expo-smart-table
```

### Install Peer Dependencies

You need to install the following packages to ensure everything works correctly:

```bash
npx expo install @shopify/flash-list expo-screen-orientation lucide-react-native react-native-gesture-handler react-native-reanimated react-native-svg
```

> **Note:** If you are using a bare React Native project, follow the installation instructions for each peer dependency (especially `react-native-reanimated` and `react-native-gesture-handler`).

## 🚀 Basic Usage

Here is a minimal example to get you started:

```tsx
import React from "react";
import { View } from "react-native";
import { ModernTable, useTable, Column } from "expo-smart-table";

interface User {
  id: string;
  name: string;
  role: string;
}

const data: User[] = [
  { id: "1", name: "Alice", role: "Admin" },
  { id: "2", name: "Bob", role: "User" },
];

const columns: Column<User>[] = [
  { key: "id", title: "ID", width: 50 },
  { key: "name", title: "Name", width: 150 },
  { key: "role", title: "Role", width: 100 },
];

export default function App() {
  const { paginatedData, ...tableProps } = useTable(data, columns);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ModernTable data={paginatedData} columns={columns} {...tableProps} />
    </View>
  );
}
```

## 🛠 `useTable` Hook

The `useTable` hook encapsulates the logic for sorting, filtering, and pagination.

```tsx
const {
  paginatedData, // The data slice to display for the current page
  totalPages, // Total number of pages
  currentPage, // Current page number
  setCurrentPage, // Function to change page
  searchQuery, // Current search text
  setSearchQuery, // Function to update search text
  sortConfig, // Current sort state { key, direction }
  handleSort, // Function to toggle sort order
  filters, // Current active filters
  setColumnFilter, // Function to set a specific column filter
  // ... and more
} = useTable(data, columns, itemsPerPage); // itemsPerPage defaults to 10
```

## ⚙️ Props & Configuration

### `ModernTable` Props

| Prop               | Type                         | Description                                               |
| ------------------ | ---------------------------- | --------------------------------------------------------- |
| `data`             | `T[]`                        | Array of data items to display. **Required**.             |
| `columns`          | `Column<T>[]`                | Configuration for table columns. **Required**.            |
| `theme`            | `'light' \| 'dark'`          | Sets the theme mode. Default: `'light'`.                  |
| `themeConfig`      | `Partial<TableTheme>`        | Override specific theme colors.                           |
| `enableSelection`  | `boolean`                    | Enables row selection checkboxes.                         |
| `selectionMode`    | `'select' \| 'reorder'`      | Toggle between normal selection and row reordering mode.  |
| `enableRowReorder` | `boolean`                    | Allows users to drag and reorder rows.                    |
| `onRowReorder`     | `(from, to) => void`         | Callback fired when a row is reordered.                   |
| `stickyColumns`    | `string[]`                   | Array of column keys that should stay sticky on the left. |
| `translations`     | `Partial<TableTranslations>` | Customize UI strings for localization (see below).        |

### `Column` Definition

```typescript
interface Column<T> {
  key: keyof T; // Property key in data object
  title: string; // Header display title
  width?: number; // Width in pixels
  align?: "left" | "center" | "right"; // Content alignment
  isSticky?: boolean; // If true, column is fixed to the left
  hidden?: boolean; // If true, column is hidden initially
  editable?: boolean; // (Future) Flags column as editable
  renderCell?: (item: T) => React.ReactNode; // Custom cell renderer
  filterConfig?: {
    // Configuration for the filter modal
    type: "text" | "select" | "boolean" | "number-range";
    options?: string[]; // Options for 'select' type
  };
}
```

## 🌍 Localization (Translations)

You can fully localize the table by passing a `translations` object props.

```tsx
<ModernTable
  // ...
  translations={{
    searchPlaceholder: "Ara...",
    noData: "Veri yok",
    columns: "Sütunlar",
    filter: "Filtrele",
    apply: "Uygula",
    clear: "Temizle",
    selected: "seçildi",
    all: "Tümü",
    // ... see types.ts for full list
  }}
/>
```

## 🎨 Theming

You can easily switch between light and dark modes or provide a custom color palette.

```tsx
<ModernTable
  theme="dark"
  themeConfig={{
    primary: "#FF5733", // Custom primary color
    headerBackground: "#222222",
    rowEven: "#2a2a2a",
  }}
  // ...
/>
```

## 🤝 Contributing

Contributions are welcome! Please check out the [repository](https://github.com/melihmuratpesmen/expo-smart-table) and feel free to open issues or pull requests.

## 📄 License

MIT © [melihmuratpesmen](https://github.com/melihmuratpesmen)
