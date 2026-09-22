import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { theme } from '@/temas';

// Nossos componentes reaproveitáveis
import Header from '@/components/header';
import Footer from '@/components/footer';
import CustomInput from '@/components/input'; // Confirme se o caminho/nome do arquivo está correto no seu projeto
import PrimaryButton from '@/components/botao'; // Confirme se o caminho/nome do arquivo está correto
import ImagePickerButton from '@/components/ImagePickerButton';
import { router } from 'expo-router';

export default function AdicionarAnuncioScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  

  const handlePickImage = () => {
    // Aqui no futuro você integra o 'expo-image-picker'
    console.log('Abrir galeria de fotos');
  };

  const handleSave = () => {
    console.log('Salvando anúncio:', { nome, preco, descricao });
    router.navigate('/vendedor/anuncios')
    // Lógica de salvar na API
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

          {/* Título */}
          <Text style={styles.sectionTitle}>Adicionar Anúncio</Text>

          {/* Formulário */}
          <View style={styles.formContainer}>
            
            {/* Linha superior: Imagem na esquerda, Inputs na direita */}
            <View style={styles.row}>
              {/* Esquerda: Botão de Imagem */}
              <View style={styles.imagePickerContainer}>
                <ImagePickerButton onPress={handlePickImage} style={styles.imagePicker} />
              </View>

              {/* Direita: Inputs empilhados */}
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
                  containerStyle={{ marginBottom: 0 }} // Remove a margem do último para alinhar
                />
              </View>
            </View>

            {/* Linha inferior: Descrição com tamanho maior */}
            <View style={styles.fullWidthInput}>
              <CustomInput 
                label="Descrição" 
                placeholder="Descrição detalhada do produto" 
                multiline
                numberOfLines={3}
                value={descricao}
                onChangeText={setDescricao}
                style={styles.textArea} // Estilo extra para o campo ficar mais alto
              />
            </View>

            {/* Botão Salvar */}
            <PrimaryButton 
              title="Salvar" 
              onPress={handleSave} 
              style={styles.saveButton}
            />

          </View>
        </ScrollView>

        {/* Footer fixo na base */}
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
    paddingBottom: 20, // Espaço antes do Footer
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
    width: '40%', // Ocupa 40% da tela
    marginRight: theme.spacing.m,
  },
  imagePicker: {
    height: '100%', // Faz o quadrado esticar para acompanhar a altura dos 2 inputs ao lado
    minHeight: 140, // Altura mínima de segurança
  },
  inputsRightContainer: {
    flex: 1, // Ocupa o restante do espaço (60%)
    justifyContent: 'space-between',
  },
  fullWidthInput: {
    marginBottom: theme.spacing.l,
  },
  textArea: {
    height: 80, // Deixa a caixa de descrição maior
    textAlignVertical: 'top', // Para o texto começar de cima no Android
  },
  saveButton: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xl, // Empurra o footer um pouco para baixo
  }
});