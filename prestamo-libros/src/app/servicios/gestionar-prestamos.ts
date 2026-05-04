import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Prestamo } from '../interfaces/prestamos';

@Injectable({
  providedIn: 'root'
})
export class GestionarPrestamos {
  private serviceUrl = 'http://localhost:3000/prestamos';

  constructor(private http: HttpClient) { }

  private normalizePrestamo(prestamo: any): Prestamo {
    return {
      ...prestamo,
      id: prestamo._id || prestamo.id,
      libro: {
        ...prestamo.libro,
        id: prestamo.libro?._id || prestamo.libro?.id
      },
      usuario: typeof prestamo.usuario === 'string' ? prestamo.usuario : prestamo.usuario?.nombre || prestamo.usuario?.codigo || '',
      fechaPrestamo: prestamo.fechaPrestamo,
      fechaDevolucion: prestamo.fechaDevolucion,
      devuelto: prestamo.devuelto
    };
  }

  getPrestamos(): Observable<Prestamo[]> {
    return this.http.get<any[]>(this.serviceUrl).pipe(
      map(prestamos => prestamos.map(p => this.normalizePrestamo(p)))
    );
  }

  getPrestamo(id: string | number): Observable<Prestamo | undefined> {
    return this.http.get<any>(`${this.serviceUrl}/${id}`).pipe(
      map(p => this.normalizePrestamo(p)),
      catchError(() => of(undefined))
    );
  }

  actualizarPrestamo(prestamoModificado: Prestamo): Observable<boolean> {
    return this.http.put<any>(`${this.serviceUrl}/${prestamoModificado.id}`, {
      fechaDevolucion: prestamoModificado.fechaDevolucion,
      devuelto: prestamoModificado.devuelto
    }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  crearPrestamo(libroId: string | number, fechaDevolucion: string | Date): Observable<boolean> {
    return this.http.post<any>(this.serviceUrl, { libroId, fechaDevolucion }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
