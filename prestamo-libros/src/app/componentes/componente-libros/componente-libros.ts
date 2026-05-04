import { Component, ViewChild, inject } from '@angular/core';
import { GestionarLibros } from '../../servicios/gestionar-libros';
import { GestionarUsuarios } from '../../servicios/gestionar-usuarios';
import { Libro } from '../../interfaces/libros';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ComponenteFiltrar } from '../componente-filtrar/componente-filtrar';


@Component({
  selector: 'app-componente-libros',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterModule, ComponenteFiltrar],
  templateUrl: './componente-libros.html',
  styleUrl: './componente-libros.css',
})
export class ComponenteLibros {
  libros: Libro[] = [];
  dataSource = new MatTableDataSource<Libro>([]);
  displayedColumns: string[] = ['id', 'portada', 'titulo', 'autor', 'genero', 'anioPublicacion', 'disponible', 'acciones'];
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  private gestionarLibros = inject(GestionarLibros);
  private auth = inject(GestionarUsuarios);

  estaAutenticado = this.auth.estaAutenticado;
  esAdmin = this.auth.esAdmin;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getLibros(): void {
    this.gestionarLibros.getLibros().subscribe((datos) => {
      this.libros = datos;
      this.dataSource = new MatTableDataSource(this.libros);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnInit() {
    this.getLibros();
  }

  eliminarLibro(id: string | number): void {
    if (!confirm('¿Desea eliminar este libro?')) return;
    this.gestionarLibros.bajaLibro(id).subscribe(success => {
      if (success) {
        alert('Libro eliminado.');
        this.getLibros(); // refresca la tabla
      } else {
        alert('No se pudo eliminar el libro.');
      }
    });
  }
}
