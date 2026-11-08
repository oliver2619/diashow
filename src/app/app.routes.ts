import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'menu',
    },
    {
        path: 'about',
        loadComponent: () => import('./page/about/about.component').then(m => m.AboutComponent),
    },
    {
        path: 'help',
        loadComponent: () => import('./page/help/help.component').then(m => m.HelpComponent),
    },
    {
        path: 'menu',
        loadComponent: () => import('./page/menu/menu.component').then(m => m.MenuComponent),
    },
    {
        path: 'new-show',
        loadComponent: () => import('./page/new-show/new-show.component').then(m => m.NewShowComponent),
    },
    {
        path: 'show',
        loadComponent: () => import('./page/show/show.component').then(m => m.ShowComponent),
    },
    {
        path: '**',
        redirectTo: '',
    },
];
