import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Libro } from '../interfaces/libros';

@Injectable({
  providedIn: 'root'
})
export class GestionarLibros {
  private serviceUrl = '/libros.json';
  private storageKey = 'libros';

  constructor(private http: HttpClient) { }

  private cargarLibros(): Observable<Libro[]> {
    const librosLS = localStorage.getItem(this.storageKey);
    if (librosLS) {
      return of(JSON.parse(librosLS));
    } else {
      return this.http.get<Libro[]>(this.serviceUrl).pipe(
        map(libros => {
          localStorage.setItem(this.storageKey, JSON.stringify(libros));
          return libros;
        })
      );
    }
  }

  getLibros(): Observable<Libro[]> {
    const librosLocal = localStorage.getItem(this.storageKey);
    if (librosLocal) {
      return of(JSON.parse(librosLocal));
    } else {
      return this.http.get<Libro[]>(this.serviceUrl).pipe(
        map(libros => {
          localStorage.setItem(this.storageKey, JSON.stringify(libros));
          return libros;
        })
      );
    }
  }
  getLibro(id: number): Observable<Libro|undefined> {
    return this.getLibros().pipe(
      map((libros) => libros.find((l) => l.id === id))
    );
  }

  altaLibro(libro: Libro): Observable<boolean> {
    return this.cargarLibros().pipe(
      map(libros => {
        // Evitar duplicados por ID
        if (libros.some(l => l.id === libro.id)) return false;
        libros.push(libro);
        localStorage.setItem(this.storageKey, JSON.stringify(libros));
        return true;
      })
    );
  }

   bajaLibro(id: number): Observable<boolean> {
    return this.cargarLibros().pipe(
      map(libros => {
        const index = libros.findIndex(l => l.id === id);
        if (index === -1) return false;

        // Eliminar libro
        libros.splice(index, 1);
        localStorage.setItem(this.storageKey, JSON.stringify(libros));

        // Eliminar préstamos asociados a ese libro
      const prestamos = JSON.parse(localStorage.getItem('prestamos') || '[]');
      const prestamosFiltrados = prestamos.filter((p: any) => p.libro?.id !== id);
      localStorage.setItem('prestamos', JSON.stringify(prestamosFiltrados));

        return true;
      })
    );
  }

  modificarLibro(libroModificado: Libro): void {
  // 1. Actualizar libro
  const libros = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  const index = libros.findIndex((l: Libro) => l.id === libroModificado.id);

  if (index > -1) {
    libros[index] = libroModificado;
    localStorage.setItem(this.storageKey, JSON.stringify(libros));
  }

  // 2. Sincronizar préstamos
  const prestamos = JSON.parse(localStorage.getItem('prestamos') || '[]');

  const prestamosActualizados = prestamos.map((p: any) => {
    if (p.libro.id === libroModificado.id) {
      return {
        ...p,
        libro: libroModificado   // actualizar libro dentro del préstamo
      };
    }
    return p;
  });

  // 3. Guardar préstamos actualizados
  localStorage.setItem('prestamos', JSON.stringify(prestamosActualizados));
}
}
