import { Patrocinador } from "./patrocinador";

export class Reto {
    nombre: string;
    inicio: string;
    fin: string;
    objetivo: number;
    idTipoReto: number;
    idActividad: number;
    patrocinadores: Patrocinador[];
    grupos: string[];
    publico: boolean;
    nombreReto: string;
    nombreActividad: string;

    constructor(
        nombre: string,
        inicio: string,
        fin: string,
        objetivo: number,
        idTipoReto: number,
        idActividad: number,
        patrocinadores: Patrocinador[],
        grupos: string[],
        publico: boolean
    ) {
        this.nombre = nombre;
        this.inicio = inicio;
        this.fin = fin;
        this.objetivo = objetivo;
        this.idTipoReto = idTipoReto;
        this.idActividad = idActividad;
        this.patrocinadores = patrocinadores;
        this.grupos = grupos;
        this.publico = publico;
    }
}