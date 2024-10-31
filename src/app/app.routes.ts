import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadComponent: () =>
      import('./splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'alta-empleado',
    loadComponent: () =>
      import('./pages/alta-empleado/alta-empleado.page').then(
        (m) => m.AltaEmpleadoPage
      ),
  },
  {
    path: 'encuesta-clientes',
    loadComponent: () =>
      import('./pages/encuestas/encuesta-clientes/encuesta-clientes.page').then(
        (m) => m.EncuestaClientesPage
      ),
  },
  {
    path: 'encuesta-empleados',
    loadComponent: () =>
      import(
        './pages/encuestas/encuesta-empleados/encuesta-empleados.page'
      ).then((m) => m.EncuestaEmpleadosPage),
  },
  {
    path: 'encuesta-empleados',
    loadComponent: () =>
      import(
        './pages/encuestas/encuesta-empleados/encuesta-empleados.page'
      ).then((m) => m.EncuestaEmpleadosPage),
  },
];
