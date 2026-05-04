import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GestionarUsuarios } from '../../servicios/gestionar-usuarios';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-componente-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './componente-login.html',
  styleUrl: './componente-login.css'
})
export class ComponenteLogin {
  private auth = inject(GestionarUsuarios);
  private router = inject(Router);
  error: string="";
  codigo = '';
  clave = '';

  onSubmit() {
    this.auth.login(this.codigo, this.clave).subscribe({
      next: () => {
        this.error = "";
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        console.error('Login fallido', err);
        this.error = 'Codigo de usuario o contraseña incorrectos';
      }
    });
  }
}