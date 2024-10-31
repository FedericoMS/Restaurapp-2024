import { Persona } from './persona';

export class Usuario extends Persona {
  email: string;
  password: string;
  estaAprobado: boolean;
  rol: string;

  constructor(
    nombre: string,
    apellido: string,
    dni: number,
    cuil: string,
    foto_url: string,
    rol: string,
    email: string = '',
    password: string = ''
  ) {
    super(nombre, apellido, dni, cuil, foto_url);
    this.email = email;
    this.password = password;
    this.estaAprobado = false;
    this.rol = rol;
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
