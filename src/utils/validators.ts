export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isStrongPassword = (value: string): boolean =>
  value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value);
