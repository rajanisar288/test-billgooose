export const getCurrentRelativeUrl = (): string => {
  if (typeof window === 'undefined') return '';
  return `${window.location.pathname}${window.location.search}`;
};
