export class CuentaBancaria {
    id: number;
    idCarrera: number;
    nombre: string;

    constructor(
        id: number,
        idCarrera: number,
        nombre: string) {
        this.id = id;
        this.idCarrera = idCarrera;
        this.nombre = nombre;
    }
}