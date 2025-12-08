import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { X, Check } from "lucide-react-native";
import { FilterConfig } from "../Table.types";

interface ColumnFilterModalProps {
  visible: boolean;
  onClose: () => void;
  columnTitle: string;
  filterConfig: FilterConfig;
  currentValue: any;
  onApply: (value: any) => void;
}

export function ColumnFilterModal({
  visible,
  onClose,
  columnTitle,
  filterConfig,
  currentValue,
  onApply,
}: ColumnFilterModalProps) {
  const [tempValue, setTempValue] = useState<any>(currentValue);

  // Modal açıldığında değeri senkronize et
  useEffect(() => {
    setTempValue(currentValue);
  }, [visible, currentValue]);

  const handleApply = () => {
    onApply(tempValue);
    onClose();
  };

  const cleanFilter = () => {
    onApply(undefined);
    onClose();
  };

  const renderFilterInput = () => {
    switch (filterConfig.type) {
      case "text":
        return (
          <TextInput
            style={styles.input}
            placeholder="Ara..."
            value={tempValue || ""}
            onChangeText={setTempValue}
            autoFocus
          />
        );

      case "select":
        return (
          <ScrollView style={styles.optionsList}>
            <TouchableOpacity
              style={[styles.optionItem, !tempValue && styles.optionItemActive]}
              onPress={() => setTempValue(undefined)}
            >
              <Text
                style={[
                  styles.optionText,
                  !tempValue && styles.optionTextActive,
                ]}
              >
                Tümü
              </Text>
              {!tempValue && <Check size={16} color="white" />}
            </TouchableOpacity>

            {filterConfig.options?.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionItem,
                  tempValue === option && styles.optionItemActive,
                ]}
                onPress={() =>
                  setTempValue(option === tempValue ? undefined : option)
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    tempValue === option && styles.optionTextActive,
                  ]}
                >
                  {option}
                </Text>
                {tempValue === option && <Check size={16} color="white" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case "boolean":
        return (
          <View style={styles.booleanContainer}>
            <TouchableOpacity
              style={[
                styles.booleanButton,
                tempValue === true && styles.booleanButtonActive,
              ]}
              onPress={() => setTempValue(true)}
            >
              <Text
                style={[
                  styles.booleanText,
                  tempValue === true && styles.booleanTextActive,
                ]}
              >
                Evet / Aktif
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.booleanButton,
                tempValue === false && styles.booleanButtonActive,
              ]}
              onPress={() => setTempValue(false)}
            >
              <Text
                style={[
                  styles.booleanText,
                  tempValue === false && styles.booleanTextActive,
                ]}
              >
                Hayır / Pasif
              </Text>
            </TouchableOpacity>
          </View>
        );

      case "number-range":
        return (
          <View style={styles.rangeContainer}>
            <View style={styles.rangeInputWrapper}>
              <Text style={styles.rangeLabel}>Min</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={
                  tempValue?.min !== undefined ? String(tempValue.min) : ""
                }
                onChangeText={(text) =>
                  setTempValue({
                    ...tempValue,
                    min: text ? Number(text) : undefined,
                  })
                }
              />
            </View>
            <View style={styles.rangeInputWrapper}>
              <Text style={styles.rangeLabel}>Max</Text>
              <TextInput
                style={styles.input}
                placeholder="100"
                keyboardType="numeric"
                value={
                  tempValue?.max !== undefined ? String(tempValue.max) : ""
                }
                onChangeText={(text) =>
                  setTempValue({
                    ...tempValue,
                    max: text ? Number(text) : undefined,
                  })
                }
              />
            </View>
          </View>
        );

      default:
        return <Text>Bilinmeyen filtre tipi</Text>;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{columnTitle} Filtrele</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>{renderFilterInput()}</View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButton} onPress={cleanFilter}>
              <Text style={styles.clearButtonText}>Temizle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Uygula</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  body: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  optionsList: {
    maxHeight: 200,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  optionItemActive: {
    backgroundColor: "#3b82f6",
    borderRadius: 6,
    borderBottomWidth: 0,
    marginVertical: 2,
  },
  optionText: {
    fontSize: 14,
    color: "#374151",
  },
  optionTextActive: {
    color: "white",
    fontWeight: "600",
  },
  booleanContainer: {
    flexDirection: "row",
    gap: 12,
  },
  booleanButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    alignItems: "center",
  },
  booleanButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  booleanText: {
    color: "#374151",
    fontWeight: "500",
  },
  booleanTextActive: {
    color: "white",
  },
  rangeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  rangeInputWrapper: {
    flex: 1,
  },
  rangeLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  clearButtonText: {
    color: "#6b7280",
    fontWeight: "500",
  },
  applyButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
