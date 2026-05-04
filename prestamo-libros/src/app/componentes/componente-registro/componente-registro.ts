import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GestionarUsuarios } from '../../servicios/gestionar-usuarios';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-componente-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './componente-registro.html',
  styleUrl: './componente-registro.css'
})
export class ComponenteRegistro {
  private gestionarUsuarios=inject(GestionarUsuarios);
  private router=inject(Router);

  registroForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(5)]],
      clave: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$')
        ]
      ],
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  onSubmit() {
    if (this.registroForm.valid) {
      console.log('Formulario enviado:', this.registroForm.value);
      this.gestionarUsuarios.registro(this.registroForm.get('codigo')?.value,
                                      this.registroForm.get('clave')?.value,
                                      this.registroForm.get('nombre')?.value,
                                      this.registroForm.get('email')?.value)
          .subscribe({
        next: () => {
          alert('Registro completado con éxito');
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          console.error('Login fallido', err);
        }
      });
    } else {
      this.registroForm.markAllAsTouched();
    }
  }

  get f() {
    return this.registroForm.controls;
  }
}