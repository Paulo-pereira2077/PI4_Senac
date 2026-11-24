// Caminho do arquivo: app/cliente/favoritos.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '@/temas';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/productCard';
import PageBannerHeader from '@/components/PageBannerHeader';

import { listarTodosProdutos, getImagemUrl } from '@/services/produtoService';
import { adicionarAoCarrinho } from '@/services/carrinhoService';

export default function FavoritosScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatarPreco = (valor: number) =>
    `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;

  useFocusEffect(
    useCallback(() => {
      const carregarFavoritos = async () => {
        try {
          setLoading(true);
          const [favStorage, todosProdutos] = await Promise.all([
            AsyncStorage.getItem('@MeuApp:favoritos'),
            listarTodosProdutos(),
          ]);

          const favIds: string[] = favStorage ? JSON.parse(favStorage) : [];
          const filtrados = Array.isArray(todosProdutos)
            ? todosProdutos.filter((p: any) => favIds.includes(String(p.id)))
            : [];

          setItems(filtrados);
        } catch (error) {
          console.error('Erro ao carregar favoritos:', error);
        } finally {
          setLoading(false);
        }
      };

      carregarFavoritos();
    }, [])
  );

  const handleRemoveFavorite = async (id: string) => {
    const restantes = items.filter((item) => String(item.id) !== id);
    setItems(restantes);
    const novosIds = restantes.map((item) => String(item.id));
    await AsyncStorage.setItem('@MeuApp:favoritos', JSON.stringify(novosIds));
  };

  const handleAddToCart = async (produtoId: number) => {
    await adicionarAoCarrinho(produtoId, 1).catch(() => null);
    router.navigate('/cliente/carrinho');
  };

  const filteredItems = items.filter((item) =>
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
        <PageBannerHeader title="Meus Favoritos" />

        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{ marginTop: 32 }}
          />
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              Nenhum produto salvo nos favoritos.
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.listContainer,
              isDesktop && styles.listContainerDesktop,
            ]}
          >
            {filteredItems.map((item) => {
              const idStr = String(item.id);
              const urlFoto = getImagemUrl(item.imagem_url);
              const precoFormatado = formatarPreco(item.preco_unidade);

              return (
                <ProductCard
                  key={idStr}
                  variant="cliente"
                  title={item.nome}
                  price={precoFormatado}
                  imageUrl={
                    urlFoto
                      ? { uri: urlFoto }
                      : require('@/assets/images/cubo.png')
                  }
                  style={isDesktop ? styles.desktopCardItem : undefined}
                  isFavorite
                  onToggleFavorite={() => handleRemoveFavorite(idStr)}
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
                />
              );
            })}
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
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  listContainer: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.m,
    marginTop: theme.spacing.s,
  },
  listContainerDesktop: {
    maxWidth: 960,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  desktopCardItem: {
    width: '48.8%',
  },
  emptyBox: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fonts.size.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});