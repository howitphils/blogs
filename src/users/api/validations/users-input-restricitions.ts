export const userInputRestrictions = {
  login: {
    minLength: 3,
    maxLength: 10,
    pattern: /^[a-zA-Z0-9_-]*$/,
  },
  password: {
    minLength: 6,
    maxLength: 20,
  },
  email: {
    pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  },
};
