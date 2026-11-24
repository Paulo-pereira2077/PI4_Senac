// Caminho do arquivo: app/cliente/home.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '@/temas';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/productCard';

import { listarTodosProdutos, getImagemUrl } from '@/services/produtoService';
import { adicionarAoCarrinho, listarCarrinho } from '@/services/carrinhoService';

interface ProdutoBackend {
  id: number;
  nome: string;
  descricao: string;
  categoria?: string;
  preco_unidade: number;
  estoque?: number;
  imagem_url?: string;
  ativo: boolean;
  media_avaliacao?: number;
  total_avaliacoes?: number;
}

const CATEGORIAS_FILTRO = [
  { id: 'Todas', label: 'Todas', icon: 'grid' as const },
  { id: 'Eletrônicos', label: 'Eletrônicos', icon: 'cpu' as const },
  { id: 'Informática', label: 'Informática', icon: 'monitor' as const },
  { id: 'Casa e Cozinha', label: 'Casa e Cozinha', icon: 'home' as const },
  { id: 'Moda e Vestuário', label: 'Moda e Vestuário', icon: 'shopping-bag' as const },
  { id: 'Esportes e Lazer', label: 'Esportes e Lazer', icon: 'activity' as const },
  { id: 'Livros e Papelaria', label: 'Livros e Papelaria', icon: 'book-open' as const },
  { id: 'Beleza e Cuidados', label: 'Beleza e Cuidados', icon: 'smile' as const },
  { id: 'Brinquedos e Jogos', label: 'Brinquedos e Jogos', icon: 'package' as const },
  { id: 'Automotivo', label: 'Automotivo', icon: 'truck' as const },
  { id: 'Outros', label: 'Outros', icon: 'layers' as const },
];

