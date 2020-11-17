export class Grupo {
    id: number;
    nombre: string;
    idAdmin: string;
    asociado: string;

    constructor(
        nombre: string,
        idAmin: string
    ) {
        this.nombre = nombre;
        this.idAdmin = idAmin;
    }
}