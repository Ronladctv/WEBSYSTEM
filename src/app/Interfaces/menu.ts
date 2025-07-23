export interface Menu {
    id:string,
    nombre:string,
    url:string,
    icono:string,
}

export interface RoleViewModel {
    id:string,
    nombre:string,
    menus:MenuViewModel[]
}
export interface MenuViewModel {
    id:string,
    nombre:string,
}

export interface MenuDTO {
    id:string,
    nombre:string,
    url:string,
    icono:string,
}



