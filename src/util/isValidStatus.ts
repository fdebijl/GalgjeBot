import { cleanStatus } from './cleanStatus';

// A status should either be a single letter or a single word, otherwise we're just not gonna count it
export const isValidStatus = (statusText: string | undefined): boolean => {
  if (!statusText) {
    return false;
  }

  statusText = cleanStatus(statusText);
  // Whether we're checking for letters or words, we don't want to process tweets with more than one word
  if (statusText.split(' ').length > 1) {
    return false;
  }

  return true;
}
