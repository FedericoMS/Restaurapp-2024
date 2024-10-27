export class Persona {
  nombre: string;
  apellido: string;
  dni: number;
  cuil: string;
  foto_url: string;

  constructor(
    nombre: string,
    apellido: string,
    dni: number,
    cuil: string,
    foto_url: string
  ) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.cuil = cuil;
    this.foto_url = foto_url;
  }
}
