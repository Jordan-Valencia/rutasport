import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin',
    renderMode: RenderMode.Client,
  },
  {
    path: 'recuperar',
    renderMode: RenderMode.Client,
  },
  {
    path: 'recuperar/:token',
    renderMode: RenderMode.Client,
  },
  {
    path: 'producto/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
