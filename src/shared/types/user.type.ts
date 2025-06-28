export type UserRoles = "user" | "admin"

export interface IAdmin {
    firstName: string,
    lastName: string,
    email: string;
    password: string;
    role: string;
    _id: string
}

export interface IHost {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    _id: string;
}





