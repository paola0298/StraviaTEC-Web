export class CategoriaCarrera {
    id: number;
    idCarrera: number;
    idCategoria: number;
    nombre: string;

    constructor(
        id: number, 
        idCarrera: number, 
        idCategoria: number) 
        {
            this.id = id;
            this.idCarrera = idCarrera;
            this.idCategoria = idCategoria;
        }
}