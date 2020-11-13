export class Patrocinador {
    id: number;
    nombreComercial: string;
    nombreRepresentante: string;
    telRepresentante: string;
    logo: string;

    
    constructor(
        Id: number,
        NombreComercial: string,
        NombreRepresentante: string,
        TelRepresentante: string,
        Logo: string,
    ){
        this.id = Id;
        this.nombreComercial = NombreComercial;
        this.nombreRepresentante = NombreRepresentante;
        this.telRepresentante = TelRepresentante;
        this.logo = Logo;
    }
}

