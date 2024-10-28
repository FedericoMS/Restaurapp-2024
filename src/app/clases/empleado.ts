import { Persona } from './persona';

export class Empleado extends Persona {
  rol: string;

  constructor(
    nombre: string,
    apellido: string,
    dni: number,
    cuil: string,
    foto_url: string,
    rol: string
  ) {
    super(nombre, apellido, dni, cuil, foto_url);
    this.rol = rol;
  }

  static get_roles() {
    return ['maitre', 'mozo', 'cocinero', 'bartender'];
  }
}
