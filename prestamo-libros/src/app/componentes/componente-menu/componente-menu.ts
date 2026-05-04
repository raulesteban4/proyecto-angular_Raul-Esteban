import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GestionarLibros } from '../../servicios/gestionar-libros';
import { Libro } from '../../interfaces/libros';
import { GestionarUsuarios } from '../../servicios/gestionar-usuarios';

@Component({
  selector: 'app-componente-menu',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, RouterLink],
  templateUrl: './componente-menu.html',
  styleUrl: './componente-menu.css',
})
export class ComponenteMenu {
  private auth = inject(GestionarUsuarios);
  private router = inject(Router);
  estaAutenticado = this.auth.estaAutenticado;
  esAdmin = this.auth.esAdmin;
  private librosService = inject(GestionarLibros);

  libros: Libro[] = [];

  ngOnInit(): void {
    this.librosService.getLibros().subscribe((l) => (this.libros = l || []));
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        // Redirigir al login
        this.router.navigate(['/login']);
      }
    });
  }
}
