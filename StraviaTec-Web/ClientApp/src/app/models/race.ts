export class Race {
    Id: number;
    IdRecorrido: number;
    IdEvento: number;
    Nombre: string;
    Fecha: string;
    Costo: number;
    
    constructor(
        Id: number,
        IdRecorrido: number,
        IdEvento: number,
        Nombre: string,
        Fecha: string,
        Costo: number
    ){
        this.Id = Id;
        this.IdRecorrido = IdRecorrido;
        this.IdEvento = IdEvento;
        this.Nombre = Nombre;
        this.Fecha = Fecha;
        this.Costo = Costo;
    }
}