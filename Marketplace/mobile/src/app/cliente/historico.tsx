// Caminho do arquivo: app/cliente/historico.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { theme } from '@/temas';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PrimaryButton from '@/components/botao';
import PageBannerHeader from '@/components/PageBannerHeader';

import { listarHistoricoCliente, listarItensPedido } from '@/services/pedidoService';
import { listarTodosProdutos, getImagemUrl } from '@/services/produtoService';
import { adicionarAoCarrinho } from '@/services/carrinhoService';

interface OrderHistoryItem {
  id: string;
  productId?: number;
  orderNumber: string;
  date: string;
  status: string;
  productTitle: string;
  quantity: number;
  total: string;
  imageUrl: string | null;
}

export default function HistoricoComprasScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'Todos' | 'Aprovado' | 'Entregue'>('Todos');

  const formatarData = (isoDate?: string) => {
    if (!isoDate) return 'Recente';
    const d = new Date(isoDate);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatarPreco = (valor: number) =>
    `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;

  useFocusEffect(
    useCallback(() => {
      const carregarHistorico = async () => {
        try {
          setLoading(true);
          const [pedidos, todosItens, todosProdutos] = await Promise.all([
            listarHistoricoCliente(),
            listarItensPedido(),
            listarTodosProdutos().catch(() => []),
          ]);

          const mapaProdutos = new Map<number, any>();
          if (Array.isArray(todosProdutos)) {
            todosProdutos.forEach((p: any) => mapaProdutos.set(Number(p.id), p));
          }

          const formatados: OrderHistoryItem[] = (Array.isArray(pedidos) ? pedidos : []).map(
            (ped: any) => {
              const itensDoPedido = Array.isArray(todosItens)
                ? todosItens.filter((ip: any) => Number(ip.pedido_id) === Number(ped.id))
                : [];

              const primeiroItem = itensDoPedido[0];
              const produtoInfo = primeiroItem
                ? mapaProdutos.get(Number(primeiroItem.produto_id))
                : null;

              const qtdTotal =
                itensDoPedido.reduce((acc: number, i: any) => acc + (Number(i.quantidade) || 1), 0) || 1;

              const nomeExibicao = produtoInfo
                ? itensDoPedido.length > 1
                  ? `${produtoInfo.nome} (+${itensDoPedido.length - 1} item)`
                  : produtoInfo.nome
                : `Pedido #${ped.id}`;

              return {
                id: String(ped.id),
                productId: produtoInfo?.id || primeiroItem?.produto_id,
                orderNumber: `#${ped.id}`,
                date: formatarData(ped.createdAt),
                status: ped.status || 'Aprovado',
                productTitle: nomeExibicao,
                quantity: qtdTotal,
                total: formatarPreco(ped.total),
                imageUrl: produtoInfo?.imagem_url ? getImagemUrl(produtoInfo.imagem_url) : null,
              };
            }
          );

          setOrders(formatados);
        } catch (error) {
          console.error('Erro ao buscar histórico de compras:', error);
        } finally {
          setLoading(false);
        }
      };

      carregarHistorico();
    }, [])
  );

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedFilter === 'Todos' ? true : order.status === selectedFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    if (status === 'Entregue' || status === 'Aprovado') return theme.colors.success;
    if (status === 'Em transporte') return theme.colors.primary;
    return theme.colors.warning;
  };

  const handleComprarNovamente = async (productId?: number) => {
    if (productId) {
      await adicionarAoCarrinho(productId, 1).catch(() => null);
    }
    router.navigate('/cliente/carrinho');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        variant="cliente"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PageBannerHeader title="Histórico de Compras" />

        <View style={styles.filterRow}>
          {(['Todos', 'Aprovado', 'Entregue'] as const).map((tab) => {
            const active = selectedFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setSelectedFilter(tab)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 32 }} />
        ) : (
          <View style={styles.listWrapper}>
            {filteredOrders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderIdGroup}>
                    <Feather
                      name="package"
                      size={16}
                      color={theme.colors.iconPurple}
                    />
                    <Text style={styles.orderNumberText}>
                      Pedido {order.orderNumber}
                    </Text>
                    <Text style={styles.orderDateText}>• {order.date}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      { borderColor: getStatusColor(order.status) },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(order.status) },
                      ]}
                    >
                      {order.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderBody}>
                  <View style={styles.orderImageBox}>
                    <Image
                      source={
                        order.imageUrl
                          ? { uri: order.imageUrl }
                          : require('@/assets/images/cubo.png')
                      }
                      style={styles.orderImage}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={styles.orderInfoCol}>
                    <Text style={styles.orderProductTitle} numberOfLines={2}>
                      {order.productTitle}
                    </Text>
                    <Text style={styles.orderQuantityText}>
                      Quantidade: {order.quantity} un.
                    </Text>
                    <Text style={styles.orderTotalText}>
                      Total: {order.total}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderFooterActions}>
                  <TouchableOpacity
                    style={styles.detailsOutlineBtn}
                    onPress={() =>
                      router.navigate({
                        pathname: '/cliente/produto/[id]',
                        params: {
                          id: String(order.productId || order.id),
                          title: order.productTitle,
                          price: order.total,
                        },
                      })
                    }
                  >
                    <Text style={styles.detailsOutlineText}>Ver produto</Text>
                  </TouchableOpacity>

                  <PrimaryButton
                    title="Comprar novamente"
                    variant="success"
                    rounded
                    onPress={() => handleComprarNovamente(order.productId)}
                    style={styles.buyAgainBtn}
                    textStyle={styles.buyAgainBtnText}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Footer variant="cliente" activeTab="orders" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.cardBackground,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.s,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weight.medium,
  },
  filterChipTextActive: {
    color: theme.colors.cardBackground,
    fontWeight: theme.fonts.weight.bold,
  },
  listWrapper: {
    paddingHorizontal: theme.spacing.m,
  },
  orderCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 20,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.s,
    marginBottom: theme.spacing.m,
  },
  orderIdGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderNumberText: {
    fontSize: theme.fonts.size.small,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.textPrimary,
    marginLeft: 6,
  },
  orderDateText: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: theme.fonts.weight.bold,
  },
  orderBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  orderImageBox: {
    width: 72,
    height: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  orderImage: {
    width: '100%',
    height: '100%',
  },
  orderInfoCol: {
    flex: 1,
  },
  orderProductTitle: {
    fontSize: theme.fonts.size.body,
    fontWeight: theme.fonts.weight.semiBold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  orderQuantityText: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  orderTotalText: {
    fontSize: theme.fonts.size.body,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.primary,
  },
  orderFooterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsOutlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 24,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: theme.spacing.s,
  },
  detailsOutlineText: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weight.bold,
  },
  buyAgainBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.s,
  },
  buyAgainBtnText: {
    fontSize: theme.fonts.size.small,
  },
});