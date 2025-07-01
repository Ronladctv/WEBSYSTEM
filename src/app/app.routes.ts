import { Routes } from '@angular/router';
import { authGuard } from './Custom/auth-guard';
import { Login } from './components/Authentication/login/login';
import { MainLayout } from './Layouts/main-layout/main-layout';
import { Home } from './components/home/home';
import { Users } from './components/user/user';

export const routes: Routes = [
    { path: 'login', component: Login },
    {
        path: '',
        component: MainLayout,
        children: [
            { path: 'home', component: Home, canActivate: [authGuard] }, 
            { path: 'usuario', component: Users, canActivate: [authGuard] },
            { path: '**', redirectTo: '', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: '' }
];

