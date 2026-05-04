import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GestionarLibros } from '../../servicios/gestionar-libros';
import { Libro } from '../../interfaces/libros';

@Component({
  selector: 'app-componente-alta-libro',
  templateUrl: './componente-alta-libro.html',
  styleUrls: ['./componente-alta-libro.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ComponenteAltaLibro {
  libro: Libro = {
    id: 0,
    titulo: '',
    autor: '',
    genero: '',
    anioPublicacion: new Date().getFullYear(),
    disponible: true,
    portada: '',
    resumen: ''
  };

  constructor(
    private librosService: GestionarLibros,
    private router: Router
  ) {}

  altaLibro(): void {
    this.librosService.altaLibro(this.libro).subscribe(result => {
      if (result.success) {
        alert('Libro dado de alta correctamente.');
        this.router.navigate(['/libros']);
      } else {
        const message = result.error || 'No se pudo dar de alta el libro.';
        alert(message);
        console.error('Error al crear libro:', result.details || result.error);
      }
    });
  }
}
