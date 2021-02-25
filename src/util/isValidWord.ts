export const isValidWord = (word: string): boolean => {
  const wordHasSpaces = word.split(' ').length > 1;
  const wordIsAlphaNumerical = word.match(/^\w+$/)?.length === 1;
  return !wordHasSpaces && wordIsAlphaNumerical;
}
