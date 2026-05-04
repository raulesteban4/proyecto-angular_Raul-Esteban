import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GestionarLibros } from '../../servicios/gestionar-libros';
import { GestionarPrestamos } from '../../servicios/gestionar-prestamos';
import { Libro } from '../../interfaces/libros';
import { Prestamo } from '../../interfaces/prestamos';
import { GestionarUsuarios } from '../../servicios/gestionar-usuarios';

@Component({
  selector: 'app-componente-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './componente-dashboard.html',
  styleUrl: './componente-dashboard.css', 
})

export class ComponenteDashboard {
  public auth = inject(GestionarUsuarios);
  private librosSvc = inject(GestionarLibros);
  private prestamosSvc = inject(GestionarPrestamos);

  libros: Libro[] = [];
  prestamos: any[] = [];

  totalLibros = 0;
  totalPrestamos = 0;
  prestamosActivos = 0;
  librosNoDisponibles = 0;

  topLibros: { titulo: string; count: number }[] = [];
  topUsuarios: { usuario: string; count: number }[] = [];
  recentPrestamos: any[] = [];

  constructor() {
    this.librosSvc.getLibros().subscribe((l) => {
      this.libros = l;
      this.computeStats();
    });

    this.prestamosSvc.getPrestamos().subscribe((p) => {
      this.prestamos = p;
      this.computeStats();
    });
  }

  private computeStats() {
    this.totalLibros = this.libros.length;
    this.totalPrestamos = this.prestamos.length;
    this.prestamosActivos = this.prestamos.filter((x) => !x.devuelto).length;
    this.librosNoDisponibles = this.libros.filter((x) => !x.disponible).length;

    const bookCounts: Record<string, { titulo: string; count: number }> = {};
    for (const p of this.prestamos) {
      const id = String(p.libro?.id ?? '');
      const titulo = p.libro?.titulo ?? 'Sin título';
      if (!bookCounts[id]) bookCounts[id] = { titulo, count: 0 };
      bookCounts[id].count++;
    }

    this.topLibros = Object.values(bookCounts).sort((a, b) => b.count - a.count).slice(0, 5);

    const userCounts: Record<string, number> = {};
    for (const p of this.prestamos) {
      const u = p.usuario || 'Desconocido';
      userCounts[u] = (userCounts[u] || 0) + 1;
    }
    this.topUsuarios = Object.entries(userCounts)
      .map(([usuario, count]) => ({ usuario, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    this.recentPrestamos = [...this.prestamos]
      .sort((a, b) => new Date(b.fechaPrestamo).getTime() - new Date(a.fechaPrestamo).getTime())
      .slice(0, 5);
  }
}


