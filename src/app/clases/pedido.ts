export class Pedido {
    estado : string;
    id : string;
    idCliente : string;
    listaProductos : any[];
    monto : number;
    tiempoPreparacion : number;



    constructor()
    {
        this.estado = '';
        this.id = '';
        this.idCliente = '';
        this.listaProductos = [];
        this.monto = 0;
        this.tiempoPreparacion = 0;

    }
}
