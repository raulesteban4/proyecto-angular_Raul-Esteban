import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Prestamo } from '../../interfaces/prestamos';
import { GestionarPrestamos } from '../../servicios/gestionar-prestamos';
import { RouterLink } from "@angular/router";
import { ComponenteFiltrar } from '../componente-filtrar/componente-filtrar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-componente-prestamos',
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterLink, ComponenteFiltrar, MatTableModule],
  templateUrl: './componente-prestamos.html',
  styleUrl: './componente-prestamos.css',
})
export class ComponentePrestamos {
  prestamos: Prestamo[] = [];
  dataSource = new MatTableDataSource<Prestamo>([]);

  constructor(private gestionarPrestamos: GestionarPrestamos) { }

  getPrestamos(): void {
    this.gestionarPrestamos.getPrestamos().subscribe(prestamos => {

      // Cargar libros actualizados
      const libros = JSON.parse(localStorage.getItem('libros') || '[]');

      // Reemplazar el libro de cada préstamo por el libro actualizado
      this.prestamos = prestamos.map(prestamo => {
        const libroActualizado = libros.find((l: any) => l.id === prestamo.libro.id);
        if (libroActualizado) {
          prestamo.libro = libroActualizado;
        }
        return prestamo;
      });

      // Actualizar dataSource con los préstamos filtrados
      this.dataSource.data = this.prestamos;
    });
  }

  ngOnInit() {
    this.getPrestamos();

    // Filtro personalizado para préstamos
    this.dataSource.filterPredicate = (data, filter: string) => {
      const texto = filter.trim().toLowerCase();
      return data.usuario.toLowerCase().includes(texto) ||
        data.libro.titulo.toLowerCase().includes(texto);
    };
  }

  trackById(index: number, item: Prestamo) {
    return item.id;
  }

  marcarDevuelto(prestamo: Prestamo): void {
    // Cambiar el estado local (actualiza el color y el texto al instante)
    prestamo.devuelto = !prestamo.devuelto;

    // Actualizar préstamo en LocalStorage
    this.gestionarPrestamos.actualizarPrestamo(prestamo);

    // Actualizar la disponibilidad del libro en LocalStorage
    const libros = JSON.parse(localStorage.getItem('libros') || '[]');
    const libroIndex = libros.findIndex((l: any) => l.id === prestamo.libro.id);

    if (libroIndex > -1) {
      // Si devuelto = true, libro disponible = true; si devuelto = false, libro ocupado = false
      libros[libroIndex].disponible = prestamo.devuelto;
      localStorage.setItem('libros', JSON.stringify(libros));
    }

    // Refrescar la lista de préstamos para que se actualice la vista
    this.getPrestamos();
  }
}
