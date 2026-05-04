import { Libro } from './libros';

export interface Prestamo {
    id: number;
    libro: Libro;
    usuario: string;
    fechaPrestamo: Date;
    fechaDevolucion: Date;
    devuelto: boolean;
}