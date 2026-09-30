// Caminho do arquivo: app/cliente/destaques.tsx
import React, { useState } from 'react';
import {
  View,
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

const FEATURED_PRODUCTS = [
  {
    id: '1',
    title: 'Geladeira Consul',
    price: 'R$ 1.199,99',
    imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&q=80',
  },
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
    title: 'Geladeira Consul',
    price: 'R$ 1.199,99',
    imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&q=80',
  },
  {
    id: '5',
    title: 'Action Figure - Goku',
    price: 'R$ 49,99',
    imageUrl: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400&q=80',
  },
  {
    id: '6',
    title: 'Quadro - Venom e Homem Aranha',
    price: 'R$ 39,99',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&q=80',
  },
  {
    id: '7',
    title: 'Geladeira Consul',
    price: 'R$ 1.199,99',
    imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&q=80',
  },
  {
    id: '8',
    title: 'Action Figure - Goku',
    price: 'R$ 49,99',
    imageUrl: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400&q=80',
  },
  {
    id: '9',
    title: 'Quadro - Venom e Homem Aranha',
    price: 'R$ 39,99',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&q=80',
  },
];

export default function DestaquesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>('6'); // Destaca o card conforme a referência visual
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredProducts = FEATURED_PRODUCTS.filter((item) =>
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
        <PageBannerHeader title="Destaque" />

        <View style={styles.gridContainer}>
          {filteredProducts.map((item) => (
            <ProductCard
              key={item.id}
              variant="cliente"
              title={item.title}
              price={item.price}
              imageUrl={item.imageUrl}
              isSelected={selectedId === item.id}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onPress={() => setSelectedId(item.id)}
              onAddToCart={() => router.navigate('/cliente/carrinho')}
              style={styles.cardWidth}
            />
          ))}
        </View>
      </ScrollView>

      <Footer variant="cliente" activeTab="search" />
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    marginTop: theme.spacing.xs,
  },
  cardWidth: {
    width: '31%',
    marginBottom: theme.spacing.l,
  },
});