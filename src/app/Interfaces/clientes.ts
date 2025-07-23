export interface Clientes {
    id: string;
    typeClientId: string;
    name?: string;
    lastName?: string;
    cedula?: string;
    email?: string;
    city?: string;
    birthdate: Date;
    phone?: string;
    address?: string;
    isAfiliate: boolean;
    isConsumer: boolean;
    urlImagen: string
}

