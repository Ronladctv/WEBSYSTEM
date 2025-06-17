import { Routes } from '@angular/router';
import { Index as HomeIndex } from './pages/home/index';
import { Sidebar } from './components/sidebar/sidebar';
import { authGuard } from './Custom/auth-guard';

export const routes: Routes = [
    { path: '', component: HomeIndex },
    { path: '', component: HomeIndex , canActivate:[authGuard]},
    { path: 'sidebar', component: Sidebar },
    { path: '**', redirectTo: '' },
];
