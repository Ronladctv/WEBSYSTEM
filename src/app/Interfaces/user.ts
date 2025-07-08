export interface User {
    id?:string;
    nameProfile?:string;
    name?: string;
    lastName?: string;
    email?: string;
    cedula?: string;
    phone?: string;
    typeUserId?:string;
    password?:string;
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
