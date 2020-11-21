export class EventoGrupo {
    id: number;
    idEvento: number;
    idGrupo: number;
    nombreGrupo: string;

    constructor(
        id: number,
        idEvento: number,
        idGrupo: number) {
            this.id = id;
            this.idEvento = idEvento;
            this.idGrupo = idGrupo;
        }
}