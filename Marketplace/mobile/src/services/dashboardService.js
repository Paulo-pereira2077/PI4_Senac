import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import api from './api';

export async function exportarRelatorio(formato = 'json', token) {
  const extensao = formato === 'csv' ? 'csv' : 'json';
  const url = `${api.defaults.baseURL}/api/dashboard/exportar?formato=${extensao}`;
  const caminhoLocal = `${FileSystem.documentDirectory}relatorio_vendas.${extensao}`;

  const download = await FileSystem.downloadAsync(url, caminhoLocal, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (download.status !== 200) {
    throw new Error('Falha ao baixar o relatório.');
  }

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(download.uri);
  }
}