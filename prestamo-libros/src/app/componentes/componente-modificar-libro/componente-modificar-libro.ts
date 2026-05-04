import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GestionarLibros } from '../../servicios/gestionar-libros';
import { Libro } from '../../interfaces/libros';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-componente-modificar-libro',
  imports: [FormsModule, CommonModule],
  templateUrl: './componente-modificar-libro.html',
  styleUrl: './componente-modificar-libro.css',
})
export class ComponenteModificarLibro {
  libro?: Libro;

  constructor(
    private route: ActivatedRoute,
    private librosService: GestionarLibros,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getLibro();
  }

  getLibro(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.librosService.getLibro(id).subscribe(libro => this.libro = libro);
  }

  guardar(): void {
    if (this.libro) {
      this.librosService.modificarLibro(this.libro);
      alert('Libro modificado correctamente');
      this.goBack();
    }
  }

  goBack(): void {
    this.location.back();
  }
}
