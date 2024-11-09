export class Producto {
    descripcion: string;
    foto1: string;
    foto2: string;
    foto3: string;
    id: string;
    nombre: string;
    precio: number;
    tiempoPreparacion: number;
    tipo : string;
    estado : string; 
    //Estado puede ser: en preparación, terminado, cancelado

    constructor() {
        this.descripcion = '';
        this.foto1 = '';
        this.foto2 = '';
        this.foto3 = '';
        this.id = '';
        this.nombre = '';
        this.precio = 0;
        this.tiempoPreparacion = 0;
        this.tipo = '';
        this.estado = '';
    }
}
