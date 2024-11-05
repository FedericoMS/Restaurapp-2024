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
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
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
  {
    path: 'home-duenio-supervisor',
    loadComponent: () =>
      import('./pages/home-duenio-supervisor/home-duenio-supervisor.page').then(
        (m) => m.HomeDuenioSupervisorPage
      ),
  },
  {
    path: 'alta-cliente',
    loadComponent: () =>
      import('./pages/alta-cliente/alta-cliente.page').then(
        (m) => m.AltaClientePage
      ),
  },  {
    path: 'home-mozo',
    loadComponent: () => import('./pages/home-mozo/home-mozo.page').then( m => m.HomeMozoPage)
  },
  {
    path: 'home-metre',
    loadComponent: () => import('./pages/home-metre/home-metre.page').then( m => m.HomeMetrePage)
  },
  {
    path: 'carta',
    loadComponent: () => import('./pages/carta/carta.page').then( m => m.CartaPage)
  },

];
