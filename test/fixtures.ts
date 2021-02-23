// Expect Letters: ['a', 'c']
// Expect Words: []
export const TEST_STATUSES_VALID_LETTERS = [
  { text: '@galgjebot A' },
  { text: '@galgjebot A' },
  { text: '@galgjebot a' },
  { text: '@galgjebot a' },
  { text: '@galgjebot c' },
  { text: '@galgjebot c' },
  { text: '@galgjebot  c ' }
];
// Expect Letters: ['a']
// Expect Words: ['veeziekte', 'kutromy', 'sjon']
export const TEST_STATUSES_VALID_WORDS = [
  { text: '@galgjebot veeziekte' },
  { text: '@galgjebot wegracer' },
  { text: '@galgjebot veeziekte' },
  { text: '@galgjebot sjon' },
  { text: '@galgjebot a' },
  { text: '@galgjebot A' }
];
// Expect Letters: ['a']
// Expect Words: []
export const TEST_STATUSES_SINGLE_LETTER = [
  { text: '@galgjebot A' }
];
// Expect Letters: []
// Expect Words: ['rutkomy']
export const TEST_STATUSES_SINGLE_WORD = [
  { text: '@galgjebot veeziekte' }
];
// Expect: false
export const TEST_STATUSES_INVALID_MULTILETTERS = [
  { text: '@galgjebot a b x' },
  { text: '@galgjebot c y k a b l y a t' }
];
// Expect: false
export const TEST_STATUSES_INVALID_MULTIWORDS = [
  { text: '@galgjebot er was eens' },
  { text: '@galgjebot een heks in het bos' }
];
// Expect Letters: ['a', 'b']
// Expect Words: []
export const TEST_STATUSES_SOME_VALID_LETTERS = [
  { text: '@galgjebot a' },
  { text: '@galgjebot ongeldige status' },
  { text: '@galgjebot A' },
  { text: '@galgjebot B' },
  { text: '@galgjebot doe eens lief' },
];
// Expect Letters: []
// Expert Words: ['romy']
export const TEST_STATUSES_SOME_VALID_WORDS = [
  { text: '@galgjebot er was eens' },
  { text: '@galgjebot een heks genaamd' },
  { text: '@galgjebot rutte' },
];
