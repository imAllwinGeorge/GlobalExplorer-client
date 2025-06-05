export interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginFormError {
  email?: string;
  password?: string;
}