import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking, ActivityIndicator } from 'react-native';
import { exportarRelatorio } from '../services/dashboardService';

interface AdminDashboardActionsProps {
  token: string;
}

const DASHBOARD_URL = process.env.EXPO_PUBLIC_DASHBOARD_URL || 'http://localhost:8501';

export function AdminDashboardActions({ token }: AdminDashboardActionsProps) {
  const [carregando, setCarregando] = useState<'json' | 'csv' | null>(null);

  const abrirDashboard = async () => {
    try {
      const suportado = await Linking.canOpenURL(DASHBOARD_URL);
      if (suportado) {
        await Linking.openURL(DASHBOARD_URL);
      } else {
        Alert.alert('Erro', `Não foi possível abrir o link: ${DASHBOARD_URL}`);
      }
    } catch {
      Alert.alert('Erro', 'Falha ao tentar abrir o dashboard no navegador.');
    }
  };

  const handleExportar = async (formato: 'json' | 'csv') => {
    try {
      setCarregando(formato);
      await exportarRelatorio(formato, token);
    } catch (error: any) {
      Alert.alert('Erro na exportação', error?.message || 'Não foi possível exportar os dados.');
    } finally {
      setCarregando(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Painel Administrativo e Relatórios</Text>

      {/* Botão principal: Link para o Dashboard em Python */}
      <TouchableOpacity style={styles.btnDashboard} onPress={abrirDashboard}>
        <Text style={styles.btnTexto}>Abrir Dashboard (Python)</Text>
      </TouchableOpacity>

      {/* Botões de exportação lado a lado */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btnExport, styles.btnJson]}
          onPress={() => handleExportar('json')}
          disabled={carregando !== null}
        >
          {carregando === 'json' ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.btnTexto}>Exportar JSON</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnExport, styles.btnCsv]}
          onPress={() => handleExportar('csv')}
          disabled={carregando !== null}
        >
          {carregando === 'csv' ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.btnTexto}>Exportar CSV</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginVertical: 12,
    gap: 10,
    elevation: 2,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  btnDashboard: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  btnExport: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnJson: {
    backgroundColor: '#0F766E',
  },
  btnCsv: {
    backgroundColor: '#15803D',
  },
  btnTexto: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});