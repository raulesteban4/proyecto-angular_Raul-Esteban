import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap, throwError } from 'rxjs';
import { RespuestaAuth } from '../interfaces/respuestaAuth';
import { Usuario } from '../interfaces/usuario'

@Injectable({
  providedIn: 'root'
})
export class GestionarUsuarios {
  private http = inject(HttpClient);

  private apiURL =  'http://localhost:3000/usuarios';

  // Señal privada para el usuario autenticado (o null si nadie)
  private _usuarioActual = signal<String | null>(null);
  usuarioActual = this._usuarioActual.asReadonly();
  private _perfil = signal<string | null>(null);
  perfil = this._perfil.asReadonly();

  // Computed para saber si está autenticado
  estaAutenticado = computed(() => this.usuarioActual() !== null);
  esAdmin = computed(() => this.perfil() === 'admin');

  constructor() {
    this.initAuth();
  }

  private initAuth() {
    const token = this.getToken();
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this._usuarioActual.set(payload.email || payload.id || null);
      this._perfil.set(payload.perfil || payload.role || null);
    } catch {
      this._usuarioActual.set(null);
      this._perfil.set(null);
    }
  }

  registro(codigo: string, clave: string, nombre: string, email: string) {
    return this.http.post<Boolean>(
      this.apiURL + "/registro",
      { codigo,clave,nombre,email}
    ).pipe(
      catchError(err => {
        console.error("Error en registro:", err);
        return of(false); // Devuelves un valor seguro si quieres
      })
    );
  }


  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  login(codigo: string, clave: string) {
    return this.http.post<RespuestaAuth>(
      this.apiURL + "/login",
      { codigo, clave }
    ).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          try {
            const payload = JSON.parse(atob(response.token.split('.')[1]));
            this._perfil.set(payload.perfil || payload.role || null);
          } catch {
            this._perfil.set(null);
          }
        }
        const nombre = response.usuario?.nombre || response.usuario?.codigo || response.message;
        this._usuarioActual.set(nombre);
      }),
      catchError(err => {
        console.error("Error en login:", err);
        return throwError(() => err);
      })
    );
  }

  logout() {
    return this.http.post<void>(
      this.apiURL + "/logout",
      {}
    ).pipe(
      tap(() => {
        localStorage.removeItem('authToken');
        this._usuarioActual.set(null);
        this._perfil.set(null);
      }),
      catchError(err => {
        console.error("Error en logout:", err);
        return throwError(() => err);
      })
    );
  }

}
