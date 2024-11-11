/**
 * convert to Opencamelcase
 * @param str
 */
export async function toOpenCamelCase(str: string) {
  if (!str) return '';

  const normalizedStr = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const cleanedStr = normalizedStr.replace(/[^a-zA-Z0-9]+/g, ' ').trim();

  // const ignoredWords = ['a', 'an', 'the', 'and', 'or', 'but', 'of', 'in', 'on'];

  const words = cleanedStr
    .split(' ')
    // .filter(word => word.length > 0 && !ignoredWords.includes(word.toLowerCase()));

  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
// export async function toOpenCamelCase(str: string) {
//   if (!str) return '';
//   const normalizedStr = str
//     .normalize('NFD')
//     .replace(/[\u0300-\u036f]/g, '');
//
//   const cleanedStr = normalizedStr.replace(/[^a-zA-Z0-9']+/g, ' ').trim();
//
//   return cleanedStr
//     .toLowerCase()
//     .split(' ')
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//     .join('');
// }

