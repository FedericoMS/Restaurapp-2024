export class Producto {
    descripcion: string;
    foto1: string;
    foto2: string;
    foto3: string;
    id: string;
    nombre: string;
    precio: number;
    tiempoPreparacion: number;

    constructor() {
        this.descripcion = '';
        this.foto1 = '';
        this.foto2 = '';
        this.foto3 = '';
        this.id = '';
        this.nombre = '';
        this.precio = 0;
        this.tiempoPreparacion = 0;
    }
}
