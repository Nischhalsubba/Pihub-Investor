export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;

export const phoneNumber = value =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? 'Invalid phone number, must be 10 digits'
    : undefined;
export const required = value =>
  value || typeof value === 'number' ? undefined : '* Required';

export const number = value =>
  value && isNaN(Number(value)) ? '* Must be a number' : undefined;

export const same = (value1, value2) =>
  value1 === value2 ? 'Password Mismatch' : undefined;
var strongRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
);
export const password = value =>
  value && !strongRegex.test(value)
    ? `Password must contain atleast one Capital letter, one small letter, one numeric value and must be 8 digit long`
    : undefined;

