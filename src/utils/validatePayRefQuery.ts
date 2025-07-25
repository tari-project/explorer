import { validateHash } from '@utils/helpers';

export const validatePayRefQuery = (query: string) => {
  const isHash = validateHash(query);
  return isHash;
};
