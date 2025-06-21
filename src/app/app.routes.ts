import { Routes } from '@angular/router';
import { Index as HomeIndex } from './pages/home/index';
import { authGuard } from './Custom/auth-guard';
import { Login } from './components/Authentication/login/login';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
    { path: '', component: Login },
    {
        path: '',
        component: MainLayout,
        children: [
            { path: 'Home', component: HomeIndex, canActivate: [authGuard] },
        ]
    },
    { path: '**', redirectTo: '' }
];
