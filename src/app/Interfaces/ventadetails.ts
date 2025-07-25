import { ProductoDTO } from "./productos";

export interface Ventadetails {
    id: string;
    quantity: number;
    code?: string;
    price: number;
    discount?: number;
    iva?: number;
    subTotal?: number;
    total?: number;
    productoId: string;
}
export interface VentadetailViewModel {
    id: string;
    quantity: number;
    code?: string;
    price: number;
    discount?: number;
    iva?: number;
    subTotal?: number;
    total?: number;
    productoId: string;
    producto: ProductoDTO
}