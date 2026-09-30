// Caminho do arquivo: app/cliente/carrinho.tsx
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
import CustomInput from '@/components/input';
import PrimaryButton from '@/components/botao';
import CustomCheckbox from '@/components/customCheckbox';
import ConfirmModal from '@/components/confirmModal';
import PageBannerHeader from '@/components/PageBannerHeader';

export default function CarrinhoScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [coupon, setCoupon] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemRemoved, setItemRemoved] = useState(false);

  const unitPrice = 119.99;
  const shippingCost = itemRemoved ? 0 : 4.99;
  const discount = itemRemoved ? 0 : 9.99;
  const subtotal = itemRemoved ? 0 : unitPrice * quantity;
  const total = Math.max(0, subtotal + shippingCost - discount);

  const formatCurrency = (val: number) =>
    `R$ ${val.toFixed(2).replace('.', ',')}`;

  const cycleQuantity = () => {
    setQuantity((prev) => (prev >= 5 ? 1 : prev + 1));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        variant="cliente"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        cartBadgeCount={itemRemoved ? 0 : quantity}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PageBannerHeader title="Carrinho de Compras" />

        <View style={styles.contentPadding}>
          {/* Card do Produto no Carrinho */}
          {!itemRemoved ? (
            <View style={styles.cartItemCard}>
              <View style={styles.cartItemRow}>
                <CustomCheckbox
                  value={isItemSelected}
                  onValueChange={setIsItemSelected}
                  containerStyle={styles.checkboxAlign}
                />

                <View style={styles.productImageBox}>
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400&q=80',
                    }}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.productDetailsCol}>
                  <View style={styles.titleTrashRow}>
                    <Text style={styles.productTitle} numberOfLines={2}>
                      Action Figure -{'\n'}Satoru Gojo
                    </Text>

                    <TouchableOpacity
                      onPress={() => setIsDeleteModalVisible(true)}
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
                    onPress={cycleQuantity}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.quantityText}>{quantity} un.</Text>
                    <Feather
                      name="chevron-down"
                      size={14}
                      color={theme.colors.primaryLight}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.itemTotalPrice}>
                {formatCurrency(subtotal)}
              </Text>
            </View>
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
            title="Seguir para o pagamento"
            variant="success"
            rounded
            disabled={itemRemoved}
            onPress={() => router.navigate('/cliente/historico')}
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

      {/* Reuso do ConfirmModal existente para confirmar remoção do item */}
      <ConfirmModal
        visible={isDeleteModalVisible}
        message="Deseja remover este item do carrinho?"
        onConfirm={() => {
          setItemRemoved(true);
          setIsDeleteModalVisible(false);
        }}
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