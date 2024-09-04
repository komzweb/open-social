export const validationPatterns = {
  username: {
    chars: /^[a-zA-Z0-9_]+$/,
    startChar: /^[a-zA-Z]/,
  },
  // password: {
  //   chars: /^[a-zA-Z0-9!@#$%^&*]+$/,
  //   required: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$/,
  // },
  url: /^(https:\/\/.+)?$/,
}
