import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'security', renderMode: RenderMode.Prerender },
  { path: 'inicio', renderMode: RenderMode.Prerender },
  { path: 'perfil', renderMode: RenderMode.Prerender },
  { path: 'home', renderMode: RenderMode.Prerender },
  { path: 'cliente', renderMode: RenderMode.Prerender },
  { path: 'historyVentas', renderMode: RenderMode.Prerender },
  { path: 'usuario', renderMode: RenderMode.Prerender },
  { path: 'proveedor', renderMode: RenderMode.Prerender },
  { path: 'empresa', renderMode: RenderMode.Prerender },
  { path: 'dashboard', renderMode: RenderMode.Prerender },
  { path: 'configuracion', renderMode: RenderMode.Prerender },
  { path: 'producto', renderMode: RenderMode.Prerender },
  { path: 'venta', renderMode: RenderMode.Prerender },
  { path: 'menu', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'security', renderMode: RenderMode.Prerender },
  { path: '', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Prerender }
];