export const isValidPassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  
    return password.length >= minLength && hasNumber.test(password) && hasSpecialChar.test(password);
  };
  