import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import api from '@/services/api';
import { obterUsuarioLogado } from '@/services/authService';
import Footer from '@/components/footer';
import { theme } from '@/temas';

const DASHBOARD_BASE_URL =
  process.env.EXPO_PUBLIC_DASHBOARD_URL || 'http://localhost:8501';

export default function VendedorDashboard() {
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDashboard = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const usuario = await obterUsuarioLogado();
      const token = usuario?.token || usuario?.accessToken;

      if (!token) {
        setErro('Sessão de vendedor não encontrada. Faça login novamente.');
        return;
      }

      const resposta = await api.post(
        '/api/dashboard/gerar-codigo',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const codigo = resposta.data?.codigo;
      if (!codigo) {
        setErro('Não foi possível gerar o código de acesso ao painel.');
        return;
      }

      setDashboardUrl(`${DASHBOARD_BASE_URL}/?code=${codigo}&embed=true`);
    } catch (error: any) {
      const status = error?.response?.status;
      const msgBackend =
        error?.response?.data?.error ||
        error?.response?.data?.erro ||
        error?.response?.data?.message;

      if (msgBackend) {
        setErro(`Erro ${status || ''}: ${msgBackend}`.trim());
      } else if (status) {
        setErro(`Erro HTTP ${status} ao chamar /api/dashboard/gerar-codigo.`);
      } else {
        setErro(`Falha de conexão (${error?.message || 'servidor inacessível'}).`);
      }
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDashboard();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {carregando ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.infoText}>Carregando painel administrativo...</Text>
          </View>
        ) : erro ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{erro}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={carregarDashboard}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : dashboardUrl ? (
          Platform.OS === 'web' ? (
            <iframe
              src={dashboardUrl}
              title="Dashboard Administrativo"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          ) : (
            <WebView
              source={{ uri: dashboardUrl }}
              style={styles.webview}
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
            />
          )
        ) : null}
      </View>

      <Footer variant="vendedor" activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.cardBackground,
  },
  content: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
  },
  errorText: {
    fontSize: 15,
    color: '#DC2626',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFF',
    fontWeight: '600',
  },
});