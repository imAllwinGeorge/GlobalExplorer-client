import type { LoginDTO } from "../types/DTO";
import type { LoginFormError } from "../types/auth.type";
import { isValidEmail, isValidPassword } from "./validations";

export const validateLoginForm = (data: LoginDTO) => {
  const errors: LoginFormError = {};

  if (!isValidEmail(data.email)) {
    errors.email = "please enter valid email address";
  }

  if (!isValidPassword(data.password)) {
    errors.password =
      "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.";
  }

  return errors;
};
