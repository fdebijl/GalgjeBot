/** Find the statistical mode in an array, i.e. the value that occurs most often. Usefull for determing the most popular letter/word */
export const findMode = (array: string[]): string | null => {
  const initialValue: {
    mode: null | string;
    greatestFreq: number;
    numMapping: {
      [key: string]: number;
    }
  } = {
    mode: null,
    greatestFreq: -Infinity,
    numMapping: {}
  };

  return array.reduce(function(current, item) {
    const val = current.numMapping[item] = (current.numMapping[item] || 0) + 1;
    if (val > current.greatestFreq) {
        current.greatestFreq = val;
        current.mode = item;
    }
    return current;
  }, initialValue).mode;
}
