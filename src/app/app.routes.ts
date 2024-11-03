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
  },
  {
    path: 'graficos',
    loadComponent: () =>
      import('./components/graficos/graficos.page').then((m) => m.GraficosPage),
  },
  {
    path: 'home-cliente',
    loadComponent: () =>
      import('./pages/home-cliente/home-cliente.page').then(
        (m) => m.HomeClientePage
      ),
  },
  {
    path: 'ingreso-local',
    loadComponent: () =>
      import('./pages/ingreso-local/ingreso-local.page').then(
        (m) => m.IngresoLocalPage
      ),
  },  {
    path: 'comentarios',
    loadComponent: () => import('./pages/comentarios/comentarios.page').then( m => m.ComentariosPage)
  },

];
