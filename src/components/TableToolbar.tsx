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
import { Search, SlidersHorizontal, Eye, X, Pin } from "lucide-react-native";
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

  // Density döngüsü: compact -> standard -> comfortable -> compact
  const cycleDensity = () => {
    const next: Record<Density, Density> = {
      compact: "standard",
      standard: "comfortable",
      comfortable: "compact",
    };
    onDensityChange(next[density]);
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
                        {/* Pin icon from Lucide would be ideal, using Eye for now as placeholder if Pin not imported, but wait, let's try to import Pin */}
                        {/* Re-using Eye temporarily isn't great. I will import Pin. */}
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
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#fff",
    gap: 12,
    alignItems: "center",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#1f2937",
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxHeight: "60%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  modalList: {
    flexGrow: 0,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  switchLabel: {
    fontSize: 16,
    color: "#374151",
  },
  switchActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pinButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#f3f4f6",
  },
  pinActive: {
    backgroundColor: "#3b82f6",
  },
});
