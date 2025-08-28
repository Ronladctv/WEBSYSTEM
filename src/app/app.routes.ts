import { Routes } from '@angular/router';
import { authGuard } from './Custom/auth-guard';
import { Login } from './components/Authentication/login/login';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Home } from './components/home/home';
import { Users } from './components/user/user';
import { Dashoard } from './components/dashoard/dashoard';
import { Cliente } from './components/cliente/cliente';
import { Provedor } from './components/provedor/provedor';
import { Inicio } from './components/inicio/inicio';
import { Reporting } from './components/reporting/reporting';
import { Configuration } from './components/configuration/configuration';
import { Empresa } from './components/empresa/empresa';
import { Producto } from './components/producto/producto';
import { SecurityComponent } from './components/security-component/security-component';
import { Perfil } from './components/perfil/perfil';
import { Venta } from './components/venta/venta';
import { Menu } from './components/menu/menu';
import { routeGuard } from './Custom/route-guard';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: '',
        component: MainLayout,
        children: [

            { path: 'inicio', component: Inicio, canActivate: [authGuard] },
            { path: 'perfil', component: Perfil, canActivate: [authGuard] },
            { path: 'home', component: Home, canActivate: [authGuard] },
            { path: 'cliente', component: Cliente, canActivate: [authGuard] },
            { path: 'historyVentas', component: Reporting, canActivate: [authGuard] },
            { path: 'usuario', component: Users, canActivate: [authGuard] },
            { path: 'proveedor', component: Provedor, canActivate: [authGuard] },
            { path: 'empresa', component: Empresa, canActivate: [authGuard] },
            { path: 'dashboard', component: Dashoard, canActivate: [authGuard] },
            { path: 'configuracion', component: Configuration, canActivate: [authGuard] },
            { path: 'producto', component: Producto, canActivate: [authGuard,routeGuard] },
            { path: 'venta', component: Venta, canActivate: [authGuard] },
            { path: 'menu', component: Menu, canActivate: [authGuard, routeGuard] },
            { path: 'security', component: SecurityComponent },
            { path: '**', redirectTo: '', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: '' }
];

