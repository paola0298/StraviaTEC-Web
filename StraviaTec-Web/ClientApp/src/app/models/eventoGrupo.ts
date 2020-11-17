export class EventoGrupo {
    id: number;
    idEvento: number;
    idGrupo: number;

    constructor(
        id: number,
        idEvento: number,
        idGrupo: number) {
            this.id = id;
            this.idEvento = idEvento;
            this.idGrupo = idGrupo;
        }
}