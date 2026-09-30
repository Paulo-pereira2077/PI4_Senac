// Caminho do arquivo: app/cliente/endereco.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '@/temas';
import Header from '@/components/header';
import Footer from '@/components/footer';
import CustomInput from '@/components/input';
import PrimaryButton from '@/components/botao';
import PageBannerHeader from '@/components/PageBannerHeader';

const ESTADOS_MOCK = [
  { estado: 'São Paulo', uf: 'SP' },
  { estado: 'Rio de Janeiro', uf: 'RJ' },
  { estado: 'Minas Gerais', uf: 'MG' },
  { estado: 'Paraná', uf: 'PR' },
];

export default function EnderecoScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [stateIndex, setStateIndex] = useState<number | null>(null);

  useEffect(() => {
    const carregarEnderecoSalvo = async () => {
      const salvo = await AsyncStorage.getItem('@MeuApp:endereco');
      if (salvo) {
        const dados = JSON.parse(salvo);
        setCep(dados.cep || '');
        setEndereco(dados.endereco || '');
        setNumero(dados.numero || '');
        setComplemento(dados.complemento || '');
        if (dados.stateIndex !== undefined) {
          setStateIndex(dados.stateIndex);
        }
      }
    };
    carregarEnderecoSalvo();
  }, []);

  const handleCepChange = (value: string) => {
    setCep(value);
    const digits = value.replace(/\D/g, '');
    if (digits.length === 8 && !endereco) {
      setEndereco('Av. Engenheiro Eusébio Stevaux');
      setStateIndex(0);
    }
  };

  const handleCycleState = () => {
    setStateIndex((prev) =>
      prev === null ? 0 : (prev + 1) % ESTADOS_MOCK.length
    );
  };

  const handleSaveAddress = async () => {
    if (!cep || !endereco || !numero) {
      if (Platform.OS === 'web') {
        window.alert('Campos obrigatórios: Preencha CEP, Endereço e Número.');
      } else {
        Alert.alert('Campos obrigatórios', 'Preencha CEP, Endereço e Número.');
      }
      return;
    }

    const selectedEstado =
      stateIndex !== null ? ESTADOS_MOCK[stateIndex].estado : 'São Paulo';
    const selectedUf =
      stateIndex !== null ? ESTADOS_MOCK[stateIndex].uf : 'SP';

    await AsyncStorage.setItem(
      '@MeuApp:endereco',
      JSON.stringify({
        cep,
        endereco,
        numero,
        complemento,
        estado: selectedEstado,
        uf: selectedUf,
        stateIndex: stateIndex ?? 0,
      })
    );

    router.navigate('/cliente/carrinho');
  };

  const selectedEstado =
    stateIndex !== null ? ESTADOS_MOCK[stateIndex].estado : '';
  const selectedUf = stateIndex !== null ? ESTADOS_MOCK[stateIndex].uf : '';

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
        <PageBannerHeader title="Endereço" />

        <View style={styles.formCard}>
          <CustomInput
            placeholder="CEP"
            value={cep}
            onChangeText={handleCepChange}
            keyboardType="numeric"
            maxLength={9}
            leftIcon="map-pin"
          />

          <CustomInput
            placeholder="Endereço"
            value={endereco}
            onChangeText={setEndereco}
            leftIcon="home"
          />

          <View style={styles.row}>
            <CustomInput
              placeholder="Número"
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
              leftIcon="home"
              containerStyle={styles.halfInputLeft}
            />

            <CustomInput
              placeholder="Complemento"
              value={complemento}
              onChangeText={setComplemento}
              leftIcon="home"
              containerStyle={styles.halfInputRight}
            />
          </View>

          <View style={styles.row}>
            <CustomInput
              placeholder="Estado"
              value={selectedEstado}
              editable={false}
              leftIcon="home"
              rightIcon="chevron-down"
              onRightIconPress={handleCycleState}
              containerStyle={styles.halfInputLeft}
            />

            <CustomInput
              placeholder="UF"
              value={selectedUf}
              editable={false}
              leftIcon="home"
              rightIcon="chevron-down"
              onRightIconPress={handleCycleState}
              containerStyle={styles.halfInputRight}
            />
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <PrimaryButton
            title="Salvar"
            variant="success"
            rounded
            onPress={handleSaveAddress}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>

      <Footer variant="cliente" activeTab="profile" />
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
  formCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 20,
    padding: theme.spacing.m,
    marginHorizontal: theme.spacing.m,
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputLeft: {
    flex: 1,
    marginRight: theme.spacing.s,
  },
  halfInputRight: {
    flex: 1,
    marginLeft: theme.spacing.s,
  },
  buttonWrapper: {
    alignItems: 'center',
  },
  saveButton: {
    width: '58%',
  },
});