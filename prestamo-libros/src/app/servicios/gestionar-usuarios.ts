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

  // Computed para saber si está autenticado
  estaAutenticado = computed(() => this.usuarioActual() !== null);

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


  login(codigo: string, clave: string) {
    return this.http.post<RespuestaAuth>(
      this.apiURL + "/login",
      { codigo, clave }
    ).pipe(
      tap(response => {
        // Suponemos que la cookie ya fue enviada por el servidor
        // Aquí actualizamos la señal del usuario
        this._usuarioActual.set(response.message);
      }),
        catchError(err => {
          console.error("Error en login:", err);
          return throwError(() => err); // O devuelves un observable controlado
        })
    );
  }

  logout() {
    return this.http.post<void>(
      this.apiURL + "/logout",
      {}
    ).pipe(
      tap(() => {
        this._usuarioActual.set(null);
      }),
        catchError(err => {
          console.error("Error en logout:", err);
          return throwError(() => err); // O devuelves un observable controlado
        })
    );
  }

}
