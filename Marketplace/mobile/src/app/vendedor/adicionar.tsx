import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { theme } from '@/temas';
import { router, useLocalSearchParams } from 'expo-router';

// Nossos componentes reaproveitáveis
import Header from '@/components/header';
import Footer from '@/components/footer';
import CustomInput from '@/components/input';
import PrimaryButton from '@/components/botao';
import ImagePickerButton from '@/components/ImagePickerButton';

// Importando getById, cadastrarProduto e alterarProduto do service
import { getById, cadastrarProduto, alterarProduto } from '@/services/produtoService';

export default function FormularioAnuncioScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  
  // Garante que o id seja uma string simples (mesmo na Web)
  const produtoId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isEditing = Boolean(produtoId);

  const [searchQuery, setSearchQuery] = useState('');
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  // Função auxiliar para mostrar alerta tanto no Celular quanto no Navegador (Web)
  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  // BUSCA O PRODUTO PELO ID NA API QUANDO A TELA ABRE
  useEffect(() => {
    const carregarProduto = async () => {
      if (!produtoId) {
        setNome('');
        setPreco('');
        setDescricao('');
        return;
      }

      try {
        setLoading(true);
        const produto = await getById(produtoId);
        console.log('Produto carregado pelo getById:', produto);

        if (produto) {
          setNome(produto.nome || '');
          setDescricao(produto.descricao || '');
          setPreco(
            produto.preco_unidade !== undefined && produto.preco_unidade !== null
              ? String(produto.preco_unidade).replace('.', ',')
              : ''
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

  const handlePickImage = () => {
    console.log('Abrir galeria de fotos');
  };

  const handleSave = async () => {
    if (loading) return;

    // 1. Validação de campos vazios
    if (!nome.trim() || !preco.trim() || !descricao.trim()) {
      mostrarAlerta('Atenção', 'Preencha todos os campos do anúncio.');
      return;
    }

    // 2. Limpa o texto do preço (remove "R$", espaços e troca vírgula por ponto)
    const precoLimpo = String(preco).replace('R$', '').trim().replace(',', '.');
    const precoNumerico = parseFloat(precoLimpo);

    if (isNaN(precoNumerico) || precoNumerico <= 0) {
      mostrarAlerta('Atenção', 'Digite um preço válido.');
      return;
    }

    try {
      setLoading(true);

      if (isEditing) {
        await alterarProduto(Number(produtoId), nome.trim(), descricao.trim(), precoNumerico);
        mostrarAlerta('Sucesso', 'Anúncio atualizado com sucesso!');
      } else {
        await cadastrarProduto(nome.trim(), descricao.trim(), precoNumerico);
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <Header 
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onMenuPress={() => console.log('Menu')}
            onProfilePress={() => console.log('Perfil')}
          />

          {/* Título Dinâmico */}
          <Text style={styles.sectionTitle}>
            {isEditing ? 'Editar Anúncio' : 'Adicionar Anúncio'}
          </Text>

          {/* Formulário */}
          <View style={styles.formContainer}>
            
            <View style={styles.row}>
              <View style={styles.imagePickerContainer}>
                <ImagePickerButton onPress={handlePickImage} style={styles.imagePicker} />
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
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
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
              title={loading ? 'Carregando...' : isEditing ? 'Salvar Alterações' : 'Salvar'} 
              onPress={handleSave} 
              style={styles.saveButton}
            />

          </View>
        </ScrollView>

        <Footer />
      </KeyboardAvoidingView>
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
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: theme.fonts.size.title,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.primaryLight,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  formContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  imagePickerContainer: {
    width: '40%',
    marginRight: theme.spacing.m,
  },
  imagePicker: {
    height: '100%',
    minHeight: 140,
  },
  inputsRightContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  fullWidthInput: {
    marginBottom: theme.spacing.l,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  }
});