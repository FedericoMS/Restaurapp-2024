import { Persona } from "./persona";

export enum EstadoAprobacion {
    Rechazado = 'rechazado',
    Pendiente = 'pendiente',
    Aprobado = 'aprobado'
}


export class Usuario extends Persona{
    
    email : string;
    password : string;
    estadoAprobacion:EstadoAprobacion;
    rol : string; 

    constructor(
        nombre: string,
        apellido: string,
        dni: number,
        cuil: string,
        foto_url: string,
        rol: string,
        estadoAprobacion : EstadoAprobacion,
        email: string = '',
        password: string = ''
    ){
        super(nombre, apellido, dni, cuil, foto_url);
        this.email = email;
        this.password = password;
        this.estadoAprobacion = estadoAprobacion;
        this.rol = rol;
    }


    


    static get_roles() {
        return ['maitre', 'mozo', 'cocinero', 'bartender','dueño','supervisor','cliente','anonimo'];
    }

}
