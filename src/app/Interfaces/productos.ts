export interface Productos {

    id: string,
    name: string,
    description: string,
    brand: string,
    price: number,
    porcentageIva: number,
    porcentageDiscount: number,
    stock: number,
    state: boolean,
    typeProductId: string;
    codePr: string;
    urlImagen:string;
    empresaId:string
}

export interface ProductoDTO {

    id: string,
    name: string,
    description: string,
}
