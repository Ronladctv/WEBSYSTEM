import { Routes } from '@angular/router';
import { Index as HomeIndex } from './pages/home/index';
import { Sidebar } from './components/sidebar/sidebar';

export const routes: Routes = [
    {path:'', component : HomeIndex},
    {path:'sidebar', component : Sidebar},
    {path:'**', redirectTo:''},
];
