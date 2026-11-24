import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '@/temas';
import { router, useLocalSearchParams } from 'expo-router';

import Header from '@/components/header';
import Footer from '@/components/footer';
import CustomInput from '@/components/input';
import PrimaryButton from '@/components/botao';
import ImagePickerButton from '@/components/ImagePickerButton';

import {
  getById,
  cadastrarProduto,
  alterarProduto,
  getImagemUrl,
} from '@/services/produtoService';

const CATEGORIAS_PRODUTO = [
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

export default function FormularioAnuncioScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { width } = useWindowDimensions();
  const isCompact = width < 600;

  const produtoId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isEditing = Boolean(produtoId);

  const [searchQuery, setSearchQuery] = useState('');
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [categoria, setCategoria] = useState('Eletrônicos');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  const [imagemSelecionada, setImagemSelecionada] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  useEffect(() => {
    const carregarProduto = async () => {
      if (!produtoId) {
        setNome('');
        setPreco('');
        setEstoque('');
        setCategoria('Eletrônicos');
        setDescricao('');
        setImagemSelecionada(null);
        setImagemPreview(null);
        return;
      }

      try {
        setLoading(true);
        const produto = await getById(produtoId);

        if (produto) {
          setNome(produto.nome || '');
          setDescricao(produto.descricao || '');
          setCategoria(
            CATEGORIAS_PRODUTO.includes(produto.categoria)
              ? produto.categoria
              : 'Eletrônicos'
          );
          setPreco(
            produto.preco_unidade !== undefined && produto.preco_unidade !== null
              ? String(produto.preco_unidade).replace('.', ',')
              : ''
          );
          setEstoque(
            produto.estoque !== undefined && produto.estoque !== null
              ? String(produto.estoque)
              : '0'
          );
          setImagemSelecionada(null);
          setImagemPreview(
            produto.imagem_url ? getImagemUrl(produto.imagem_url) : null
          );
        }
      } catch (error: any) {
        console.error('Erro ao buscar produto por ID:', error);
        mostrarAlerta('Erro', 'Não foi possível carregar as informações do produto.');
      } finally {
        setLoading(false);
      }
    };

    carregarProduto();
  }, [produtoId]);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        mostrarAlerta(
          'Permissão necessária',
          'Precisamos de acesso à sua galeria para escolher a foto do produto.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setImagemSelecionada(asset);
        setImagemPreview(asset.uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      mostrarAlerta('Erro', 'Não foi possível abrir a galeria de imagens.');
    }
  };

  const handleSave = async () => {
    if (loading) return;

    if (!nome.trim() || !preco.trim() || !estoque.trim() || !descricao.trim()) {
      mostrarAlerta('Atenção', 'Preencha todos os campos do anúncio.');
      return;
    }

    const precoLimpo = String(preco).replace('R$', '').trim().replace(',', '.');
    const precoNumerico = parseFloat(precoLimpo);

    if (isNaN(precoNumerico) || precoNumerico <= 0) {
      mostrarAlerta('Atenção', 'Digite um preço válido.');
      return;
    }

    const estoqueNumerico = parseInt(estoque.replace(/\D/g, ''), 10);
    if (isNaN(estoqueNumerico) || estoqueNumerico < 0) {
      mostrarAlerta('Atenção', 'Digite uma quantidade de estoque válida (0 ou maior).');
      return;
    }

    try {
      setLoading(true);

      if (isEditing) {
        await alterarProduto(
          Number(produtoId),
          nome.trim(),
          descricao.trim(),
          precoNumerico,
          estoqueNumerico,
          imagemSelecionada,
          categoria
        );
        mostrarAlerta('Sucesso', 'Anúncio atualizado com sucesso!');
      } else {
        await cadastrarProduto(
          nome.trim(),
          descricao.trim(),
          precoNumerico,
          estoqueNumerico,
          imagemSelecionada,
          categoria
        );
        mostrarAlerta('Sucesso', 'Anúncio cadastrado com sucesso!');
      }

      router.navigate('/vendedor/anuncios');
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      mostrarAlerta('Erro', error.message || 'Não foi possível salvar o anúncio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Header
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onMenuPress={() => console.log('Menu')}
            onProfilePress={() => console.log('Perfil')}
          />

          <Text style={styles.sectionTitle}>
            {isEditing ? 'Editar Anúncio' : 'Adicionar Anúncio'}
          </Text>

          <View style={styles.formContainer}>
            {isCompact ? (
              <>
                <View style={styles.imagePickerMobileWrapper}>
                  <ImagePickerButton
                    onPress={handlePickImage}
                    imageUri={imagemPreview}
                    style={styles.imagePickerMobile}
                  />
                </View>

                <CustomInput
                  label="Nome"
                  placeholder="Nome do produto"
                  value={nome}
                  onChangeText={setNome}
                />

                <View style={styles.twoColumnsRow}>
                  <View style={styles.halfColumn}>
                    <CustomInput
                      label="Preço"
                      placeholder="R$ 0,00"
                      keyboardType="numeric"
                      value={preco}
                      onChangeText={setPreco}
                    />
                  </View>
                  <View style={styles.halfColumn}>
                    <CustomInput
                      label="Estoque"
                      placeholder="Ex: 10"
                      keyboardType="number-pad"
                      value={estoque}
                      onChangeText={(texto) => setEstoque(texto.replace(/\D/g, ''))}
                    />
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.rowDesktop}>
                <View style={styles.imagePickerDesktopWrapper}>
                  <ImagePickerButton
                    onPress={handlePickImage}
                    imageUri={imagemPreview}
                    style={styles.imagePickerDesktop}
                  />
                </View>

                <View style={styles.inputsRightContainer}>
                  <CustomInput
                    label="Nome"
                    placeholder="Nome do produto"
                    value={nome}
                    onChangeText={setNome}
                  />
                  <CustomInput
                    label="Preço"
                    placeholder="R$ 0,00"
                    keyboardType="numeric"
                    value={preco}
                    onChangeText={setPreco}
                  />
                  <CustomInput
                    label="Estoque"
                    placeholder="Ex: 10"
                    keyboardType="number-pad"
                    value={estoque}
                    onChangeText={(texto) => setEstoque(texto.replace(/\D/g, ''))}
                    containerStyle={{ marginBottom: 0 }}
                  />
                </View>
              </View>
            )}

            <Text style={styles.categoryLabel}>Classificação / Categoria</Text>
            <View style={styles.categoriesWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScroll}
              >
                {CATEGORIAS_PRODUTO.map((cat) => {
                  const selecionada = categoria === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        selecionada && styles.categoryChipSelected,
                      ]}
                      onPress={() => setCategoria(cat)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          selecionada && styles.categoryChipTextSelected,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.fullWidthInput}>
              <CustomInput
                label="Descrição"
                placeholder="Descrição detalhada do produto"
                multiline
                numberOfLines={3}
                value={descricao}
                onChangeText={setDescricao}
                style={styles.textArea}
              />
            </View>

            <PrimaryButton
              title={
                loading
                  ? 'Carregando...'
                  : isEditing
                  ? 'Salvar Alterações'
                  : 'Salvar'
              }
              onPress={handleSave}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.m,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: theme.fonts.size.title,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.primaryLight,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
  },
  formContainer: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  // --- Layout Mobile ---
  imagePickerMobileWrapper: {
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  imagePickerMobile: {
    width: 160,
    height: 160,
  },
  twoColumnsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfColumn: {
    flex: 1,
  },
  // --- Layout Desktop / Tablet ---
  rowDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginBottom: theme.spacing.m,
    gap: theme.spacing.m,
  },
  imagePickerDesktopWrapper: {
    width: '38%',
  },
  imagePickerDesktop: {
    height: '100%',
    minHeight: 200,
  },
  inputsRightContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  // --- Categorias e Descrição ---
  categoryLabel: {
    fontSize: theme.fonts.size.body,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.s,
  },
  categoriesWrapper: {
    flexGrow: 0,
    marginBottom: theme.spacing.m,
  },
  categoriesScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryChipText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weight.medium,
  },
  categoryChipTextSelected: {
    color: '#FFF',
    fontWeight: theme.fonts.weight.bold,
  },
  fullWidthInput: {
    marginBottom: theme.spacing.m,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.l,
  },
});