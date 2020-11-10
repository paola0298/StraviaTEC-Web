export class Carrera {
    nombre: string;
    actividad: number;
    fecha: string;
    cuentaBancaria: string;
    categoria: number;
    patrocinador: number;
    costo: number;    
    recorrido: string;

    constructor(
        Nombre: string,
        Actividad: number,
        Fecha: string,
        CuentaBancaria: string,
        Categoria: number,
        Patrocinador: number,
        Costo: number,
        Recorrido: string
    ){
        this.nombre = Nombre;
        this.actividad = Actividad;
        this.fecha = Fecha;
        this.cuentaBancaria = CuentaBancaria;
        this.categoria = Categoria;
        this.patrocinador = Patrocinador;
        this.costo = Costo;
        this.recorrido = Recorrido;
    }
}