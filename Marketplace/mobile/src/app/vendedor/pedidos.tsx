import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { theme } from '@/temas';

import Header from '@/components/header';
import Footer from '@/components/footer';
import {
  listarPedidosVendedor,
  atualizarStatusPedido,
} from '@/services/pedidoService';

interface ItemPedidoVendedor {
  id: number;
  produto_id: number;
  nome_produto: string;
  imagem_url?: string | null;
  quantidade: number;
  preco_uni: number;
}

interface PedidoVendedor {
  id: number;
  cliente_id: number;
  cliente_nome: string;
  cliente_email: string;
  total: number;
  status: string;
  metodo_pagamento?: string;
  createdAt: string;
  itens: ItemPedidoVendedor[];
}

const FILTROS_STATUS = [
  'Todos',
  'Pendente',
  'Aprovado',
  'Em separação',
  'Enviado',
  'Entregue',
  'Cancelado',
];

const PROXIMO_STATUS: Record<string, string | null> = {
  Pendente: 'Aprovado',
  Aprovado: 'Em separação',
  'Em separação': 'Enviado',
  Enviado: 'Entregue',
  Entregue: null,
  Cancelado: null,
  Recusado: null,
};

export default function PedidosVendedorScreen() {
  const [pedidos, setPedidos] = useState<PedidoVendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const data = await listarPedidosVendedor();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (error: any) {
      mostrarAlerta('Erro', error.message || 'Não foi possível carregar os pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarPedidos();
    }, [])
  );

  const handleAlterarStatus = async (pedidoId: number, novoStatus: string) => {
    const executar = async () => {
      try {
        setAtualizandoId(pedidoId);
        await atualizarStatusPedido(pedidoId, novoStatus);
        setPedidos((prev) =>
          prev.map((p) => (p.id === pedidoId ? { ...p, status: novoStatus } : p))
        );
      } catch (error: any) {
        mostrarAlerta('Erro', error.message || 'Não foi possível atualizar o status.');
      } finally {
        setAtualizandoId(null);
      }
    };

    if (novoStatus === 'Cancelado') {
      if (Platform.OS === 'web') {
        if (window.confirm('Deseja cancelar este pedido? O estoque será devolvido automaticamente.')) {
          executar();
        }
      } else {
        Alert.alert(
          'Cancelar pedido',
          'Deseja cancelar este pedido? O estoque será devolvido automaticamente.',
          [
            { text: 'Não', style: 'cancel' },
            { text: 'Sim, cancelar', style: 'destructive', onPress: executar },
          ]
        );
      }
      return;
    }

    executar();
  };

  const getCorStatus = (status: string) => {
    switch (status) {
      case 'Aprovado':
      case 'Entregue':
        return theme.colors.success;
      case 'Em separação':
      case 'Enviado':
        return theme.colors.primary;
      case 'Pendente':
        return theme.colors.warning;
      case 'Cancelado':
      case 'Recusado':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatarPreco = (valor: number) =>
    `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;

  const formatarData = (dataISO: string) => {
    if (!dataISO) return '';
    const d = new Date(dataISO);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const bateStatus = filtroStatus === 'Todos' || pedido.status === filtroStatus;
    const termo = searchQuery.trim().toLowerCase();
    if (!termo) return bateStatus;

    const bateBusca =
      String(pedido.id).includes(termo) ||
      pedido.cliente_nome.toLowerCase().includes(termo) ||
      pedido.itens.some((i) => i.nome_produto.toLowerCase().includes(termo));

    return bateStatus && bateBusca;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuPress={() => console.log('Menu')}
          onProfilePress={() => console.log('Perfil')}
        />

        <Text style={styles.sectionTitle}>Pedidos Recebidos</Text>

        {/* Filtros de status */}
        <View style={styles.filtrosWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FILTROS_STATUS.map((status) => {
              const ativo = filtroStatus === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[styles.filtroChip, ativo && styles.filtroChipAtivo]}
                  onPress={() => setFiltroStatus(status)}
                >
                  <Text style={[styles.filtroText, ativo && styles.filtroTextAtivo]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primaryLight}
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={pedidosFiltrados}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum pedido encontrado.</Text>
            }
            renderItem={({ item }) => {
              const proximo = PROXIMO_STATUS[item.status];
              const podeCancelar = !['Entregue', 'Cancelado', 'Recusado'].includes(
                item.status
              );
              const isUpdating = atualizandoId === item.id;

              return (
                <View style={styles.card}>
                  {/* Cabeçalho do pedido */}
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.pedidoId}>Pedido #{item.id}</Text>
                      <Text style={styles.dataText}>{formatarData(item.createdAt)}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getCorStatus(item.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                  </View>

                  {/* Cliente */}
                  <View style={styles.clienteRow}>
                    <Feather name="user" size={14} color={theme.colors.textSecondary} />
                    <Text style={styles.clienteText}>
                      {item.cliente_nome}
                      {item.cliente_email ? ` (${item.cliente_email})` : ''}
                    </Text>
                  </View>

                  {/* Itens */}
                  <View style={styles.itensBox}>
                    {item.itens.map((prod) => (
                      <View key={prod.id} style={styles.itemRow}>
                        <Text style={styles.itemNome} numberOfLines={1}>
                          {prod.quantidade}x {prod.nome_produto}
                        </Text>
                        <Text style={styles.itemPreco}>
                          {formatarPreco(prod.preco_uni * prod.quantidade)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Total e Pagamento */}
                  <View style={styles.totalRow}>
                    <Text style={styles.pagamentoText}>
                      {item.metodo_pagamento || 'Mercado Pago'}
                    </Text>
                    <Text style={styles.totalText}>
                      Total: {formatarPreco(item.total)}
                    </Text>
                  </View>

                  {/* Ações */}
                  {(proximo || podeCancelar) && (
                    <View style={styles.actionsRow}>
                      {proximo && (
                        <TouchableOpacity
                          style={styles.advanceButton}
                          disabled={isUpdating}
                          onPress={() => handleAlterarStatus(item.id, proximo)}
                        >
                          {isUpdating ? (
                            <ActivityIndicator size="small" color="#FFF" />
                          ) : (
                            <>
                              <Feather name="check-circle" size={16} color="#FFF" />
                              <Text style={styles.advanceButtonText}>
                                Marcar como "{proximo}"
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      )}

                      {podeCancelar && (
                        <TouchableOpacity
                          style={styles.cancelButton}
                          disabled={isUpdating}
                          onPress={() => handleAlterarStatus(item.id, 'Cancelado')}
                        >
                          <Feather name="x-circle" size={16} color={theme.colors.error} />
                          <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              );
            }}
          />
        )}
      </View>

      <Footer variant="vendedor" activeTab="orders" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
  },
  sectionTitle: {
    fontSize: theme.fonts.size.title,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.primaryLight,
    textAlign: 'center',
    marginBottom: theme.spacing.s,
  },
  filtrosWrapper: {
    marginBottom: theme.spacing.m,
  },
  filtroChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 8,
  },
  filtroChipAtivo: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primaryLight,
  },
  filtroText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  filtroTextAtivo: {
    color: '#FFF',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  pedidoId: {
    fontSize: 16,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.textPrimary,
  },
  dataText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  clienteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  clienteText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  itensBox: {
    backgroundColor: theme.colors.surfaceGray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    gap: 6,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemNome: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  itemPreco: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  pagamentoText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  totalText: {
    fontSize: 15,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.priceGreen,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  advanceButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  advanceButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.error,
    backgroundColor: '#FFF',
  },
  cancelButtonText: {
    color: theme.colors.error,
    fontSize: 13,
    fontWeight: '700',
  },
});