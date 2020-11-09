import { Component, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
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

  ngOnInit(): void { }

  getAthletes(search: string) {
    
    var result = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Usuarios/buscar/${this.user}/${search}`);
    result.subscribe(
      (value:Usuario[])=> {
        this.athletes = value;
        console.log(this.athletes.length);
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

  followFriend(userToAdd: string) {
    var friendInfo = {
      user : this.user,
      amigoUser : userToAdd,
    };
    var response = this.apiService.post(`http://localhost:${this.apiService.PORT}/api/amigos`, friendInfo);
    response.subscribe(
      (value:any) => {
        console.log("Amigo agregado..");
        (document.getElementById('follow-btn') as HTMLButtonElement).textContent = 'Siguiendo';
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
      });
  }

  closeModal(modal:string) {
    document.getElementById(modal).style.setProperty('display', 'none');
  }


}
