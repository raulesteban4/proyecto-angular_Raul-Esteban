import { Libro } from './libros';

export interface Prestamo {
    id: string | number;
    libro: Libro;
    usuario: string;
    fechaPrestamo: string | Date;
    fechaDevolucion: string | Date;
    devuelto: boolean;
}