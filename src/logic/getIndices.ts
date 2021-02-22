// Returns all the instances of a letter within a word
export const getIndices = (word: string, letter: string): number[] => {
  const indices: number[] = [];

  for(let j = 0; j < word.length; j++) {
    if (word[j] == letter) {
      indices.push(j);
    }
  }

  return indices;
}
