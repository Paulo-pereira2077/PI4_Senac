import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/temas';

interface ConfirmModalProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({ 
  visible, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Sim", 
  cancelText = "Não" 
}: ConfirmModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.buttonRow}>
            {/* Botão de Confirmar (Sim) - Borda Verde */}
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            {/* Botão de Cancelar (Não) - Fundo Laranja */}
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
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
    backgroundColor: theme.colors.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalContainer: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 24,
    padding: theme.spacing.l,
    width: '100%',
    alignItems: 'center',
  },
  message: {
    fontSize: theme.fonts.size.title,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.success,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: theme.colors.success,
    fontWeight: theme.fonts.weight.bold,
    fontSize: theme.fonts.size.body,
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.m,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.danger,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.cardBackground,
    fontWeight: theme.fonts.weight.bold,
    fontSize: theme.fonts.size.body,
  },
});