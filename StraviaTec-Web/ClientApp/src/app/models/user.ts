export class Usuario {
    User: string;
    Password: string;
    Nombre: string;
    Apellido1: string;
    Apellido2: string;
    Fecha_nacimiento: string;
    Nacionalidad: string;
    Foto: string;

    constructor(
        User: string,
        Password: string,
        Nombre: string,
        Apellido1: string,
        Apellido2: string,
        Fecha_nacimiento: string,
        Nacionalidad: string,
        Foto: string
    ){
        this.User = User;
        this.Password = Password;
        this.Nombre = Nombre;
        this.Apellido1 = Apellido1;
        this.Apellido2 = Apellido2;
        this.Fecha_nacimiento = Fecha_nacimiento;
        this.Nacionalidad = Nacionalidad;
        this.Foto = Foto;
    }
}