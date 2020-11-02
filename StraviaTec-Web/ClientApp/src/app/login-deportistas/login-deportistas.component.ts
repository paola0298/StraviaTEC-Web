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

  constructor(private utilsService:UtilsService, private apiService: ApiService,
    private router: Router) { }

  ngOnInit() { }

  checkLogin(id:string, pass:string) {
    var response = this.apiService.loginClient(id, pass);
    response.subscribe(
      (value:any) => {
        var userId = value.id;
        var client:boolean = value.client;

        console.log(userId + " " + client);

        if (client) {
          window.localStorage.setItem("userId", userId);
          this.router.navigate(['menu-deportista']);
        }
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);

        let status = error.status;
        if (status == 400) {
          this.utilsService.showInfoModal("Error", "Usuario y/o Contraseña incorrectos", "saveMsjLabel", "msjText", 'saveMsj');
          return;
        }

        if (status == 409) {
          this.utilsService.showInfoModal("Error", "El usuario ya se encuentra registrado", "saveMsjLabel", "msjText", 'saveMsj');
          return;
        }

        if (status == 500) {
          this.utilsService.showInfoModal("Error", "Su solicitud de afiliación aún esta siendo verificada.", "saveMsjLabel", "msjText", 'saveMsj');
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



