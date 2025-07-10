import { Empresas } from './empresas';

export interface ResponseAcces
{
    status:boolean;
    msg:string,
    value:any
}
export interface ResponseAccesLogin
{
    status:boolean;
    msg:LoginResponse,
    value:any
}

export interface LoginResponse
{
    Token?:string
    Empresas?:Empresas[]
}