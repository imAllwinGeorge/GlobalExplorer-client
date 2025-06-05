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

export interface AuthResponse {
  user?: User | null | undefined,
  token?: string | null | undefined;
  message?: string;
}
export interface ResponseType<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string,string>;
  config: {
    url?: string;
    method?: string;
  };
  request?: unknown;
}

export type ChildrenProps = {
    children: React.ReactNode
}

