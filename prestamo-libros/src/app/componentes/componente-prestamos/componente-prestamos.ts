import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Prestamo } from '../../interfaces/prestamos';
import { GestionarPrestamos } from '../../servicios/gestionar-prestamos';
import { GestionarUsuarios } from '../../servicios/gestionar-usuarios';
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
  esAdmin: any;

  constructor(private gestionarPrestamos: GestionarPrestamos, private auth: GestionarUsuarios) {
    this.esAdmin = this.auth.esAdmin;
  }

  getPrestamos(): void {
    this.gestionarPrestamos.getPrestamos().subscribe(prestamos => {
      this.prestamos = prestamos;
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
    prestamo.devuelto = !prestamo.devuelto;
    this.gestionarPrestamos.actualizarPrestamo(prestamo).subscribe(success => {
      if (!success) {
        alert('No se pudo actualizar el préstamo. Solo un admin puede hacerlo.');
      }
      this.getPrestamos();
    });
  }
}
