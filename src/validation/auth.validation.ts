import { formatJSONResponse } from '@/libs/api-gateway';

interface NewUser {
  email: string;
  password: string;
}

export const validateAuth = (userData: NewUser) => {
  function minLength(data: string, length: number) {
    return String(data).length >= length ? true : false;
  }
  function maxLength(data: string, length: number) {
    return String(data).length <= length ? true : false;
  }
  function isEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  const { email, password } = userData;

  const isEmailValid =
    minLength(email, 8) && maxLength(email, 48) && isEmail(email);

  const isPasswordValid = minLength(password, 6) && maxLength(password, 32);

  if (!isEmailValid || !isPasswordValid) {
    return formatJSONResponse(400, {
      error: 'Email or password is not valid.',
    });
  }
  return userData;
};
