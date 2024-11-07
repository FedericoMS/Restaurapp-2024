export class Pedido {
    estado : string;
    id : string;
    idCliente : string;
    listaProductos : any[];
    monto : number;
    tiempoPreparacion : number;
    nroMesa : number;



    //estados de 'estado': rechazado, pendiente de confirmación, en preparación,
                         //preparado, en entrega, recibido, pagado
    constructor()
    {
        this.estado = '';
        this.id = '';
        this.idCliente = '';
        this.listaProductos = [];
        this.monto = 0;
        this.tiempoPreparacion = 0;
        this.nroMesa = 0;

    }
}
