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