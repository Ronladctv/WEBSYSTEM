export interface Roles {
    id: string,
    nameRol: string,
    icon: string,
    description: string
    permissions: PermissionRole[]
}


export interface PermissionRole {
    id: string;
    name?: string;
}