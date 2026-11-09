// Caminho do arquivo: app/cliente/carrinho.tsx
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
  Alert,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '@/temas';
import Header from '@/components/header';
import Footer from '@/components/footer';
import CustomInput from '@/components/input';
import PrimaryButton from '@/components/botao';
import CustomCheckbox from '@/components/customCheckbox';
import ConfirmModal from '@/components/confirmModal';
import PageBannerHeader from '@/components/PageBannerHeader';

import { listarCarrinho, removerDoCarrinho } from '@/services/carrinhoService';
import { getById, getImagemUrl } from '@/services/produtoService';
import { finalizarCompra } from '@/services/pedidoService';

interface ItemCarrinhoDetalhado {
  id: number;
  produto_id: number;
  quantidade: number;
  selecionado: boolean;
  nome: string;
  preco_unidade: number;
  imagem_url?: string;
}

export default function CarrinhoScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [itens, setItens] = useState<ItemCarrinhoDetalhado[]>([]);
  const [loading, setLoading] = useState(true);
  const [finalizando, setFinalizando] = useState(false);
  const [address, setAddress] = useState('');
  const [coupon, setCoupon] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemParaRemover, setItemParaRemover] = useState<number | null>(null);

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  const carregarCarrinho = async () => {
    try {
      setLoading(true);
      const [listaBruta, enderecoSalvo] = await Promise.all([
        listarCarrinho(),
        AsyncStorage.getItem('@MeuApp:endereco'),
      ]);

      if (enderecoSalvo) {
        const endObj = JSON.parse(enderecoSalvo);
        setAddress(`${endObj.endereco}, ${endObj.numero} - ${endObj.uf || ''}`);
      }

      if (!Array.isArray(listaBruta) || listaBruta.length === 0) {
        setItens([]);
        return;
      }

      const detalhados = await Promise.all(
        listaBruta.map(async (item: any) => {
          try {
            const prod = await getById(item.produto_id);
            return {
              id: item.id,
              produto_id: item.produto_id,
              quantidade: item.quantidade || 1,
              selecionado: true,
              nome: prod?.nome || `Produto #${item.produto_id}`,
              preco_unidade: Number(prod?.preco_unidade) || 0,
              imagem_url: prod?.imagem_url,
            };
          } catch {
            return {
              id: item.id,
              produto_id: item.produto_id,
              quantidade: item.quantidade || 1,
              selecionado: true,
              nome: `Produto #${item.produto_id}`,
              preco_unidade: 0,
            };
          }
        })
      );

      setItens(detalhados);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarCarrinho();
    }, [])
  );

  const toggleItemSelecionado = (id: number) => {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selecionado: !item.selecionado } : item
      )
    );
  };

  const cycleQuantity = (id: number) => {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantidade: item.quantidade >= 5 ? 1 : item.quantidade + 1 }
          : item
      )
    );
  };

  const solicitarRemocao = (id: number) => {
    setItemParaRemover(id);
    setIsDeleteModalVisible(true);
  };

  const confirmarRemocao = async () => {
    if (itemParaRemover === null) return;
    try {
      await removerDoCarrinho(itemParaRemover);
      setItens((prev) => prev.filter((item) => item.id !== itemParaRemover));
    } catch (error: any) {
      mostrarAlerta('Erro', error.message);
    } finally {
      setIsDeleteModalVisible(false);
      setItemParaRemover(null);
    }
  };

  const itensAtivos = itens.filter((i) => i.selecionado);
  const carrinhoVazio = itens.length === 0;

  const subtotal = itensAtivos.reduce(
    (acc, item) => acc + item.preco_unidade * item.quantidade,
    0
  );
  const shippingCost = itensAtivos.length === 0 ? 0 : 4.99;
  const discount = coupon.trim().length > 0 && itensAtivos.length > 0 ? 9.99 : 0;
  const total = Math.max(0, subtotal + shippingCost - discount);

  const totalQuantidadeBadge = itens.reduce((acc, i) => acc + i.quantidade, 0);

  const formatCurrency = (val: number) =>
    `R$ ${val.toFixed(2).replace('.', ',')}`;

  const handleFinalizarCompra = async () => {
    if (itensAtivos.length === 0 || finalizando) return;

    try {
      setFinalizando(true);

      await finalizarCompra({
        endereco_entrega_id: 1,
        total,
        metodo_pagamento: 'Cartão de Crédito',
        itens: itensAtivos.map((item) => ({
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          preco_unidade: item.preco_unidade,
        })),
      });

      // Remove do carrinho no backend os itens comprados
      await Promise.all(
        itensAtivos.map((item) => removerDoCarrinho(item.id).catch(() => null))
      );

      mostrarAlerta('Sucesso', 'Compra finalizada com sucesso!');
      router.navigate('/cliente/historico');
    } catch (error: any) {
      mostrarAlerta('Erro no Checkout', error.message);
    } finally {
      setFinalizando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        variant="cliente"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        cartBadgeCount={totalQuantidadeBadge}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PageBannerHeader title="Carrinho de Compras" />

        <View style={styles.contentPadding}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 32 }} />
          ) : !carrinhoVazio ? (
            itens.map((item) => {
              const urlFoto = getImagemUrl(item.imagem_url);
              const subtotalItem = item.preco_unidade * item.quantidade;

              return (
                <View key={item.id} style={styles.cartItemCard}>
                  <View style={styles.cartItemRow}>
                    <CustomCheckbox
                      value={item.selecionado}
                      onValueChange={() => toggleItemSelecionado(item.id)}
                      containerStyle={styles.checkboxAlign}
                    />

                    <View style={styles.productImageBox}>
                      <Image
                        source={
                          urlFoto
                            ? { uri: urlFoto }
                            : require('@/assets/images/cubo.png')
                        }
                        style={styles.productImage}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={styles.productDetailsCol}>
                      <View style={styles.titleTrashRow}>
                        <Text style={styles.productTitle} numberOfLines={2}>
                          {item.nome}
                        </Text>

                        <TouchableOpacity
                          onPress={() => solicitarRemocao(item.id)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Feather
                            name="trash-2"
                            size={16}
                            color={theme.colors.error}
                          />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={styles.quantityDropdown}
                        onPress={() => cycleQuantity(item.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.quantityText}>{item.quantidade} un.</Text>
                        <Feather
                          name="chevron-down"
                          size={14}
                          color={theme.colors.primaryLight}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.itemTotalPrice}>
                    {formatCurrency(subtotalItem)}
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyCartCard}>
              <Feather
                name="shopping-cart"
                size={32}
                color={theme.colors.textPlaceholder}
              />
              <Text style={styles.emptyCartText}>
                Seu carrinho está vazio no momento.
              </Text>
            </View>
          )}

          {/* Card de Endereço, Cupom e Resumo da Compra */}
          <View style={styles.summaryCard}>
            <CustomInput
              placeholder="Endereço"
              value={address}
              onChangeText={setAddress}
              leftIcon="map-pin"
              containerStyle={styles.compactInput}
              rightElement={
                <TouchableOpacity
                  style={styles.alterarButton}
                  onPress={() => router.navigate('/cliente/endereco')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.alterarButtonText}>Alterar</Text>
                </TouchableOpacity>
              }
            />

            <CustomInput
              placeholder="Inserir o cupom"
              value={coupon}
              onChangeText={setCoupon}
              leftIcon="tag"
              containerStyle={styles.compactInput}
            />

            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Resumo da compra</Text>

              <View style={styles.summaryLine}>
                <Text style={styles.summaryLabel}>Produto</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(subtotal)}
                </Text>
              </View>

              <View style={styles.summaryLine}>
                <Text style={styles.summaryLabel}>Frete</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(shippingCost)}
                </Text>
              </View>

              <View style={styles.summaryLine}>
                <Text style={styles.summaryLabel}>Cupom</Text>
                <Text style={styles.summaryValue}>
                  -{formatCurrency(discount)}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryLine}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
              </View>
            </View>
          </View>

          {/* Botões de Ação Principais */}
          <PrimaryButton
            title={finalizando ? 'Processando...' : 'Seguir para o pagamento'}
            variant="success"
            rounded
            disabled={itensAtivos.length === 0 || finalizando}
            onPress={handleFinalizarCompra}
            style={styles.paymentButton}
          />

          <PrimaryButton
            title="Continuar comprando"
            variant="secondary"
            rounded
            onPress={() => router.navigate('/cliente/home')}
          />
        </View>
      </ScrollView>

      <ConfirmModal
        visible={isDeleteModalVisible}
        message="Deseja remover este item do carrinho?"
        onConfirm={confirmarRemocao}
        onCancel={() => setIsDeleteModalVisible(false)}
      />

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
  contentPadding: {
    paddingHorizontal: theme.spacing.m,
  },
  cartItemCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 20,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxAlign: {
    marginTop: 4,
  },
  productImageBox: {
    width: 92,
    height: 92,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productDetailsCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleTrashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.s,
  },
  productTitle: {
    fontSize: theme.fonts.size.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weight.regular,
    flex: 1,
    marginRight: theme.spacing.s,
  },
  quantityDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 74,
  },
  quantityText: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.textPrimary,
  },
  itemTotalPrice: {
    alignSelf: 'flex-end',
    fontSize: theme.fonts.size.button,
    fontWeight: theme.fonts.weight.extraBold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.s,
  },
  emptyCartCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 20,
    padding: theme.spacing.l,
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  emptyCartText: {
    marginTop: theme.spacing.s,
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.body,
  },
  summaryCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 20,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  compactInput: {
    marginBottom: theme.spacing.s,
  },
  alterarButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.l,
    height: 44,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alterarButtonText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fonts.size.small,
    fontWeight: theme.fonts.weight.medium,
  },
  summaryBox: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    padding: theme.spacing.m,
    marginTop: theme.spacing.xs,
  },
  summaryTitle: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.textPlaceholder,
    marginBottom: theme.spacing.m,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.textPlaceholder,
  },
  summaryValue: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.s,
  },
  totalLabel: {
    fontSize: theme.fonts.size.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weight.medium,
  },
  totalValue: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weight.bold,
  },
  paymentButton: {
    marginBottom: theme.spacing.m,
  },
});