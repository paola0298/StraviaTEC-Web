export class Carrera {
    nombre: string;
    fecha: string;
    cuentaBancaria: string;
    categoria: number;
    patrocinador: number;
    recorrido: string;

    constructor(
        Nombre: string,
        Fecha: string,
        CuentaBancaria: string,
        Categoria: number,
        Patrocinador: number,
        Recorrido: string
    ){
        this.nombre = Nombre;
        this.fecha = Fecha;
        this.cuentaBancaria = CuentaBancaria;
        this.categoria = Categoria;
        this.patrocinador = Patrocinador;
        this.recorrido = Recorrido;
    }
}