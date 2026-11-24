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
import CustomInput from '@/components/input';
import PageBannerHeader from '@/components/PageBannerHeader';

import { getById, getImagemUrl } from '@/services/produtoService';
import { adicionarAoCarrinho } from '@/services/carrinhoService';
import {
  listarAvaliacoesProduto,
  enviarAvaliacaoProduto,
} from '@/services/avaliacaoService';
import { obterUsuarioLogado } from '@/services/authService';

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
  const [actionLoading, setActionLoading] = useState(false);
  const [produto, setProduto] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Avaliações
  const [mediaAvaliacao, setMediaAvaliacao] = useState<number>(0);
  const [totalAvaliacoes, setTotalAvaliacoes] = useState<number>(0);
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [usuarioAtualId, setUsuarioAtualId] = useState<number | null>(null);
  const [minhaNota, setMinhaNota] = useState<number>(5);
  const [meuComentario, setMeuComentario] = useState<string>('');
  const [jaAvaliou, setJaAvaliou] = useState<boolean>(false);
  const [salvandoAvaliacao, setSalvandoAvaliacao] = useState<boolean>(false);

  const formatarPreco = (valor: number) =>
    `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  const carregarAvaliacoes = async (idProd: string, userIdAtual: number | null) => {
    try {
      const dadosAv = await listarAvaliacoesProduto(idProd);
      const lista = Array.isArray(dadosAv?.avaliacoes) ? dadosAv.avaliacoes : [];
      setAvaliacoes(lista);
      setMediaAvaliacao(Number(dadosAv?.media || 0));
      setTotalAvaliacoes(Number(dadosAv?.total || lista.length));

      if (userIdAtual) {
        const propria = lista.find(
          (av: any) => Number(av.usuario_id) === Number(userIdAtual)
        );
        if (propria) {
          setJaAvaliou(true);
          setMinhaNota(Number(propria.nota) || 5);
          setMeuComentario(propria.comentario || '');
        } else {
          setJaAvaliou(false);
          setMinhaNota(5);
          setMeuComentario('');
        }
      }
    } catch (err) {
      console.error('Erro ao carregar avaliações:', err);
    }
  };

  useEffect(() => {
    const carregarDetalhes = async () => {
      if (!produtoId) return;

      try {
        setLoading(true);
        const [dados, favStorage, usuarioLogado] = await Promise.all([
          getById(produtoId),
          AsyncStorage.getItem('@MeuApp:favoritos'),
          obterUsuarioLogado().catch(() => null),
        ]);
        setProduto(dados);

        const uid =
          usuarioLogado?.id ||
          usuarioLogado?.usuario?.id ||
          usuarioLogado?.user?.id ||
          null;
        setUsuarioAtualId(uid ? Number(uid) : null);

        if (favStorage) {
          const favs: string[] = JSON.parse(favStorage);
          setIsFavorite(favs.includes(String(produtoId)));
        }

        await carregarAvaliacoes(produtoId, uid ? Number(uid) : null);
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

  const estoqueAtual = Number(produto?.estoque ?? 0);
  const semEstoque = produto !== null && estoqueAtual <= 0;
  const estoqueBaixo = produto !== null && estoqueAtual > 0 && estoqueAtual <= 5;

  const handleAdicionarAoCarrinho = async () => {
    if (!produtoId || actionLoading) return;

    if (semEstoque) {
      mostrarAlerta('Indisponível', 'Este produto está esgotado no momento.');
      return;
    }

    try {
      setActionLoading(true);
      await adicionarAoCarrinho(Number(produtoId), 1);
      setToastMsg('Produto adicionado ao carrinho!');
      setTimeout(() => setToastMsg(null), 2500);
    } catch (error: any) {
      mostrarAlerta('Erro', error.message || 'Não foi possível adicionar ao carrinho.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComprarAgora = async () => {
    if (!produtoId || actionLoading) return;

    if (semEstoque) {
      mostrarAlerta('Indisponível', 'Este produto está esgotado no momento.');
      return;
    }

    try {
      setActionLoading(true);
      await adicionarAoCarrinho(Number(produtoId), 1);
      router.navigate('/cliente/carrinho');
    } catch (error: any) {
      mostrarAlerta('Erro', error.message || 'Não foi possível iniciar a compra.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSalvarAvaliacao = async () => {
    if (!produtoId || salvandoAvaliacao) return;

    try {
      setSalvandoAvaliacao(true);
      const res = await enviarAvaliacaoProduto(
        produtoId,
        minhaNota,
        meuComentario.trim()
      );
      await carregarAvaliacoes(produtoId, usuarioAtualId);
      mostrarAlerta('Avaliação', res?.message || 'Avaliação salva com sucesso!');
    } catch (error: any) {
      mostrarAlerta('Atenção', error.message || 'Não foi possível enviar avaliação.');
    } finally {
      setSalvandoAvaliacao(false);
    }
  };

  const productTitle = produto?.nome || params.title || 'Produto';
  const productCategory = produto?.categoria || 'Eletrônicos';
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
        <PageBannerHeader title="Detalhes do Produto" />

        <View style={styles.contentPadding}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={theme.colors.primary}
              style={{ marginVertical: 40 }}
            />
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
                  style={[styles.productImage, semEstoque && styles.imageOutOfStock]}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.categoryBadgeText}>{productCategory}</Text>
              <Text style={styles.title}>{productTitle}</Text>
              <Text style={styles.price}>{productPrice}</Text>
              <Text style={styles.installments}>
                em até 12x sem juros no cartão
              </Text>

              {produto !== null && (
                <View
                  style={[
                    styles.stockBadge,
                    semEstoque
                      ? styles.stockBadgeEmpty
                      : estoqueBaixo
                      ? styles.stockBadgeLow
                      : styles.stockBadgeOk,
                  ]}
                >
                  <Feather
                    name={
                      semEstoque
                        ? 'x-circle'
                        : estoqueBaixo
                        ? 'alert-circle'
                        : 'check-circle'
                    }
                    size={14}
                    color={
                      semEstoque
                        ? theme.colors.error
                        : estoqueBaixo
                        ? theme.colors.warning
                        : theme.colors.success
                    }
                  />
                  <Text
                    style={[
                      styles.stockText,
                      {
                        color: semEstoque
                          ? theme.colors.error
                          : estoqueBaixo
                          ? theme.colors.warning
                          : theme.colors.success,
                      },
                    ]}
                  >
                    {semEstoque
                      ? 'Produto esgotado'
                      : estoqueBaixo
                      ? `Restam apenas ${estoqueAtual} unidade(s)!`
                      : `${estoqueAtual} unidades disponíveis`}
                  </Text>
                </View>
              )}

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.descriptionText}>{productDescription}</Text>
            </View>
          )}

          {/* Botões: Adicionar ao carrinho (sem navegar) e Comprar agora */}
          <PrimaryButton
            title={
              semEstoque
                ? 'Produto esgotado'
                : actionLoading
                ? 'Adicionando...'
                : 'Adicionar ao carrinho'
            }
            variant={semEstoque ? 'secondary' : 'primary'}
            rounded
            disabled={semEstoque || actionLoading}
            onPress={handleAdicionarAoCarrinho}
            style={[styles.actionBtn, semEstoque && styles.disabledBtn]}
          />

          <PrimaryButton
            title={semEstoque ? 'Indisponível' : 'Comprar agora'}
            variant={semEstoque ? 'secondary' : 'success'}
            rounded
            disabled={semEstoque || actionLoading}
            onPress={handleComprarAgora}
            style={[styles.actionBtn, semEstoque && styles.disabledBtn]}
          />

          <PrimaryButton
            title="Voltar para a loja"
            variant="secondary"
            rounded
            onPress={() => router.navigate('/cliente/home')}
            style={styles.actionBtn}
          />

          {/* Seção de Avaliações */}
          <View style={styles.reviewsCard}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Avaliações do Produto</Text>
              <Text style={styles.ratingSummary}>
                ★ {mediaAvaliacao.toFixed(1)} ({totalAvaliacoes})
              </Text>
            </View>

            <Text style={styles.formSubtitle}>
              {jaAvaliou
                ? 'Você já avaliou este produto. Altere abaixo para editar:'
                : 'Deixe sua avaliação (1 a 5 estrelas):'}
            </Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((estrela) => {
                const ativa = estrela <= minhaNota;
                return (
                  <TouchableOpacity
                    key={estrela}
                    onPress={() => setMinhaNota(estrela)}
                    style={styles.starBtn}
                  >
                    <Feather
                      name="star"
                      size={22}
                      color={ativa ? theme.colors.warning : theme.colors.border}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <CustomInput
              placeholder="Escreva um comentário (opcional)"
              value={meuComentario}
              onChangeText={setMeuComentario}
              multiline
              numberOfLines={2}
              containerStyle={styles.commentInput}
            />

            <PrimaryButton
              title={
                salvandoAvaliacao
                  ? 'Salvando...'
                  : jaAvaliou
                  ? 'Atualizar avaliação'
                  : 'Enviar avaliação'
              }
              variant="primary"
              rounded
              disabled={salvandoAvaliacao}
              onPress={handleSalvarAvaliacao}
              style={styles.submitReviewBtn}
            />

            {avaliacoes.length === 0 ? (
              <Text style={styles.noReviewsText}>
                Ainda não há avaliações para este produto.
              </Text>
            ) : (
              avaliacoes.map((av: any) => (
                <View key={av.id} style={styles.reviewItem}>
                  <View style={styles.reviewItemTop}>
                    <Text style={styles.reviewAuthor}>
                      {av.autor_nome || 'Cliente'}
                    </Text>
                    <Text style={styles.reviewStars}>
                      {'★'.repeat(Number(av.nota) || 5)}
                    </Text>
                  </View>
                  {av.comentario ? (
                    <Text style={styles.reviewComment}>{av.comentario}</Text>
                  ) : null}
                </View>
              ))
            )}
          </View>
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
  imageOutOfStock: {
    opacity: 0.45,
  },
  categoryBadgeText: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.primaryLight,
    fontWeight: theme.fonts.weight.bold,
    marginBottom: 2,
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
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 10,
  },
  stockBadgeOk: {
    backgroundColor: '#ECFDF5',
  },
  stockBadgeLow: {
    backgroundColor: '#FFFBEB',
  },
  stockBadgeEmpty: {
    backgroundColor: '#FEF2F2',
  },
  stockText: {
    fontSize: theme.fonts.size.small,
    fontWeight: theme.fonts.weight.bold,
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
  disabledBtn: {
    opacity: 0.65,
  },
  reviewsCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 20,
    padding: theme.spacing.m,
    marginTop: theme.spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingSummary: {
    fontSize: theme.fonts.size.body,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.warning,
  },
  formSubtitle: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: theme.spacing.s,
  },
  starBtn: {
    padding: 4,
  },
  commentInput: {
    marginBottom: theme.spacing.s,
  },
  submitReviewBtn: {
    marginBottom: theme.spacing.m,
  },
  noReviewsText: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 8,
  },
  reviewItem: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: 10,
  },
  reviewItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewAuthor: {
    fontSize: theme.fonts.size.small,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.textPrimary,
  },
  reviewStars: {
    fontSize: 13,
    color: theme.colors.warning,
  },
  reviewComment: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});