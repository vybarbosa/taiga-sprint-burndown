/**
 * Função para converter uma string de tempo no formato 'h.mm' para minutos.
 *
 * @param { string } time - A string de tempo a ser convertida (formato 'h.mm').
 * @return { number } O tempo convertido em minutos.
 */
export function parseTime(time: string): number {
  const [hours, minutes] = time.split('.').map(Number);
  return hours * 60 + (minutes || 0); // convert to minutes
}