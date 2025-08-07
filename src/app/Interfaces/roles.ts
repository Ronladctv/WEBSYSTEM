export interface Roles {
    id: string,
    nameRol: string,
    icon: string,
    description: string,
    permissions: PermissionRole[],
    urlImagen: string,
    state: boolean
}


export interface PermissionRole {
    id: string;
    name?: string;
}
export interface RolPermissionDTO {
    permissionList: string[];
}