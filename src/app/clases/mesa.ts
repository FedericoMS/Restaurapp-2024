export class Mesa {
    cantidadComensales : number;
    estado : string;
    id : string;
    idCliente : string;
    numero : number;
    tipo : string;
    nombreCliente : string;



    //Estado puede ser: libre, ocupada
    constructor()
    {
        this.cantidadComensales = 0;
        this.estado = '';
        this.id = '';
        this.idCliente = '';
        this.numero = 0;
        this.tipo = '';
        this.nombreCliente = '';
    }
}
