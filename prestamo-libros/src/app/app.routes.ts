import { Routes } from '@angular/router';
import { ComponenteLogin } from './componentes/componente-login/componente-login';
import { ComponenteRegistro } from './componentes/componente-registro/componente-registro';
import { ComponenteDashboard } from './componentes/componente-dashboard/componente-dashboard';
import { ComponenteLibros } from './componentes/componente-libros/componente-libros';
import { ComponentePrestamos } from './componentes/componente-prestamos/componente-prestamos';
import { ComponenteDetalleLibro } from './componentes/componente-detalle-libro/componente-detalle-libro';
import { ComponenteAltaLibro } from './componentes/componente-alta-libro/componente-alta-libro';
import { ComponenteModificarLibro } from './componentes/componente-modificar-libro/componente-modificar-libro';
import { authGuard } from './guard-auth';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: ComponenteLogin},
    { path: 'registro', component: ComponenteRegistro },
    { path: 'dashboard', component: ComponenteDashboard, canActivate: [authGuard] },
    { path: 'libros', component: ComponenteLibros, canActivate: [authGuard] },
    { path: 'libros/alta', component: ComponenteAltaLibro, canActivate: [authGuard]},
    { path: 'libros/:id', component: ComponenteDetalleLibro, canActivate: [authGuard] },
    { path: 'libros/modificar/:id', component: ComponenteModificarLibro, canActivate: [authGuard]},
    { path: 'prestamos', component: ComponentePrestamos, canActivate: [authGuard] }
];
