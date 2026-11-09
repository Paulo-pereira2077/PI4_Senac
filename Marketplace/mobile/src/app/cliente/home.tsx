// Caminho do arquivo: app/cliente/home.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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
import ProductCard from '@/components/productCard';

import { listarTodosProdutos, getImagemUrl } from '@/services/produtoService';
import { adicionarAoCarrinho, listarCarrinho } from '@/services/carrinhoService';

interface ProdutoBackend {
  id: number;
  nome: string;
  descricao: string;
  preco_unidade: number;
  imagem_url?: string;
  ativo: boolean;
}

const CATEGORIES = [
  {
    id: '3d',
    label: 'Impressão 3D',
    keywords: ['3d', 'impressão', 'cubo'],
    image: 'https://images.unsplash.com/photo-1631541909061-71e349d1f203?w=200&q=80',
  },
  {
    id: 'action',
    label: 'Action Figure',
    keywords: ['action', 'figure', 'goku', 'gojo', 'boneco'],
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=200&q=80',
  },
  {
    id: 'eletro',
    label: 'Eletrodomésticos',
    keywords: ['geladeira', 'consul', 'eletro', 'tv', 'microondas'],
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=200&q=80',
  },
  {
    id: 'decor',
    label: 'Decorações',
    keywords: ['quadro', 'decor', 'vaso', 'luminária'],
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&q=80',
  },
];

export default function ClienteHomeScreen() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<ProdutoBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);

  const formatarPreco = (valor: number) =>
    `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;

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
        ? itensCarrinho.reduce((acc: number, item: any) => acc + (Number(item.quantidade) || 1), 0)
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

  const handleAddToCart = async (produtoId: number) => {
    try {
      await adicionarAoCarrinho(produtoId, 1);
      setCartCount((prev) => prev + 1);
      router.navigate('/cliente/carrinho');
    } catch (error: any) {
      if (Platform.OS === 'web') {
        window.alert(error.message);
      } else {
        Alert.alert('Atenção', error.message);
      }
    }
  };

  const filteredProducts = produtos.filter((product) => {
    const textoProduto = `${product.nome} ${product.descricao || ''}`.toLowerCase();
    const matchesSearch = textoProduto.includes(searchQuery.toLowerCase());

    if (!selectedCategory) return matchesSearch;

    const catObj = CATEGORIES.find((c) => c.id === selectedCategory);
    if (!catObj) return matchesSearch;

    const matchesCategory = catObj.keywords.some((kw) => textoProduto.includes(kw));
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        variant="cliente"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        cartBadgeCount={cartCount}
        onSearchSubmit={() => router.navigate('/cliente/destaques')}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Promocional Principal */}
        <TouchableOpacity
          activeOpacity={0.95}
          style={styles.heroBanner}
          onPress={() => router.navigate('/cliente/destaques')}
        >
          <View style={styles.heroTopBadges}>
            <View style={styles.heroMiniBadge}>
              <Feather name="box" size={10} color={theme.colors.primary} />
              <Text style={styles.heroMiniBadgeText}>Impressão 3D</Text>
            </View>
            <View style={styles.heroMiniBadge}>
              <Feather name="smile" size={10} color={theme.colors.primary} />
              <Text style={styles.heroMiniBadgeText}>Colecionáveis e Geek</Text>
            </View>
            <View style={styles.heroMiniBadge}>
              <Feather name="tv" size={10} color={theme.colors.primary} />
              <Text style={styles.heroMiniBadgeText}>Eletrodomésticos</Text>
            </View>
            <View style={styles.heroMiniBadge}>
              <Feather name="image" size={10} color={theme.colors.primary} />
              <Text style={styles.heroMiniBadgeText}>Quadros e Decoração</Text>
            </View>
          </View>

          <View style={styles.heroMainContent}>
            <View style={styles.heroTextColumn}>
              <Text style={styles.heroSubtitle}>GRANDES</Text>
              <Text style={styles.heroTitle}>PRODUTOS</Text>
              <Text style={styles.heroSubtitle}>PARA GRANDES</Text>
              <Text style={styles.heroTitle}>HISTÓRIAS</Text>

              <View style={styles.heroCtaButton}>
                <Feather name="shopping-cart" size={10} color={theme.colors.primary} />
                <Text style={styles.heroCtaText}>COMPRE AGORA</Text>
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
              <Feather name="credit-card" size={10} color={theme.colors.primary} />
              <Text style={styles.heroGuaranteeText}>ATÉ 12X NO CARTÃO</Text>
            </View>
            <View style={styles.heroGuaranteeItem}>
              <Feather name="truck" size={10} color={theme.colors.primary} />
              <Text style={styles.heroGuaranteeText}>ENTREGA RÁPIDA</Text>
            </View>
            <View style={styles.heroGuaranteeItem}>
              <Feather name="award" size={10} color={theme.colors.primary} />
              <Text style={styles.heroGuaranteeText}>QUALIDADE GARANTIDA</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Linha de Categorias Circulares */}
        <View style={styles.categoriesContainer}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() =>
                  setSelectedCategory(isSelected ? null : cat.id)
                }
              >
                <View
                  style={[
                    styles.categoryCircle,
                    isSelected && styles.categoryCircleActive,
                  ]}
                >
                  <Image
                    source={{ uri: cat.image }}
                    style={styles.categoryImage}
                  />
                </View>
                <Text style={styles.categoryLabel} numberOfLines={1}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => router.navigate('/cliente/destaques')}
          >
            <View style={styles.categoryCircle}>
              <Feather
                name="more-horizontal"
                size={24}
                color={theme.colors.textPrimary}
              />
            </View>
            <Text style={styles.categoryLabel}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        {/* Grid de Produtos */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{ marginTop: 32 }}
          />
        ) : (
          <View style={styles.productsGrid}>
            {filteredProducts.map((item) => {
              const idStr = String(item.id);
              const urlFoto = getImagemUrl(item.imagem_url);
              const precoFormatado = formatarPreco(item.preco_unidade);

              return (
                <ProductCard
                  key={idStr}
                  variant="cliente"
                  title={item.nome}
                  price={precoFormatado}
                  imageUrl={urlFoto ? { uri: urlFoto } : require('@/assets/images/cubo.png')}
                  isFavorite={favorites.includes(idStr)}
                  onToggleFavorite={() => toggleFavorite(idStr)}
                  onAddToCart={() => handleAddToCart(item.id)}
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
                  style={styles.gridCardItem}
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
    paddingBottom: theme.spacing.l,
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
  heroTopBadges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  heroMiniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroMiniBadgeText: {
    fontSize: 8,
    color: theme.colors.textPrimary,
    marginLeft: 3,
    fontWeight: theme.fonts.weight.semiBold,
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: theme.spacing.s,
  },
  heroCtaText: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: theme.fonts.weight.bold,
    marginLeft: 4,
  },
  heroImagesCluster: {
    width: 120,
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
    justifyContent: 'space-between',
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
    fontSize: 7,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weight.bold,
    marginLeft: 3,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.s,
    marginBottom: theme.spacing.m,
  },
  categoryItem: {
    alignItems: 'center',
    width: 66,
  },
  categoryCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: theme.colors.textSecondary,
    backgroundColor: theme.colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 4,
  },
  categoryCircleActive: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  categoryImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  categoryLabel: {
    fontSize: 9,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: theme.fonts.weight.medium,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.s,
  },
  gridCardItem: {
    width: '23.5%',
  },
});