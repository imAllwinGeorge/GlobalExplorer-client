export interface SignupDTO {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string
}

export interface LoginDTO {
    email: string,
    password: string
}

export interface HostSignupDTO {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string,
  kyc_idProof: File | null,
  kyc_addressProof: File | null,
  kyc_panCard: File | null,
  accountHolderName: string,
  accountNumber: string,
  branch: string,
  ifsc: string,
  registrationCertificate: File | null,
  safetyCertificate: File | null,
  insurance: File | null,
  license: File | null,
}