import { EventoGrupo } from "./eventoGrupo";
import { PatrocinadorEvento } from "./patrocinadorEvento";

export class Reto {
    id: number;
    idEvento: number;
    idTipoReto: number;
    inicio: string;
    fin: string;
    objetivo: number;
    esPrivado: boolean;
    patrocinadorEvento: PatrocinadorEvento[];
    eventoGrupo: EventoGrupo[];
    nombre: string;
    idTipoActividad: number;
    nombreTipoReto: string;
    nombreActividad: string;
    objetivoCompletado: number;
    

    constructor() { }
}