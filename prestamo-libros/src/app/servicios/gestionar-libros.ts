import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Libro } from '../interfaces/libros';

@Injectable({
  providedIn: 'root'
})
export class GestionarLibros {
  private serviceUrl = 'http://localhost:3000/libros';

  constructor(private http: HttpClient) { }

  private normalizeLibro(libro: any): Libro {
    return {
      ...libro,
      id: libro._id || libro.id,
      titulo: libro.titulo,
      autor: libro.autor,
      genero: libro.genero,
      anioPublicacion: libro.anioPublicacion,
      disponible: libro.disponible,
      portada: libro.portada,
      resumen: libro.resumen
    };
  }

  getLibros(): Observable<Libro[]> {
    return this.http.get<any[]>(this.serviceUrl).pipe(
      map(libros => libros.map(libro => this.normalizeLibro(libro)))
    );
  }

  getLibro(id: string | number): Observable<Libro | undefined> {
    return this.http.get<any>(`${this.serviceUrl}/${id}`).pipe(
      map(libro => this.normalizeLibro(libro)),
      catchError(() => of(undefined))
    );
  }

  altaLibro(libro: Libro): Observable<{ success: boolean; error?: string; details?: any }> {
    const { id, ...libroSinId } = libro;
    return this.http.post<any>(this.serviceUrl, libroSinId).pipe(
      map(() => ({ success: true })),
      catchError((err) => {
        console.error('Error al crear libro:', err);
        return of({
          success: false,
          error: err.error?.message || err.message || 'Error al crear libro',
          details: err.error?.errores || null
        });
      })
    );
  }

  bajaLibro(id: string | number): Observable<boolean> {
    return this.http.delete<any>(`${this.serviceUrl}/${id}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  modificarLibro(libroModificado: Libro): Observable<{ success: boolean; error?: string; details?: any }> {
    const { id, ...libroSinId } = libroModificado;
    return this.http.put<any>(`${this.serviceUrl}/${id}`, libroSinId).pipe(
      map(() => ({ success: true })),
      catchError((err) => {
        console.error('Error al modificar libro:', err);
        return of({
          success: false,
          error: err.error?.message || err.message || 'Error al modificar libro',
          details: err.error?.errores || null
        });
      })
    );
  }
}
