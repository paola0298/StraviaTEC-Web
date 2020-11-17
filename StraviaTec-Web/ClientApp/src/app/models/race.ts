import { CategoriaCarrera } from "./categoriaCarrera";
import { CuentaBancaria } from "./cuentaBancaria";
import { EventoGrupo } from "./eventoGrupo";
import { PatrocinadorEvento } from "./patrocinadorEvento";

export class Race {
    id: number;
    idRecorrido: number;
    idEvento: number;
    nombre: string;
    fecha: string;
    costo: number;
    esPrivado: boolean;
    idTipoActividad: number;
    categoriaCarrera: CategoriaCarrera[];
    cuentaBancaria: CuentaBancaria[];
    patrocinadorEvento: PatrocinadorEvento[];
    eventoGrupo: EventoGrupo[];

    constructor() {}
    // constructor(
    //     Id: number,
    //     IdRecorrido: number,
    //     IdEvento: number,
    //     Nombre: string,
    //     Fecha: string,
    //     Costo: number,
    //     esPrivado: boolean,
    //     idTipoActividad: number,
    //     categoriaCarrera: CategoriaCarrera[],
    //     cuentaBancaria: CuentaBancaria[],
    //     patrocinadorEvento: PatrocinadorEvento[],
    //     eventoGrupo: EventoGrupo[]){
    //     this.id = Id;
    //     this.idRecorrido = IdRecorrido;
    //     this.idEvento = IdEvento;
    //     this.nombre = Nombre;
    //     this.fecha = Fecha;
    //     this.costo = Costo;
    //     this.esPrivado = esPrivado;
    //     this.idTipoActividad = idTipoActividad;
    //     this.categoriaCarrera = categoriaCarrera;
    //     this.cuentaBancaria = cuentaBancaria;
    //     this.patrocinadorEvento = patrocinadorEvento;
    //     this.eventoGrupo = eventoGrupo;
    // }
}