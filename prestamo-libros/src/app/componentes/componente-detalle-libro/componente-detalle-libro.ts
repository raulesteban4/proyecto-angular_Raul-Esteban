import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Libro } from '../../interfaces/libros';
import { UpperCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GestionarLibros } from '../../servicios/gestionar-libros';
import { Location } from '@angular/common';

@Component({
  selector: 'app-componente-detalle-libro',
  imports: [FormsModule, UpperCasePipe],
  templateUrl: './componente-detalle-libro.html',
  styleUrl: './componente-detalle-libro.css',
})
export class ComponenteDetalleLibro {
  libro?: Libro;

  constructor(
    private route: ActivatedRoute,
    private librosService: GestionarLibros,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.getLibro());
  }

  getLibro(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.librosService.getLibro(id)
      .subscribe(libro => this.libro = libro);
  }

  goBack(): void {
    this.location.back();
  }
}
