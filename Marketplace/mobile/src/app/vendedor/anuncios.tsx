import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/temas';

// Importação dos nossos componentes
import ProductCard from '@/components/productCard';
import ConfirmModal from '@/components/confirmModal';
import Footer from '@/components/footer';
import Header from '@/components/header'; // <-- Importando o nosso novo Header
import { router } from 'expo-router';

const MOCK_DATA = [
  { id: '1', title: 'Porta treco ou porta caneta - Cubo do minecraft', price: 'R$ 29,99', image: require('@/assets/images/cubo.png') }, 
  { id: '2', title: 'Porta treco ou porta caneta - Cubo do minecraft', price: 'R$ 29,99', image: require('@/assets/images/cubo.png') },
  { id: '3', title: 'Porta treco ou porta caneta - Cubo do minecraft', price: 'R$ 29,99', image: require('@/assets/images/cubo.png') },
];

export default function MeusAnunciosScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // Estado para a barra de pesquisa
    

  const handleEdit = (id: string) => console.log('Editar produto', id);
  
  const handleDeleteRequest = (id: string) => {
    setSelectedProductId(id);
    setModalVisible(true);
  };

  const confirmDelete = () => {
    console.log('Excluindo produto ID:', selectedProductId);
    setModalVisible(false);
    setSelectedProductId(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Nosso Componente Header Reutilizável */}
        <Header 
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuPress={() => console.log('Abrir menu')}
          onProfilePress={() => console.log('Abrir perfil')}
        />

        <Text style={styles.sectionTitle}>Meus Anúncios</Text>

        <FlatList
          data={MOCK_DATA}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProductCard
              title={item.title}
              price={item.price}
              imageUrl={item.image}
              onEdit={() => handleEdit(item.id)}
              onDelete={() => handleDeleteRequest(item.id)}
              onPause={() => console.log('Pausar', item.id)}
            />
          )}
        />

        <TouchableOpacity onPress={() => {router.navigate('/vendedor/adicionar')} } style={styles.fabButton} activeOpacity={0.8}>
          <Feather name="plus" size={20} color={theme.colors.cardBackground} />
          <Text style={styles.fabText}>Novo Anuncio</Text>
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