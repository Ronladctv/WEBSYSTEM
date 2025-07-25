import { ProductoDTO } from "./productos";
import { Ventadetails, VentadetailViewModel } from "./ventadetails";

export interface Ventas {
    id: string;
    total: number;
    subTotal: number;
    iva: number;
    discount?: number;
    usuariod: string;
    clientId?: string;
    ventaDetails: Ventadetails[];
}

export interface VentasViewModel {
    code?: string;
    date: string;
    id: string;
    total: number;
    subTotal: number;
    iva: number;
    discount?: number;
    usuariod: string;
    clientId?: string;
    ventaDetails: VentadetailViewModel[];

}
