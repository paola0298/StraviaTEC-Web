export class Athlete {
    name: string;
    lastName1: string;
    lastName2: string;
    bDate: string;
    nationality: string;
    username: string;
    pass: string;
    profilePhoto: string;

    constructor(
        name: string,
        lastName1: string,
        lastName2: string,
        bDate: string,
        nationality: string,
        username: string,
        pass: string,
        profilePhoto: string
    ){
        this.name = name;
        this.lastName1 = lastName1;
        this.lastName2 = lastName2;
        this.bDate = bDate;
        this.nationality = nationality;
        this.username = username;
        this.pass = pass;
        this.profilePhoto = profilePhoto;
    }
}