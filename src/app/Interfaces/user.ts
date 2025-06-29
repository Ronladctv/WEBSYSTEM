export interface User {
    Name?: string;
    LastName?: string;
    Email?: string;
    Cedula?: string;
    Phone?: string;
}
export interface UserResponse {
    isSuccess: boolean;
    message: string;
    data: User[];
}

export interface UserLogin {
    email:string;
    password:string;
    empresaId?:string;
}
