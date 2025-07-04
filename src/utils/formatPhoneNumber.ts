export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return 'Sem número';
  
  // Remove todos os caracteres não numéricos
  const cleanNumber = phone.replace(/\D/g, '');
  
  // Se o número já tem código do país (55), remove
  let numberWithoutCountry = cleanNumber;
  if (cleanNumber.startsWith('55') && cleanNumber.length > 10) {
    numberWithoutCountry = cleanNumber.substring(2);
  }
  
  // Aplica a máscara brasileira
  if (numberWithoutCountry.length === 11) {
    return `+55 (${numberWithoutCountry.slice(0, 2)}) ${numberWithoutCountry.slice(2, 7)}-${numberWithoutCountry.slice(7)}`;
  } else if (numberWithoutCountry.length === 10) {
    return `+55 (${numberWithoutCountry.slice(0, 2)}) ${numberWithoutCountry.slice(2, 6)}-${numberWithoutCountry.slice(6)}`;
  }
  
  return phone; // Retorna o número original se não conseguir formatar
}

export function cleanPhoneForBackend(phone: string): string {
  if (!phone) return '';
  
  // Remove todos os caracteres não numéricos
  const cleanNumber = phone.replace(/\D/g, '');
  
  // Remove o código do país (55) se presente
  if (cleanNumber.startsWith('55') && cleanNumber.length > 10) {
    return cleanNumber.substring(2);
  }
  
  return cleanNumber;
} 