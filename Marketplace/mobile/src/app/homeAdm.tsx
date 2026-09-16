import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/temas'; // Importando o tema conforme seus arquivos[cite: 7]

// Mock de dados para a lista de anúncios
const MOCK_DATA = [
  {
    id: '1',
    title: 'Porta treco ou porta caneta - Cubo do minecraft',
    price: 'R$ 29,99',
    status: 'paused', // paused | active
    image: 'https://via.placeholder.com/80/FFC107/FFFFFF?text=%3F', // Placeholder para o cubo amarelo
  },
  {
    id: '2',
    title: 'Porta treco ou porta caneta - Cubo do minecraft',
    price: 'R$ 29,99',
    status: 'active',
  },
  {
    id: '3',
    title: 'Porta treco ou porta caneta - Cubo do minecraft',
    price: 'R$ 29,99',
    status: 'active',
  },
];

export default function ListagemScreen() {
  const [search, setSearch] = useState('');

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/80/FFC107/FFFFFF?text=%3F' }} style={styles.cardImage} />
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={3}>
          {item.title}
        </Text>
        <Text style={styles.cardPrice}>{item.price}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="edit-2" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="trash-2" size={16} color="#F97316" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Feather 
            name={item.status === 'paused' ? 'pause' : 'play'} 
            size={16} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.brandTitle}>Mercadinho</Text>
            <Text style={styles.brandSubtitle}>DO POVO</Text>
          </View>
          <TouchableOpacity>
            <Feather name="list" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar produtos"
              placeholderTextColor={theme.colors.textPlaceholder}
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Feather name="search" size={14} color={theme.colors.background} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Feather name="user" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Meus Anúncios</Text>

        {/* Lista de Anúncios */}
        <FlatList
          data={MOCK_DATA}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      {/* Floating Action Button (Novo Anúncio) */}
      <TouchableOpacity style={styles.fabNewAd} activeOpacity={0.8}>
        <Feather name="plus" size={18} color={theme.colors.background} />
        <Text style={styles.fabNewAdText}>Novo Anuncio</Text>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="home" size={24} color="#A78BFA" /> {/* Cor roxa do ícone ativo */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="search" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        
        {/* Botão Central de Adicionar */}
        <View style={styles.navCenterItemContainer}>
          <TouchableOpacity style={styles.navCenterButton}>
            <Feather name="plus" size={32} color={theme.colors.background} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.navItem}>
          <Feather name="user" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="settings" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

// ==========================================
// ESTILOS
// ==========================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Fundo levemente cinza da listagem
  },
  headerContainer: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: theme.fonts.weight.extraBold,
    color: theme.colors.textPrimary,
    lineHeight: 24,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.primary,
    letterSpacing: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 20,
    marginRight: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fonts.size.small,
    color: theme.colors.textPrimary,
  },
  searchButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
    padding: 6,
    marginLeft: 8,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
  },
  sectionTitle: {
    fontSize: theme.fonts.size.button,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.primary,
    textAlign: 'center',
    marginVertical: theme.spacing.l,
  },
  listContainer: {
    paddingBottom: 100, // Espaço para a BottomNav e FAB
  },
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: theme.spacing.m,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: theme.fonts.size.body,
    color: theme.colors.textPrimary,
    fontWeight: '500',
    marginBottom: theme.spacing.s,
  },
  cardPrice: {
    fontSize: theme.fonts.size.body,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.textPrimary,
  },
  cardActions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 70,
    marginLeft: theme.spacing.s,
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
  },
  fabNewAd: {
    position: 'absolute',
    bottom: 90, // Acima da bottom bar
    right: 20,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  fabNewAdText: {
    color: theme.colors.background,
    fontWeight: theme.fonts.weight.bold,
    marginLeft: 6,
    fontSize: theme.fonts.size.body,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    height: 65,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    padding: 10,
  },
  navCenterItemContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  navCenterButton: {
    position: 'absolute',
    bottom: -5, 
    backgroundColor: theme.colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});