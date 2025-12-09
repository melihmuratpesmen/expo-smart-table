export interface TableTheme {
    // Backgrounds
    background: string;
    surface: string;
    surfaceHighlight: string;

    // Headers
    headerBackground: string;
    headerText: string;

    // Rows
    rowEven: string;
    rowOdd: string;
    rowSelected: string;
    rowHover: string;

    // Borders
    border: string;

    // Text
    text: string;
    textSecondary: string;
    textInverse: string;

    // Brand / Actions
    primary: string;
    primaryLight: string;
    accent: string;

    // Status / Feedback
    success: string;
    error: string;
    warning: string;
    info: string;
}

export const lightTheme: TableTheme = {
    background: "#ffffff",
    surface: "#ffffff",
    surfaceHighlight: "#f9fafb",

    headerBackground: "#ffffff",
    headerText: "#374151",

    rowEven: "#ffffff",
    rowOdd: "#fafafa",
    rowSelected: "#eff6ff",
    rowHover: "#f3f4f6", // Add if needed specifically

    border: "#e5e7eb", // Slightly darker than f3f4f6 for better definition

    text: "#1f2937",
    textSecondary: "#6b7280",
    textInverse: "#ffffff",

    primary: "#4f46e5",
    primaryLight: "#e0e7ff",
    accent: "#8b5cf6",

    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
};

export const darkTheme: TableTheme = {
    background: "#111827", // Gray 900
    surface: "#1f2937", // Gray 800 - for Modals, Cards
    surfaceHighlight: "#374151", // Gray 700

    headerBackground: "#111827", // Match background or slightly lighter
    headerText: "#e5e7eb", // Gray 200

    rowEven: "#111827", // Gray 900
    rowOdd: "#1f2937", // Gray 800
    rowSelected: "rgba(79, 70, 229, 0.2)", // Indigo with opacity
    rowHover: "#374151", // Gray 700

    border: "#374151", // Gray 700

    text: "#f9fafb", // Gray 50
    textSecondary: "#9ca3af", // Gray 400
    textInverse: "#111827",

    primary: "#6366f1", // Indigo 500 (lighter than 600 for dark mode)
    primaryLight: "rgba(99, 102, 241, 0.2)",
    accent: "#a78bfa", // Violet 400

    success: "#34d399",
    error: "#f87171",
    warning: "#fbbf24",
    info: "#60a5fa",
};
