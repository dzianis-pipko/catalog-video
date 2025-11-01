/**
 * Форматирует дату в формат 'дд.м.гггг'
 * @param date - дата в формате строки
 * @returns отформатированная дата в формате 'дд.м.гггг'
 */
export function formatDate(date: string): string {
  const dateObj = new Date(date);
  
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1; // Месяцы в JS начинаются с 0
  const year = dateObj.getFullYear();
  
  return `${day.toString().padStart(2, '0')}.${month}.${year}`;
}