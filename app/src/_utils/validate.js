const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const email = value => value && !EMAIL.test(String(value).trim()) ? 'Enter a valid email address.' : undefined;
export const newEmail = email;
export const required = value => (value || typeof value === 'number' ? undefined : 'Required.');
export const number = value => value !== undefined && value !== null && value !== '' && Number.isNaN(Number(value)) ? 'Enter a number.' : undefined;
export const phoneNumber = value => value && !/^\+?[0-9 ()-]{7,20}$/.test(String(value)) ? 'Enter a valid phone number.' : undefined;
export const same = (value1, value2) => value1 === value2 ? undefined : 'Values do not match.';
export const password = value => value && !STRONG_PASSWORD.test(String(value))
  ? 'Use at least 8 characters with uppercase, lowercase, number and symbol.'
  : undefined;
