import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Switch,
} from "react-native";
import {
  Search,
  SlidersHorizontal,
  Eye,
  X,
  Pin,
  Maximize2,
  Minimize2,
} from "lucide-react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { Density, Column } from "../Table.types";

interface TableToolbarProps<T> {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  density: Density;
  onDensityChange: (d: Density) => void;
  columns: Column<T>[];
  visibleColumns: string[];
  onToggleColumn: (key: string) => void;
  stickyColumns?: string[];
  onToggleSticky?: (key: string) => void;
}

export function TableToolbar<T>({
  searchQuery,
  onSearchChange,
  density,
  onDensityChange,
  columns,
  visibleColumns,
  onToggleColumn,
  stickyColumns,
  onToggleSticky,
}: TableToolbarProps<T>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Density döngüsü: compact -> standard -> comfortable -> compact
  const cycleDensity = () => {
    const next: Record<Density, Density> = {
      compact: "standard",
      standard: "comfortable",
      comfortable: "compact",
    };
    onDensityChange(next[density]);
  };

  const toggleFullscreen = async () => {
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <View style={styles.container}>
      {/* ARAMA ÇUBUĞU */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Ara..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>

      {/* AKSİYON BUTONLARI */}
      <View style={styles.actions}>
        {/* Fullscreen Toggle */}
        <TouchableOpacity
          onPress={toggleFullscreen}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          {isFullscreen ? (
            <Minimize2 size={20} color="#374151" />
          ) : (
            <Maximize2 size={20} color="#374151" />
          )}
        </TouchableOpacity>

        {/* Density Toggle */}
        <TouchableOpacity
          onPress={cycleDensity}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <SlidersHorizontal size={20} color="#374151" />
        </TouchableOpacity>

        {/* Column Visibility Toggle */}
        <TouchableOpacity
          onPress={() => setIsMenuOpen(true)}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Eye size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* SÜTUN GİZLEME MODALI */}
      <Modal
        visible={isMenuOpen}
        transparent
        animationType="fade"
        supportedOrientations={["portrait", "landscape"]}
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sütun Görünümü</Text>
              <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                <X size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {columns.map((col) => (
                <View key={col.key as string} style={styles.switchRow}>
                  <Text style={styles.switchLabel}>{col.title}</Text>

                  <View style={styles.switchActions}>
                    {/* Sticky Toggle with Pin Icon */}
                    {onToggleSticky && (
                      <TouchableOpacity
                        onPress={() => onToggleSticky(col.key as string)}
                        style={[
                          styles.pinButton,
                          stickyColumns?.includes(col.key as string) &&
                            styles.pinActive,
                        ]}
                      >
                        <Pin
                          size={18}
                          color={
                            stickyColumns?.includes(col.key as string)
                              ? "white"
                              : "#6b7280"
                          }
                        />
                      </TouchableOpacity>
                    )}

                    <Switch
                      value={visibleColumns.includes(col.key as string)}
                      onValueChange={() => onToggleColumn(col.key as string)}
                      trackColor={{ false: "#e5e7eb", true: "#d1fae5" }}
                      thumbColor={
                        visibleColumns.includes(col.key as string)
                          ? "#10b981"
                          : "#f4f3f4"
                      }
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#ffffff",
    gap: 12,
    alignItems: "center",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb", // Lighter background
    borderRadius: 12, // Improved rounded corners
    borderWidth: 1,
    borderColor: "transparent", // Cleaner look
    paddingHorizontal: 12,
    height: 44, // Taller touch target
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#1f2937",
    fontSize: 14,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#f3f4f6", // Subtle border
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.4)", // Darker, smoother overlay
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: "#ffffff",
    borderRadius: 24, // Much rounder
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20, // Hero shadow
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
  },
  modalList: {
    flexGrow: 0,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
  switchActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pinButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  pinActive: {
    backgroundColor: "#4f46e5", // Indigo 600
  },
});
