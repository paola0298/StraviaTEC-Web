import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/user';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.css']
})
export class AddFriendComponent implements OnInit {

  constructor(private apiService:ApiService, private utilsService:UtilsService) { }
  
  athletes: Usuario[] = [];
  user = window.localStorage.getItem('userId');
  friends: Usuario[];

  ngOnInit(): void { }

  getAthletes(search: string) {
    var result = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Usuarios/buscar/${this.user}/${search}`);
    result.subscribe(
      (value:Usuario[])=> {
        var atletas = value;
        var response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/amigos/${this.user}`); 
        response.subscribe(
          (value:Usuario[]) => {
            this.friends = value;
            atletas.forEach(element => {
              var friend = this.friends.find(f => f.user == element.user);
              if (friend != undefined) {
                element.esAmigo = 'Siguiendo';
              } else {
                element.esAmigo = 'Seguir';
              }
            });
            this.athletes = atletas;
          }, (error:any) => {
            console.log(error.statusText);
            console.log(error.status);
            console.log(error);
          });
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
        if (error.status == 404) {
          this.utilsService.showInfoModal("Error", "No se han encontrado resultados", "saveMsjLabel", "msjText", 'saveMsj');
          return;
        }
      });
  }

  searchAthlete() {
    var input = (document.getElementById('search-input') as HTMLInputElement);
    console.log(this.user);
    if (input.value == '') {
      this.utilsService.showInfoModal("Error", "Por favor ingrese un nombre para buscar", "saveMsjLabel", "msjText", 'saveMsj');
      return;
    }
    this.getAthletes(input.value);
  }

  followFriend(userToAdd: string, isFriend: string) {
    var friendInfo = {
      user : this.user,
      amigoUser : userToAdd,
    };
    var input = (document.getElementById('search-input') as HTMLInputElement).value;

    if (isFriend == 'Seguir') {
      var response = this.apiService.post(`http://localhost:${this.apiService.PORT}/api/amigos`, friendInfo);
      response.subscribe(
        (value:any) => {
          console.log("Amigo agregado..");
          this.getAthletes(input);
        }, (error:any) => {
          console.log(error.statusText);
          console.log(error.status);
        }
      );
      
        return;
    }

    var response = this.apiService.delete(`http://localhost:${this.apiService.PORT}/api/amigos/${this.user}/${userToAdd}`);
    response.subscribe(
      (value:any) => {
        console.log("Amigo eliminado..");
        this.getAthletes(input);
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
      }
    );
  }

  getFriends() {
    console.log("Getting friends of " + this.user);
    var response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/amigos/${this.user}`); 
    response.subscribe(
      (value:Usuario[]) => {
        this.friends = value;
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
      });
  }

  closeModal(modal:string) {
    document.getElementById(modal).style.setProperty('display', 'none');
  }


}
