export class PatrocinadorEvento {
    id: number;
    idEvento: number;
    idPatrocinador: number;
    nombreComercial: string;

    constructor(
        id: number,
        idEvento: number,
        idPatrocinador: number) {
            this.id = id;
            this.idEvento = idEvento;
            this.idPatrocinador = idPatrocinador;
        }
}