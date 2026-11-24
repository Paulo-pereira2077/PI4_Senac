// Caminho do arquivo: app/cliente/destaques.tsx
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '@/temas';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/productCard';
import PageBannerHeader from '@/components/PageBannerHeader';

import { listarTodosProdutos, getImagemUrl } from '@/services/produtoService';
import { adicionarAoCarrinho, listarCarrinho } from '@/services/carrinhoService';

const CATEGORIAS = [
  'Todas',
  'Eletrônicos',
  'Informática',
  'Casa e Cozinha',
  'Moda e Vestuário',
  'Esportes e Lazer',
  'Livros e Papelaria',
  'Beleza e Cuidados',
  'Brinquedos e Jogos',
  'Automotivo',
  'Outros',
];

type OrdenacaoTipo = 'padrao' | 'menor_preco' | 'maior_preco' | 'az';

const OPCOES_ORDENACAO: { id: OrdenacaoTipo; label: string }[] = [
  { id: 'padrao', label: 'Mais recentes' },
  { id: 'menor_preco', label: 'Menor preço' },
  { id: 'maior_preco', label: 'Maior preço' },
  { id: 'az', label: 'A - Z' },
];

const normalizarTexto = (valor?: string) =>
  String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const parseValorNumerico = (texto: string): number | null => {
  const limpo = texto.replace(/[^\d.,]/g, '').replace(',', '.');
  if (!limpo) return null;
  const num = parseFloat(limpo);
  return isNaN(num) ? null : num;
};

