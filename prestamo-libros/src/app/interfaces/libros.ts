export interface Libro {
    id: string | number;
    titulo: string;
    autor: string;
    genero: string;
    anioPublicacion: number;
    disponible: boolean;
    portada: string;
    resumen?: string;
}