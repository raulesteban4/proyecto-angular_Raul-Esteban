import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Prestamo } from '../interfaces/prestamos';

@Injectable({
  providedIn: 'root'
})
export class GestionarPrestamos {
  private serviceUrl = '/prestamos.json';
  private storageKey = 'prestamos';

  constructor(private http: HttpClient) { }

  /** Cargar PRÉSTAMOS: JSON la 1ª vez; después LocalStorage */
  private cargarPrestamos(): Observable<Prestamo[]> {
    const prestamosLS = localStorage.getItem(this.storageKey);

    if (prestamosLS) {
      return of(JSON.parse(prestamosLS));
    } else {
      return this.http.get<Prestamo[]>(this.serviceUrl).pipe(
        map(prestamos => {
          localStorage.setItem(this.storageKey, JSON.stringify(prestamos));
          return prestamos;
        })
      );
    }
  }
/** Obtener lista de préstamos */
  getPrestamos(): Observable<Prestamo[]> {
  const prestamosLocal = localStorage.getItem(this.storageKey);

  if (prestamosLocal) {
    return of(JSON.parse(prestamosLocal));
  } else {
    return this.http.get<Prestamo[]>(this.serviceUrl).pipe(
      map(prestamos => {
        localStorage.setItem(this.storageKey, JSON.stringify(prestamos));
        return prestamos;
      })
    );
  }
}
  /** Obtener préstamo por ID */
  getPrestamo(id: number): Observable<Prestamo | undefined> {
    return this.getPrestamos().pipe(
      map(prestamos => prestamos.find(p => p.id === id))
    );
  }
  actualizarPrestamo(prestamoModificado: Prestamo): void {
    const prestamos = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

    const index = prestamos.findIndex((p: Prestamo) => p.id === prestamoModificado.id);

    if (index > -1) {
      prestamos[index] = prestamoModificado;
      localStorage.setItem(this.storageKey, JSON.stringify(prestamos));
    }
  }
}
