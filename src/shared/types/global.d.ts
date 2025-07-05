export interface User {
  _id: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  role: string,
  isBlocked: boolean,
  password?: string,
  createAt: Date,
  updateAt: Date,
  token: string
}
export interface Host {
  _id: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  role: string,
  isBlocked: boolean,
  password?: string,
  kyc_idProof: string,
  kyc_addressProof: string,
  kyc_panCard: string,
  kyc_verified: string,
  accountHolderName: string,
  accountNumber: string,
  ifsc: string,
  branch: string,
  registrationCertificate: string,
  safetyCertificate: string,
  license: string,
  insurance: string,
  isVerified: string,
  createdAt: Date,
  updatedAt: Date,
}

export interface Category {
  _id: string,
  categoryName: string,
  description: string,
  isActive: string,
  createdAt: string,
  updatedAt: string,
}

export interface AuthResponse {
  user?: User | Host | null | undefined,
  category?: Category
  token?: string | null | undefined;
  message?: string;
}
export interface ResponseType<T> {
  data: T;
  status: number;
  statusText?: string;
  headers?: Record<string,string>;
  config?: {
    url?: string;
    method?: string;
  };
  request?: unknown;
}

export type ChildrenProps = {
    children: React.ReactNode
}

