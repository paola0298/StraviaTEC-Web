export class Race {
    id: number;
    idRecorrido: number;
    idEvento: number;
    nombre: string;
    fecha: string;
    costo: number;
    
    constructor(
        Id: number,
        IdRecorrido: number,
        IdEvento: number,
        Nombre: string,
        Fecha: string,
        Costo: number
    ){
        this.id = Id;
        this.idRecorrido = IdRecorrido;
        this.idEvento = IdEvento;
        this.nombre = Nombre;
        this.fecha = Fecha;
        this.costo = Costo;
    }
}