export default function DestaquesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    busca?: string | string[];
    categoria?: string | string[];
  }>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const buscaParam = Array.isArray(params.busca) ? params.busca[0] : params.busca;
  const categoriaParam = Array.isArray(params.categoria)
    ? params.categoria[0]
    : params.categoria;

  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(buscaParam || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoriaParam || 'Todas'
  );
  const [ordenacao, setOrdenacao] = useState<OrdenacaoTipo>('padrao');
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');
  const [apenasEmEstoque, setApenasEmEstoque] = useState(false);
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);

  const [selectedId, setSelectedId] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (buscaParam !== undefined) {
      setSearchQuery(buscaParam);
    }
    if (categoriaParam) {
      const catEncontrada = CATEGORIAS.find(
        (c) => normalizarTexto(c) === normalizarTexto(categoriaParam)
      );
      setSelectedCategory(catEncontrada || 'Todas');
    }
  }, [buscaParam, categoriaParam]);

  const formatarPreco = (valor: number) =>
    `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        try {
          setLoading(true);
          const [lista, itensCarrinho, favStorage] = await Promise.all([
            listarTodosProdutos(),
            listarCarrinho().catch(() => []),
            AsyncStorage.getItem('@MeuApp:favoritos'),
          ]);

          const ativos = Array.isArray(lista)
            ? lista.filter((p) => p.ativo !== false)
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

  const handleAddToCart = async (item: any) => {
    const estoqueDisp = Number(item.estoque ?? 0);
    if (estoqueDisp <= 0) {
      mostrarAlerta('Esgotado', 'Este produto está sem estoque no momento.');
      return;
    }

    try {
      await adicionarAoCarrinho(item.id, 1);
      setCartCount((prev) => prev + 1);
      setToastMsg(`"${item.nome}" adicionado ao carrinho.`);
      setTimeout(() => setToastMsg(null), 2500);
    } catch (error: any) {
      mostrarAlerta('Erro', error.message);
    }
  };

  const limparFiltros = () => {
    setSearchQuery('');
    setSelectedCategory('Todas');
    setOrdenacao('padrao');
    setPrecoMin('');
    setPrecoMax('');
    setApenasEmEstoque(false);
  };

  const qtdFiltrosAtivos = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'Todas') count++;
    if (ordenacao !== 'padrao') count++;
    if (precoMin.trim()) count++;
    if (precoMax.trim()) count++;
    if (apenasEmEstoque) count++;
    return count;
  }, [selectedCategory, ordenacao, precoMin, precoMax, apenasEmEstoque]);

  const filteredProducts = useMemo(() => {
    const termoBusca = normalizarTexto(searchQuery);
    const catSelecionadaNorm = normalizarTexto(selectedCategory);
    const min = parseValorNumerico(precoMin);
    const max = parseValorNumerico(precoMax);

    const filtrados = produtos.filter((item) => {
      const texto = normalizarTexto(
        `${item.nome || ''} ${item.descricao || ''} ${item.categoria || ''}`
      );
      const matchesSearch = !termoBusca || texto.includes(termoBusca);

      const catItemNorm = normalizarTexto(item.categoria || 'Eletrônicos');
      const matchesCat =
        selectedCategory === 'Todas' || catItemNorm === catSelecionadaNorm;

      const preco = Number(item.preco_unidade || 0);
      const matchesMin = min === null || preco >= min;
      const matchesMax = max === null || preco <= max;

      const estoqueDisp = Number(item.estoque ?? 0);
      const matchesEstoque = !apenasEmEstoque || estoqueDisp > 0;

      return (
        matchesSearch &&
        matchesCat &&
        matchesMin &&
        matchesMax &&
        matchesEstoque
      );
    });

    if (ordenacao === 'menor_preco') {
      return [...filtrados].sort(
        (a, b) => Number(a.preco_unidade || 0) - Number(b.preco_unidade || 0)
      );
    }
    if (ordenacao === 'maior_preco') {
      return [...filtrados].sort(
        (a, b) => Number(b.preco_unidade || 0) - Number(a.preco_unidade || 0)
      );
    }
    if (ordenacao === 'az') {
      return [...filtrados].sort((a, b) =>
        String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR')
      );
    }

    return filtrados;
  }, [
    produtos,
    searchQuery,
    selectedCategory,
    ordenacao,
    precoMin,
    precoMax,
    apenasEmEstoque,
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        variant="cliente"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        cartBadgeCount={cartCount}
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
        <PageBannerHeader title="Explorar e Filtrar" />

        {/* Chips de Classificação/Categoria */}
        <View style={styles.chipsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsRow}
          >
            {CATEGORIAS.map((cat) => {
              const ativo = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, ativo && styles.chipActive]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.chipText, ativo && styles.chipTextActive]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Barra de resumo + botão de Filtros Avançados */}
        <View
          style={[
            styles.toolbarContainer,
            isDesktop && styles.toolbarContainerDesktop,
          ]}
        >
          <Text style={styles.resultCountText}>
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1
              ? 'produto encontrado'
              : 'produtos encontrados'}
          </Text>

          <View style={styles.toolbarActions}>
            {qtdFiltrosAtivos > 0 && (
              <TouchableOpacity
                onPress={limparFiltros}
                style={styles.clearInlineBtn}
              >
                <Text style={styles.clearInlineText}>Limpar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.advancedToggleBtn,
                mostrarFiltrosAvancados && styles.advancedToggleBtnActive,
              ]}
              onPress={() => setMostrarFiltrosAvancados((prev) => !prev)}
            >
              <Feather
                name="sliders"
                size={14}
                color={
                  mostrarFiltrosAvancados ? '#FFF' : theme.colors.primary
                }
              />
              <Text
                style={[
                  styles.advancedToggleText,
                  mostrarFiltrosAvancados && styles.advancedToggleTextActive,
                ]}
              >
                Filtros{qtdFiltrosAtivos > 0 ? ` (${qtdFiltrosAtivos})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Painel de Filtros Avançados */}
        {mostrarFiltrosAvancados && (
          <View
            style={[
              styles.advancedPanel,
              isDesktop && styles.advancedPanelDesktop,
            ]}
          >
            <Text style={styles.panelLabel}>Ordenar por</Text>
            <View style={styles.sortRow}>
              {OPCOES_ORDENACAO.map((op) => {
                const ativo = ordenacao === op.id;
                return (
                  <TouchableOpacity
                    key={op.id}
                    style={[styles.sortChip, ativo && styles.sortChipActive]}
                    onPress={() => setOrdenacao(op.id)}
                  >
                    <Text
                      style={[
                        styles.sortChipText,
                        ativo && styles.sortChipTextActive,
                      ]}
                    >
                      {op.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.panelLabel}>Faixa de preço (R$)</Text>
            <View style={styles.priceRow}>
              <TextInput
                style={styles.priceInput}
                placeholder="Mínimo (ex: 20)"
                placeholderTextColor={theme.colors.textPlaceholder}
                keyboardType="numeric"
                value={precoMin}
                onChangeText={setPrecoMin}
              />
              <Text style={styles.priceSeparator}>até</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Máximo (ex: 200)"
                placeholderTextColor={theme.colors.textPlaceholder}
                keyboardType="numeric"
                value={precoMax}
                onChangeText={setPrecoMax}
              />
            </View>

            <TouchableOpacity
              style={styles.stockToggleRow}
              onPress={() => setApenasEmEstoque((prev) => !prev)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.checkboxBox,
                  apenasEmEstoque && styles.checkboxBoxChecked,
                ]}
              >
                {apenasEmEstoque && (
                  <Feather name="check" size={12} color="#FFF" />
                )}
              </View>
              <Text style={styles.stockToggleText}>
                Mostrar apenas produtos com estoque disponível
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{ marginTop: 32 }}
          />
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyBox}>
            <Feather
              name="search"
              size={32}
              color={theme.colors.textPlaceholder}
            />
            <Text style={styles.emptyText}>
              Nenhum produto corresponde aos filtros selecionados.
            </Text>
            <TouchableOpacity
              style={styles.emptyClearBtn}
              onPress={limparFiltros}
            >
              <Text style={styles.emptyClearBtnText}>Limpar filtros</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={[
              styles.listContainer,
              isDesktop && styles.listContainerDesktop,
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
                  isSelected={selectedId === idStr}
                  isFavorite={favorites.includes(idStr)}
                  onToggleFavorite={() => toggleFavorite(idStr)}
                  onPress={() => {
                    setSelectedId(idStr);
                    router.navigate({
                      pathname: '/cliente/produto/[id]',
                      params: {
                        id: idStr,
                        title: item.nome,
                        price: precoFormatado,
                      },
                    });
                  }}
                  onAddToCart={() => handleAddToCart(item)}
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
  chipsWrapper: {
    flexGrow: 0,
    flexShrink: 0,
    width: '100%',
  },
  filterChipsRow: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weight.medium,
  },
  chipTextActive: {
    color: '#FFF',
    fontWeight: theme.fonts.weight.bold,
  },
  toolbarContainer: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.s,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbarContainerDesktop: {
    maxWidth: 960,
  },
  resultCountText: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weight.medium,
  },
  toolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearInlineBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  clearInlineText: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.error,
    fontWeight: theme.fonts.weight.bold,
  },
  advancedToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.cardBackground,
  },
  advancedToggleBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  advancedToggleText: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weight.bold,
  },
  advancedToggleTextActive: {
    color: '#FFF',
  },
  advancedPanel: {
    width: '100%',
    maxWidth: 648,
    alignSelf: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 14,
    padding: theme.spacing.m,
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  advancedPanelDesktop: {
    maxWidth: 928,
  },
  panelLabel: {
    fontSize: theme.fonts.size.small,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.spacing.m,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceGray,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sortChipActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  sortChipText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weight.medium,
  },
  sortChipTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.fonts.weight.bold,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.m,
  },
  priceInput: {
    flex: 1,
    height: 38,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: theme.fonts.size.small,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.inputBackground,
  },
  priceSeparator: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.textSecondary,
  },
  stockToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cardBackground,
  },
  checkboxBoxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  stockToggleText: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weight.medium,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: theme.spacing.m,
    gap: 10,
  },
  emptyText: {
    fontSize: theme.fonts.size.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  emptyClearBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  emptyClearBtnText: {
    color: '#FFF',
    fontSize: theme.fonts.size.small,
    fontWeight: theme.fonts.weight.bold,
  },
  listContainer: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.m,
    marginTop: theme.spacing.xs,
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
});