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

export type ErrorResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export interface HostSignupFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string
  accountHolderName?: string;
  ifsc?: string;
  accountNumber?: string;
  branch?: string;
  kyc_panCard?: string;
  kyc_idProof?: string;
  kyc_addressProof?: string;
  registrationCertificate?: string;
  safetyCertificate?: string;
  license?: string;
  insurance?: string;
}