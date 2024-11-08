import { Persona } from './persona';

export enum EstadoAprobacion {
  Rechazado = 'rechazado',
  Pendiente = 'pendiente',
  Aprobado = 'aprobado',
}

export class Usuario extends Persona {
  email: string;
  password: string;
  estadoAprobacion: EstadoAprobacion;
  rol: string;
  nroMesa:number;

  constructor(
    nombre: string,
    apellido: string,
    dni: number,
    cuil: string,
    foto_url: string,
    rol: string,
    estadoAprobacion: EstadoAprobacion,
    email: string = '',
    password: string = '',
    nroMesa: number = 0
  ) {
    super(nombre, apellido, dni, cuil, foto_url);
    this.email = email;
    this.password = password;
    this.estadoAprobacion = estadoAprobacion;
    this.rol = rol;
    this.nroMesa = nroMesa;
  }

  static get_roles() {
    return [
      'maitre',
      'mozo',
      'cocinero',
      'bartender',
      'dueño',
      'supervisor',
      'cliente',
      'anonimo',
    ];
  }
}
