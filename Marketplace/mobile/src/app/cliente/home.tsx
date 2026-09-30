// Caminho do arquivo: app/cliente/home.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '@/temas';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/productCard';

interface ProductItem {
  id: string;
  title: string;
  price: string;
  category: string;
  imageUrl: string;
}

const CATEGORIES = [
  {
    id: '3d',
    label: 'Impressão 3D',
    image: 'https://images.unsplash.com/photo-1631541909061-71e349d1f203?w=200&q=80',
  },
  {
    id: 'action',
    label: 'Action Figure',
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=200&q=80',
  },
  {
    id: 'eletro',
    label: 'Eletrodomésticos',
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=200&q=80',
  },
  {
    id: 'decor',
    label: 'Decorações',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&q=80',
  },
];

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: '1',
    title: 'Geladeira Consul',
    price: 'R$ 1.199,99',
    category: 'eletro',
    imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&q=80',
  },
  {
    id: '2',
    title: 'Action Figure - Goku',
    price: 'R$ 49,99',
    category: 'action',
    imageUrl: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400&q=80',
  },
  {
    id: '3',
    title: 'Quadro - Venom e Homem Aranha',
    price: 'R$ 39,99',
    category: 'decor',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&q=80',
  },
  {
    id: '4',
    title: 'Action Figure - Satoru Gojo',
    price: 'R$ 119,99',
    category: 'action',
    imageUrl: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400&q=80',
  },
  {
    id: '5',
    title: 'Geladeira Consul',
    price: 'R$ 1.199,99',
    category: 'eletro',
    imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&q=80',
  },
  {
    id: '6',
    title: 'Action Figure - Goku',
    price: 'R$ 49,99',
    category: 'action',
    imageUrl: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400&q=80',
  },
  {
    id: '7',
    title: 'Quadro - Venom e Homem Aranha',
    price: 'R$ 39,99',
    category: 'decor',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&q=80',
  },
  {
    id: '8',
    title: 'Action Figure - Satoru Gojo',
    price: 'R$ 119,99',
    category: 'action',
    imageUrl: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400&q=80',
  },
];

export default function ClienteHomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState<number>(1);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
    router.navigate('/cliente/carrinho');
  };

  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
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

          {/* Botão Ver Mais (...) */}
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

        {/* Grid de Produtos (4 Colunas Compactas fiéis ao layout) */}
        <View style={styles.productsGrid}>
          {filteredProducts.map((item) => (
            <ProductCard
              key={item.id}
              variant="cliente"
              title={item.title}
              price={item.price}
              imageUrl={item.imageUrl}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onAddToCart={handleAddToCart}
              onPress={() =>
                router.navigate({
                  pathname: '/cliente/produto/[id]',
                  params: { id: item.id, title: item.title, price: item.price },
                })
              }
              style={styles.gridCardItem}
            />
          ))}
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