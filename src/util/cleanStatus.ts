import { CONFIG } from '../config';

// Clean a status up for processing
// Removes '@galgjebot' and non-alphanumerical characters or spaces
// Output is always lowercased
// Trailing and leading whitespace is removed
export const cleanStatus = (statusText: string): string => {
  const userNameRegEx = new RegExp(`@${CONFIG.TWITTER_HANDLE}`, 'gi')
  return statusText
    // Remove '@galgjebot'
    .replace(userNameRegEx, '')
    // Remove non-alphanumerical characters, but maintain spaces so we can check for multi-word statuses later, so we can remove them
    .replace(/[^0-9a-zA-ZÀ-ž\s]/gi, '')
    // Lowercase the output for consistent checking, because gameword will always be lowercase aswell
    .toLowerCase()
    // Remove trailing and leading whitespace
    .trim();
}