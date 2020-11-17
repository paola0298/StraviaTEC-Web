export class Grupo {
    id: number
    nombre: string;
    idAdmin: string;
    asociado: string;


    constructor(
        Nombre: string,
        IdAdmin: string,
     
    ){
        this.nombre = Nombre;
        this.idAdmin = IdAdmin;
 
    }
}