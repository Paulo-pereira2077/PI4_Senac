import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/temas';
import { router, useFocusEffect } from 'expo-router';

// Importação dos componentes
import ProductCard from '@/components/productCard';
import ConfirmModal from '@/components/confirmModal';
import Footer from '@/components/footer';
import Header from '@/components/header';

// 1. ATUALIZADO: Importamos também o getImagemUrl
import { 
  acessarProdutos, 
  deletarProduto, 
  alterarAtivacaoProduto,
  getImagemUrl 
} from '@/services/produtoService'; 

// 2. ATUALIZADO: Adicionado o campo imagem_url na interface
interface Produto {
  id: number;
  vendedor_id: number;
  nome: string;
  descricao: string;
  preco_unidade: number;
  imagem_url?: string;
  ativo: boolean;
}

export default function MeusAnunciosScreen() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Busca os produtos no backend
  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const data = await acessarProdutos();
      setProdutos(data);
    } catch (error: any) {
      console.log('Erro', error.message || 'Não foi possível carregar os anúncios.');
    } finally {
      setLoading(false);
    }
  };

  // Recarrega a lista sempre que a tela ganha foco (ex: ao voltar do cadastro/edição)
  useFocusEffect(
    useCallback(() => {
      carregarProdutos();
    }, [])
  );

  // Navega para a tela de edição passando os dados do produto
  const handleEdit = (produto: Produto) => {
    router.push({
      pathname: '/vendedor/adicionar',
      params: { 
        id: produto.id,
      }
    });
  };
  
  // Abre o modal de confirmação de exclusão
  const handleDeleteRequest = (id: number) => {
    setSelectedProductId(id);
    setModalVisible(true);
  };

  // Deleta o produto no backend e atualiza a lista local
  const confirmDelete = async () => {
    if (selectedProductId === null) return;

    try {
      await deletarProduto(selectedProductId);
      setProdutos((prev) => prev.filter((item) => item.id !== selectedProductId));
    } catch (error: any) {
      Alert.alert('Erro ao excluir', error.message);
    } finally {
      setModalVisible(false);
      setSelectedProductId(null);
    }
  };

  // Alterna entre ativo/inativo (pausar anúncio)
  const handlePause = async (produto: Produto) => {
    try {
      const novoStatus = !produto.ativo;
      await alterarAtivacaoProduto(produto.id, novoStatus);
      
      // Atualiza o estado local para refletir a mudança instantaneamente
      setProdutos((prev) =>
        prev.map((item) =>
          item.id === produto.id ? { ...item, ativo: novoStatus } : item
        )
      );
    } catch (error: any) {
      Alert.alert('Erro ao alterar status', error.message);
    }
  };

  // Filtra os produtos pela barra de pesquisa do Header
  const produtosFiltrados = produtos.filter((item) =>
    item.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Formata o preço numérico (ex: 29.9) para moeda (ex: "R$ 29,90")
  const formatarPreco = (valor: number) => {
    return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <Header 
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuPress={() => console.log('Abrir menu')}
          onProfilePress={() => console.log('Abrir perfil')}
        />

        <Text style={styles.sectionTitle}>Meus Anúncios</Text>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primaryLight} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={produtosFiltrados}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum anúncio encontrado.</Text>
            }
            renderItem={({ item }) => {
              const urlFoto = getImagemUrl(item.imagem_url);

              return (
                <ProductCard
                  title={item.nome}
                  price={formatarPreco(item.preco_unidade)}
                  imageUrl={urlFoto ? { uri: urlFoto } : require('@/assets/images/cubo.png')}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDeleteRequest(item.id)}
                  onPause={() => handlePause(item)}
                  ativo={item.ativo}
                  isPaused={!item.ativo}
                />
              );
            }}
          />
        )}

        <TouchableOpacity 
          onPress={() => router.navigate('/vendedor/adicionar')} 
          style={styles.fabButton} 
          activeOpacity={0.8}
        >
          <Feather name="plus" size={20} color={theme.colors.cardBackground} />
          <Text style={styles.fabText}>Novo Anúncio</Text>
        </TouchableOpacity>

      </View>

      <Footer />

      <ConfirmModal
        visible={isModalVisible}
        message="Deseja excluir esse produto?"
        onConfirm={confirmDelete}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1, 
    paddingHorizontal: theme.spacing.m,
  },
  sectionTitle: {
    fontSize: theme.fonts.size.title,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.primaryLight,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
  },
  listContent: {
    paddingBottom: 80, 
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
  fabButton: {
    position: 'absolute',
    bottom: theme.spacing.m, 
    right: 0, 
    backgroundColor: theme.colors.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: theme.colors.cardBackground,
    fontWeight: theme.fonts.weight.bold,
    marginLeft: 8,
  },
});