export default function ClienteHomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [produtos, setProdutos] = useState<ProdutoBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const formatarPreco = (valor: number) =>
    `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [listaProdutos, itensCarrinho, favStorage] = await Promise.all([
        listarTodosProdutos(),
        listarCarrinho().catch(() => []),
        AsyncStorage.getItem('@MeuApp:favoritos'),
      ]);

      const ativos = Array.isArray(listaProdutos)
        ? listaProdutos.filter((p: ProdutoBackend) => p.ativo !== false)
        : [];
      setProdutos(ativos);

      const totalNoCarrinho = Array.isArray(itensCarrinho)
        ? itensCarrinho.reduce(
            (acc: number, item: any) => acc + (Number(item.quantidade) || 1),
            0
          )
        : 0;
      setCartCount(totalNoCarrinho);

      if (favStorage) {
        setFavorites(JSON.parse(favStorage));
      }
    } catch (error) {
      console.error('Erro ao carregar vitrine:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const toggleFavorite = async (id: string) => {
    const atualizados = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    setFavorites(atualizados);
    await AsyncStorage.setItem('@MeuApp:favoritos', JSON.stringify(atualizados));
  };

  const handleAddToCart = async (produto: ProdutoBackend) => {
    const estoqueDisp = Number(produto.estoque ?? 0);
    if (estoqueDisp <= 0) {
      mostrarAlerta('Esgotado', 'Este produto está sem estoque no momento.');
      return;
    }

    try {
      await adicionarAoCarrinho(produto.id, 1);
      setCartCount((prev) => prev + 1);
      setToastMsg(`"${produto.nome}" adicionado ao carrinho.`);
      setTimeout(() => setToastMsg(null), 2500);
    } catch (error: any) {
      mostrarAlerta('Atenção', error.message);
    }
  };

  const filteredProducts = produtos.filter((product) => {
    const textoProduto = `${product.nome} ${product.descricao || ''} ${
      product.categoria || ''
    }`.toLowerCase();
    const matchesSearch = textoProduto.includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todas' ||
      (product.categoria || 'Eletrônicos') === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        variant="cliente"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        cartBadgeCount={cartCount}
        onSearchSubmit={() =>
          router.navigate({
            pathname: '/cliente/destaques',
            params: {
              busca: searchQuery,
              categoria: selectedCategory,
            },
          })
        }
      />

      {toastMsg ? (
        <View style={styles.toastBanner}>
          <Feather name="check-circle" size={16} color="#FFF" />
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      ) : null}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          activeOpacity={0.95}
          style={[styles.heroBanner, isDesktop && styles.heroBannerDesktop]}
          onPress={() => router.navigate('/cliente/destaques')}
        >
          <View style={styles.heroMainContent}>
            <View style={styles.heroTextColumn}>
              <Text style={styles.heroSubtitle}>GRANDES</Text>
              <Text style={styles.heroTitle}>PRODUTOS</Text>
              <Text style={styles.heroSubtitle}>PARA GRANDES</Text>
              <Text style={styles.heroTitle}>HISTÓRIAS</Text>

              <View style={styles.heroCtaButton}>
                <Feather
                  name="shopping-cart"
                  size={12}
                  color={theme.colors.primary}
                />
                <Text style={styles.heroCtaText}>EXPLORAR CATÁLOGO</Text>
              </View>
            </View>

            <View style={styles.heroImagesCluster}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=300&q=80',
                }}
                style={styles.heroSampleImage}
              />
            </View>
          </View>

          <View style={styles.heroBottomBar}>
            <View style={styles.heroGuaranteeItem}>
              <Feather name="shield" size={10} color={theme.colors.primary} />
              <Text style={styles.heroGuaranteeText}>COMPRA SEGURA</Text>
            </View>
            <View style={styles.heroGuaranteeItem}>
              <Feather
                name="credit-card"
                size={10}
                color={theme.colors.primary}
              />
              <Text style={styles.heroGuaranteeText}>ATÉ 12X</Text>
            </View>
            <View style={styles.heroGuaranteeItem}>
              <Feather name="truck" size={10} color={theme.colors.primary} />
              <Text style={styles.heroGuaranteeText}>ENTREGA RÁPIDA</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Barra de Filtros de Categoria */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.categoriesContainer,
            isDesktop && styles.categoriesContainerDesktop,
          ]}
        >
          {CATEGORIAS_FILTRO.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <View
                  style={[
                    styles.categoryCircle,
                    isSelected && styles.categoryCircleActive,
                  ]}
                >
                  <Feather
                    name={cat.icon}
                    size={20}
                    color={isSelected ? '#FFF' : theme.colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryLabel,
                    isSelected && styles.categoryLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{ marginTop: 32 }}
          />
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Nenhum produto encontrado para este filtro.
            </Text>
            {(selectedCategory !== 'Todas' || searchQuery.trim() !== '') && (
              <TouchableOpacity
                style={styles.clearFilterBtn}
                onPress={() => {
                  setSelectedCategory('Todas');
                  setSearchQuery('');
                }}
              >
                <Text style={styles.clearFilterText}>Limpar filtros</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View
            style={[
              styles.productsList,
              isDesktop && styles.productsListDesktop,
            ]}
          >
            {filteredProducts.map((item) => {
              const idStr = String(item.id);
              const urlFoto = getImagemUrl(item.imagem_url);
              const precoFormatado = formatarPreco(item.preco_unidade);
              const estoqueDisp = Number(item.estoque ?? 0);

              return (
                <ProductCard
                  key={idStr}
                  variant="cliente"
                  title={item.nome}
                  category={item.categoria || 'Eletrônicos'}
                  stockCount={estoqueDisp}
                  outOfStock={estoqueDisp <= 0}
                  rating={item.media_avaliacao}
                  reviewCount={item.total_avaliacoes}
                  price={precoFormatado}
                  imageUrl={
                    urlFoto
                      ? { uri: urlFoto }
                      : require('@/assets/images/cubo.png')
                  }
                  style={isDesktop ? styles.desktopCardItem : undefined}
                  isFavorite={favorites.includes(idStr)}
                  onToggleFavorite={() => toggleFavorite(idStr)}
                  onAddToCart={() => handleAddToCart(item)}
                  onPress={() =>
                    router.navigate({
                      pathname: '/cliente/produto/[id]',
                      params: {
                        id: idStr,
                        title: item.nome,
                        price: precoFormatado,
                      },
                    })
                  }
                />
              );
            })}
          </View>
        )}
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
    flexGrow: 1,
    paddingBottom: theme.spacing.l,
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.success,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.m,
  },
  toastText: {
    color: '#FFF',
    fontSize: theme.fonts.size.small,
    fontWeight: theme.fonts.weight.bold,
  },
  heroBanner: {
    backgroundColor: theme.colors.primary,
    marginBottom: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.s,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  heroBannerDesktop: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    borderRadius: 16,
    marginTop: theme.spacing.m,
  },
  heroMainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.s,
  },
  heroTextColumn: {
    flex: 1,
    paddingRight: theme.spacing.s,
  },
  heroSubtitle: {
    color: theme.colors.cardBackground,
    fontSize: theme.fonts.size.small,
    fontWeight: theme.fonts.weight.semiBold,
  },
  heroTitle: {
    color: theme.colors.cardBackground,
    fontSize: theme.fonts.size.header,
    fontWeight: theme.fonts.weight.extraBold,
  },
  heroCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: theme.spacing.s,
  },
  heroCtaText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: theme.fonts.weight.bold,
    marginLeft: 5,
  },
  heroImagesCluster: {
    width: 112,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.colors.primaryLight,
  },
  heroSampleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroBottomBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 6,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.s,
    marginTop: theme.spacing.xs,
  },
  heroGuaranteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroGuaranteeText: {
    fontSize: 9,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weight.bold,
    marginLeft: 4,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.m,
    gap: 12,
  },
  categoriesContainerDesktop: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    width: 84,
  },
  categoryCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: theme.colors.primaryLight,
    backgroundColor: theme.colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryCircleActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: theme.fonts.weight.medium,
  },
  categoryLabelActive: {
    color: theme.colors.primary,
    fontWeight: theme.fonts.weight.bold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: theme.spacing.m,
    gap: 12,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.body,
    textAlign: 'center',
  },
  clearFilterBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  clearFilterText: {
    color: '#FFF',
    fontSize: theme.fonts.size.small,
    fontWeight: theme.fonts.weight.bold,
  },
  productsList: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  productsListDesktop: {
    maxWidth: 960,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  desktopCardItem: {
    width: '48.8%',
  },
});