import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service'
import { ApiService } from 'src/app/services/api.service'
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login-deportistas',
  templateUrl: './login-deportistas.component.html',
  styleUrls: ['./login-deportistas.component.css']
})
export class LoginDeportistasComponent implements OnInit {
  
  userType = window.localStorage.getItem('userType');

  constructor(private utilsService:UtilsService, private apiService: ApiService,
    private router: Router) { }

  ngOnInit() { }

  checkLogin(id:string, pass:string) {
    var auth = {
      user: id,
      password: pass,
      userType: this.userType
    }

    var response = this.apiService.post(`http://localhost:${this.apiService.PORT}/api/Login`, auth);
    response.subscribe(
      (value:any) => {
        window.localStorage.setItem('userId', id);
        if (this.userType == 'athlete') {
          this.router.navigate(['friends-activity']); //TODO cambiar a menu de deportista
          return;
        } 
        if (this.userType == 'organizer') {
          this.router.navigate(['menu-organizador']);
        }
        
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);

        let status = error.status;
        if (status == 400 || status == 404) {
          this.utilsService.showInfoModal("Error", "Usuario y/o Contraseña incorrectos", "saveMsjLabel", "msjText", 'saveMsj');
          return;
        }

        if (status == 409) {
          this.utilsService.showInfoModal("Error", "El usuario ya se encuentra registrado", "saveMsjLabel", "msjText", 'saveMsj');
          return;
        }
      });
  }

  login() {
    let username = (document.getElementById("username") as HTMLInputElement);
    let pass = (document.getElementById("password") as HTMLInputElement);

    console.log("Username: " + username.value + " Password: " + pass.value);
    // TODO verificar que este registrado el usuario
    if (username.value == "" || pass.value == "") {
      this.utilsService.showInfoModal("Error", "Por favor complete todos los campos", "saveMsjLabel", "msjText", "saveMsj");
    } else {
      this.checkLogin(username.value, pass.value);
    }
  }

  closeModal(modal:string) {
    document.getElementById(modal).style.setProperty('display', 'none');
  }

}



