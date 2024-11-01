export class Encuesta {
  [key: string]: any; // Permite cualquier cantidad de propiedades de cualquier tipo

  constructor(initialData?: { [key: string]: any }) {
    if (initialData) {
      Object.assign(this, initialData); // Copia propiedades del objeto inicial a la instancia
    }
  }
}
