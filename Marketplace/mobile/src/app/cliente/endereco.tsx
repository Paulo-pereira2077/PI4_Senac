// Caminho do arquivo: app/cliente/endereco.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '@/temas';
import Header from '@/components/header';
import Footer from '@/components/footer';
import CustomInput from '@/components/input';
import PrimaryButton from '@/components/botao';
import PageBannerHeader from '@/components/PageBannerHeader';

const ESTADOS_BR = [
  { estado: 'Acre', uf: 'AC' },
  { estado: 'Alagoas', uf: 'AL' },
  { estado: 'Amapá', uf: 'AP' },
  { estado: 'Amazonas', uf: 'AM' },
  { estado: 'Bahia', uf: 'BA' },
  { estado: 'Ceará', uf: 'CE' },
  { estado: 'Distrito Federal', uf: 'DF' },
  { estado: 'Espírito Santo', uf: 'ES' },
  { estado: 'Goiás', uf: 'GO' },
  { estado: 'Maranhão', uf: 'MA' },
  { estado: 'Mato Grosso', uf: 'MT' },
  { estado: 'Mato Grosso do Sul', uf: 'MS' },
  { estado: 'Minas Gerais', uf: 'MG' },
  { estado: 'Pará', uf: 'PA' },
  { estado: 'Paraíba', uf: 'PB' },
  { estado: 'Paraná', uf: 'PR' },
  { estado: 'Pernambuco', uf: 'PE' },
  { estado: 'Piauí', uf: 'PI' },
  { estado: 'Rio de Janeiro', uf: 'RJ' },
  { estado: 'Rio Grande do Norte', uf: 'RN' },
  { estado: 'Rio Grande do Sul', uf: 'RS' },
  { estado: 'Rondônia', uf: 'RO' },
  { estado: 'Roraima', uf: 'RR' },
  { estado: 'Santa Catarina', uf: 'SC' },
  { estado: 'São Paulo', uf: 'SP' },
  { estado: 'Sergipe', uf: 'SE' },
  { estado: 'Tocantins', uf: 'TO' },
];

export default function EnderecoScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [stateIndex, setStateIndex] = useState<number | null>(null);
  const [buscandoCep, setBuscandoCep] = useState(false);

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  useEffect(() => {
    const carregarEnderecoSalvo = async () => {
      const salvo = await AsyncStorage.getItem('@MeuApp:endereco');
      if (salvo) {
        const dados = JSON.parse(salvo);
        setCep(dados.cep || '');
        setEndereco(dados.endereco || '');
        setBairro(dados.bairro || '');
        setCidade(dados.cidade || '');
        setNumero(dados.numero || '');
        setComplemento(dados.complemento || '');
        if (dados.stateIndex !== undefined && dados.stateIndex !== null) {
          setStateIndex(dados.stateIndex);
        } else if (dados.uf) {
          const idx = ESTADOS_BR.findIndex((e) => e.uf === dados.uf);
          if (idx >= 0) setStateIndex(idx);
        }
      }
    };
    carregarEnderecoSalvo();
  }, []);

  const consultarViaCep = async (digits: string) => {
    try {
      setBuscandoCep(true);
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await response.json();

      if (data?.erro) {
        mostrarAlerta('CEP não encontrado', 'Verifique o CEP digitado.');
        return;
      }

      if (data.logradouro) setEndereco(data.logradouro);
      if (data.bairro) setBairro(data.bairro);
      if (data.localidade) setCidade(data.localidade);
      if (data.uf) {
        const idx = ESTADOS_BR.findIndex(
          (item) => item.uf.toUpperCase() === String(data.uf).toUpperCase()
        );
        if (idx >= 0) setStateIndex(idx);
      }
    } catch {
      mostrarAlerta('Aviso', 'Não foi possível consultar o ViaCEP no momento.');
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleCepChange = (value: string) => {
    setCep(value);
    const digits = value.replace(/\D/g, '');
    if (digits.length === 8) {
      consultarViaCep(digits);
    }
  };

  const handleCycleState = () => {
    setStateIndex((prev) =>
      prev === null ? 0 : (prev + 1) % ESTADOS_BR.length
    );
  };

  const handleSaveAddress = async () => {
    if (!cep.trim() || !endereco.trim() || !numero.trim()) {
      mostrarAlerta('Campos obrigatórios', 'Preencha CEP, Endereço e Número.');
      return;
    }

    const selectedEstado =
      stateIndex !== null ? ESTADOS_BR[stateIndex].estado : 'São Paulo';
    const selectedUf =
      stateIndex !== null ? ESTADOS_BR[stateIndex].uf : 'SP';

    await AsyncStorage.setItem(
      '@MeuApp:endereco',
      JSON.stringify({
        cep: cep.trim(),
        endereco: endereco.trim(),
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        numero: numero.trim(),
        complemento: complemento.trim(),
        estado: selectedEstado,
        uf: selectedUf,
        stateIndex: stateIndex ?? 24,
      })
    );

    router.navigate('/cliente/carrinho');
  };

  const selectedEstado =
    stateIndex !== null ? ESTADOS_BR[stateIndex].estado : '';
  const selectedUf = stateIndex !== null ? ESTADOS_BR[stateIndex].uf : '';

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
            placeholder="CEP (ex: 04746-190)"
            value={cep}
            onChangeText={handleCepChange}
            keyboardType="numeric"
            maxLength={9}
            leftIcon="map-pin"
          />

          {buscandoCep ? (
            <View style={styles.loadingCepRow}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles.loadingCepText}>Buscando endereço no ViaCEP...</Text>
            </View>
          ) : null}

          <CustomInput
            placeholder="Endereço / Logradouro"
            value={endereco}
            onChangeText={setEndereco}
            leftIcon="home"
          />

          <CustomInput
            placeholder="Bairro"
            value={bairro}
            onChangeText={setBairro}
            leftIcon="map"
          />

          <CustomInput
            placeholder="Cidade"
            value={cidade}
            onChangeText={setCidade}
            leftIcon="navigation"
          />

          <View style={styles.row}>
            <CustomInput
              placeholder="Número"
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
              leftIcon="hash"
              containerStyle={styles.halfInputLeft}
            />

            <CustomInput
              placeholder="Complemento"
              value={complemento}
              onChangeText={setComplemento}
              leftIcon="plus-circle"
              containerStyle={styles.halfInputRight}
            />
          </View>

          <View style={styles.row}>
            <CustomInput
              placeholder="Estado"
              value={selectedEstado}
              editable={false}
              leftIcon="globe"
              rightIcon="chevron-down"
              onRightIconPress={handleCycleState}
              containerStyle={styles.halfInputLeft}
            />

            <CustomInput
              placeholder="UF"
              value={selectedUf}
              editable={false}
              leftIcon="flag"
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
  loadingCepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.s,
  },
  loadingCepText: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.primary,
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