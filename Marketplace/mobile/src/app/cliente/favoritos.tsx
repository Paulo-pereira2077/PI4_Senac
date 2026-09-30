// Caminho do arquivo: app/cliente/favoritos.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/temas';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/productCard';
import PageBannerHeader from '@/components/PageBannerHeader';

const INITIAL_FAVORITES = [
  {
    id: '2',
    title: 'Action Figure - Goku',
    price: 'R$ 49,99',
    imageUrl: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400&q=80',
  },
  {
    id: '3',
    title: 'Quadro - Venom e Homem Aranha',
    price: 'R$ 39,99',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&q=80',
  },
  {
    id: '4',
    title: 'Action Figure - Satoru Gojo',
    price: 'R$ 119,99',
    imageUrl: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400&q=80',
  },
];

export default function FavoritosScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState(INITIAL_FAVORITES);

  const handleRemoveFavorite = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <PageBannerHeader title="Meus Favoritos" />

        {filteredItems.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              Nenhum produto salvo nos favoritos.
            </Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {filteredItems.map((item) => (
              <ProductCard
                key={item.id}
                variant="cliente"
                title={item.title}
                price={item.price}
                imageUrl={item.imageUrl}
                isFavorite
                onToggleFavorite={() => handleRemoveFavorite(item.id)}
                onAddToCart={() => router.navigate('/cliente/carrinho')}
                onPress={() =>
                  router.navigate({
                    pathname: '/cliente/produto/[id]',
                    params: { id: item.id, title: item.title, price: item.price },
                  })
                }
                style={styles.cardWidth}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <Footer variant="cliente" activeTab="settings" />
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    marginTop: theme.spacing.s,
  },
  cardWidth: {
    width: '31%',
  },
  emptyBox: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fonts.size.body,
    color: theme.colors.textSecondary,
  },
});