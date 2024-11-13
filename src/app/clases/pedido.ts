export class Pedido {
    estado : string;
    id : string;
    idCliente : string;
    listaProductos : any[];
    monto : number;
    tiempoPreparacion : number;
    nroMesa : number;
    estado_cuenta : boolean; 



    //estados de 'estado': rechazado, pendiente de confirmación, en preparación,
                         //preparado, en entrega, recibido, cuenta pedida, cuenta enviada, pagado, finalizado
    constructor()
    {
        this.estado = '';
        this.id = '';
        this.idCliente = '';
        this.listaProductos = [];
        this.monto = 0;
        this.tiempoPreparacion = 0;
        this.nroMesa = 0;
        this.estado_cuenta = false;

    }
}
