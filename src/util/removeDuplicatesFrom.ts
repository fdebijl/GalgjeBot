export const removeDuplicatesFrom = (array: string[]): string[] => {
  const seen: {
    [key: string]: unknown;
  } = {};
  return array.filter(function(item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}
