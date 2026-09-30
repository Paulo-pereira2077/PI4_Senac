// Caminho do arquivo: app/cliente/historico.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '@/temas';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PrimaryButton from '@/components/botao';
import PageBannerHeader from '@/components/PageBannerHeader';

interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Entregue' | 'Em transporte' | 'Processando';
  productTitle: string;
  quantity: number;
  total: string;
  imageUrl: string;
}

const ORDERS_MOCK: OrderHistoryItem[] = [
  {
    id: 'ped-1042',
    orderNumber: '#1042',
    date: '28 Set 2026',
    status: 'Em transporte',
    productTitle: 'Action Figure - Satoru Gojo',
    quantity: 1,
    total: 'R$ 114,99',
    imageUrl: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400&q=80',
  },
  {
    id: 'ped-1019',
    orderNumber: '#1019',
    date: '15 Set 2026',
    status: 'Entregue',
    productTitle: 'Quadro - Venom e Homem Aranha',
    quantity: 2,
    total: 'R$ 79,98',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&q=80',
  },
  {
    id: 'ped-0988',
    orderNumber: '#0988',
    date: '02 Set 2026',
    status: 'Entregue',
    productTitle: 'Action Figure - Goku',
    quantity: 1,
    total: 'R$ 49,99',
    imageUrl: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400&q=80',
  },
];

export default function HistoricoComprasScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'Todos' | 'Entregue' | 'Em transporte'>('Todos');

  const filteredOrders = ORDERS_MOCK.filter((order) => {
    const matchesSearch =
      order.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedFilter === 'Todos' ? true : order.status === selectedFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: OrderHistoryItem['status']) => {
    if (status === 'Entregue') return theme.colors.success;
    if (status === 'Em transporte') return theme.colors.primary;
    return theme.colors.warning;
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

        {/* Filtros Rápidos de Status */}
        <View style={styles.filterRow}>
          {(['Todos', 'Em transporte', 'Entregue'] as const).map((tab) => {
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
                    source={{ uri: order.imageUrl }}
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
                        id: order.id,
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
                  onPress={() => router.navigate('/cliente/carrinho')}
                  style={styles.buyAgainBtn}
                  textStyle={styles.buyAgainBtnText}
                />
              </View>
            </View>
          ))}
        </View>
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