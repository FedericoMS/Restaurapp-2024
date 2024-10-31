import { Persona } from './persona';

export class Usuario extends Persona {
  email: string;
  password: string;
  estaAprobado: boolean;
  rol: string;

  constructor() {
    super('', '', 0, '', '');
    this.email = '';
    this.password = '';
    this.estaAprobado = false;
    this.rol = '';
  }

  static get_roles() {
    return ['maitre', 'mozo', 'cocinero', 'bartender', 'dueño', 'supervisor'];
  }
}
