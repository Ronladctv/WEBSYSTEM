export interface Permissions {
    id: string,
    name: string,
    icon: string,
    urlImagen: string
    accions: Accions[]
}

export interface Accions {
    accionId: string;
    nombre?: string;
    descripcion?: string;
}
