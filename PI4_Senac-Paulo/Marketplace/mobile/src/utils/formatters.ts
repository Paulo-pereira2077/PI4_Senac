/**
 * Formata um valor numérico para a moeda Real brasileiro (BRL)
 * @param value Valor numérico a ser formatado
 * @returns String formatada em BRL (ex: R$ 10,00)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata uma data para o padrão brasileiro
 * @param date Data a ser formatada
 * @returns String formatada em dd/mm/aaaa
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(d);
};
