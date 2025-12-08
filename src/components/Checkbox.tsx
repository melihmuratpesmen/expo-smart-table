// components/Checkbox.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Check, Minus } from 'lucide-react-native';

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean; // Tümü seçili değil ama bazıları seçiliyse (Tire işareti)
  onPress: () => void;
}

export function Checkbox({ checked, indeterminate, onPress }: CheckboxProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        (checked || indeterminate) ? styles.active : styles.inactive
      ]}
    >
      {indeterminate ? (
        <Minus size={14} color="#fff" strokeWidth={3} />
      ) : checked ? (
        <Check size={14} color="#fff" strokeWidth={3} />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#10b981', // Tailwind Emerald-500
    borderColor: '#10b981',
  },
  inactive: {
    backgroundColor: 'transparent',
    borderColor: '#d1d5db', // Gray-300
  },
});