// Caminho do arquivo: app/cliente/produto/[id].tsx
import React, { useState, useEffect } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '@/temas';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PrimaryButton from '@/components/botao';
import PageBannerHeader from '@/components/PageBannerHeader';

import { getById, getImagemUrl } from '@/services/produtoService';
import { adicionarAoCarrinho } from '@/services/carrinhoService';

export default function DetalheProdutoClienteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    price?: string;
  }>();

  const produtoId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [searchQuery, setSearchQuery] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [produto, setProduto] = useState<any>(null);

  const formatarPreco = (valor: number) =>
    `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;

  useEffect(() => {
    const carregarDetalhes = async () => {
      if (!produtoId) return;

      try {
        setLoading(true);
        const [dados, favStorage] = await Promise.all([
          getById(produtoId),
          AsyncStorage.getItem('@MeuApp:favoritos'),
        ]);
        setProduto(dados);

        if (favStorage) {
          const favs: string[] = JSON.parse(favStorage);
          setIsFavorite(favs.includes(String(produtoId)));
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDetalhes();
  }, [produtoId]);

  const handleToggleFavorite = async () => {
    if (!produtoId) return;
    const favStorage = await AsyncStorage.getItem('@MeuApp:favoritos');
    const favs: string[] = favStorage ? JSON.parse(favStorage) : [];
    const idStr = String(produtoId);

    const atualizados = favs.includes(idStr)
      ? favs.filter((f) => f !== idStr)
      : [...favs, idStr];

    setIsFavorite(atualizados.includes(idStr));
    await AsyncStorage.setItem('@MeuApp:favoritos', JSON.stringify(atualizados));
  };

  const handleAdicionarAoCarrinho = async () => {
    if (!produtoId) return;
    try {
      await adicionarAoCarrinho(Number(produtoId), 1);
      router.navigate('/cliente/carrinho');
    } catch (error: any) {
      if (Platform.OS === 'web') {
        window.alert(error.message);
      } else {
        Alert.alert('Erro', error.message);
      }
    }
  };

  const productTitle = produto?.nome || params.title || 'Produto';
  const productPrice =
    produto?.preco_unidade !== undefined
      ? formatarPreco(produto.preco_unidade)
      : params.price || 'R$ 0,00';
  const productDescription =
    produto?.descricao ||
    'Produto de alta qualidade enviado com embalagem reforçada e garantia total pelo Mercadinho do Povo.';
  const urlFoto = produto?.imagem_url ? getImagemUrl(produto.imagem_url) : null;

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
        <PageBannerHeader title="Detalhes do Produto" />

        <View style={styles.contentPadding}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 40 }} />
          ) : (
            <View style={styles.productCard}>
              <View style={styles.topActionsRow}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.iconCircle}
                >
                  <Feather
                    name="arrow-left"
                    size={18}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleToggleFavorite}
                  style={styles.iconCircle}
                >
                  <Feather
                    name="heart"
                    size={18}
                    color={isFavorite ? theme.colors.error : theme.colors.primary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.imagePreviewBox}>
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

              <Text style={styles.title}>{productTitle}</Text>
              <Text style={styles.price}>{productPrice}</Text>
              <Text style={styles.installments}>
                em até 12x sem juros no cartão
              </Text>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.descriptionText}>{productDescription}</Text>
            </View>
          )}

          <PrimaryButton
            title="Adicionar ao carrinho"
            variant="success"
            rounded
            onPress={handleAdicionarAoCarrinho}
            style={styles.actionBtn}
          />

          <PrimaryButton
            title="Voltar para a loja"
            variant="secondary"
            rounded
            onPress={() => router.navigate('/cliente/home')}
          />
        </View>
      </ScrollView>

      <Footer variant="cliente" activeTab="home" />
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
  productCard: {
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
  topActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewBox: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: theme.fonts.size.header,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  price: {
    fontSize: theme.fonts.size.title,
    fontWeight: theme.fonts.weight.extraBold,
    color: theme.colors.primary,
  },
  installments: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.priceGreen,
    fontWeight: theme.fonts.weight.medium,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.m,
  },
  sectionTitle: {
    fontSize: theme.fonts.size.body,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  actionBtn: {
    marginBottom: theme.spacing.m,
  },
});