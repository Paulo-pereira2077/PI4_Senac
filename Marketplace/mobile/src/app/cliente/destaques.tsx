// Caminho do arquivo: app/cliente/destaques.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '@/temas';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/productCard';
import PageBannerHeader from '@/components/PageBannerHeader';

import { listarTodosProdutos, getImagemUrl } from '@/services/produtoService';
import { adicionarAoCarrinho } from '@/services/carrinhoService';

export default function DestaquesScreen() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const formatarPreco = (valor: number) =>
    `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        try {
          setLoading(true);
          const [lista, favStorage] = await Promise.all([
            listarTodosProdutos(),
            AsyncStorage.getItem('@MeuApp:favoritos'),
          ]);

          const ativos = Array.isArray(lista)
            ? lista.filter((p) => p.ativo !== false)
            : [];
          setProdutos(ativos);

          if (favStorage) {
            setFavorites(JSON.parse(favStorage));
          }
        } catch (error) {
          console.error('Erro ao carregar destaques:', error);
        } finally {
          setLoading(false);
        }
      };

      carregar();
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
      router.navigate('/cliente/carrinho');
    } catch (error: any) {
      if (Platform.OS === 'web') {
        window.alert(error.message);
      } else {
        Alert.alert('Erro', error.message);
      }
    }
  };

  const filteredProducts = produtos.filter((item) =>
    String(item.nome || '').toLowerCase().includes(searchQuery.toLowerCase())
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

        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{ marginTop: 32 }}
          />
        ) : (
          <View style={styles.gridContainer}>
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
                  isSelected={selectedId === idStr}
                  isFavorite={favorites.includes(idStr)}
                  onToggleFavorite={() => toggleFavorite(idStr)}
                  onPress={() => {
                    setSelectedId(idStr);
                    router.navigate({
                      pathname: '/cliente/produto/[id]',
                      params: { id: idStr, title: item.nome, price: precoFormatado },
                    });
                  }}
                  onAddToCart={() => handleAddToCart(item.id)}
                  style={styles.cardWidth}
                />
              );
            })}
          </View>
        )}
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