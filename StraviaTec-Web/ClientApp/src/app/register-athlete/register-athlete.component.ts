import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/user';
import { UtilsService } from '../services/utils.service';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-athlete',
  templateUrl: './register-athlete.component.html',
  styleUrls: ['./register-athlete.component.css']
})
export class RegisterAthleteComponent implements OnInit {
  
  localUrl: any[];
  created:boolean = false;
  constructor(private utilsService: UtilsService, private apiService:ApiService,
    private router: Router) { }

  ngOnInit(): void { }

  /**
   * Metodo para cargar una imagen
   * @param event 
   */
  loadImage(event:any) {
    (document.getElementById('image') as HTMLInputElement).setAttribute('hidden', 'true');
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
          this.localUrl = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
  }
}

  saveAthlete() {
    const profilePhoto = (document.getElementById('profile-photo') as HTMLInputElement);
    const name = (document.getElementById('name') as HTMLInputElement);
    const lastName1 = (document.getElementById('last-name1') as HTMLInputElement);
    const lastName2 = (document.getElementById('last-name2') as HTMLInputElement);
    const birth = (document.getElementById('birth') as HTMLInputElement);
    const nationality = (document.getElementById('nationality') as HTMLInputElement);
    const username = (document.getElementById('username') as HTMLInputElement);
    const pass = (document.getElementById('pass') as HTMLInputElement);
    const passConfirm = (document.getElementById('passConfirm') as HTMLInputElement);

    if (profilePhoto.value == '' || name.value == '' || lastName1.value == '' || lastName2.value == '' || birth.value == '' || 
      nationality.value == '' || username.value == '' || pass.value == '' || passConfirm.value == '') {
        this.utilsService.showInfoModal('Error', 'Por favor complete todos los campos.', 'saveMsjLabel', 'msjText', 'saveMsj');
        return;
    } 

    if (pass.value !== passConfirm.value) {
      this.utilsService.showInfoModal('Error', 'La contraseña debe ser igual en ambos campos', 'saveMsjLabel', 'msjText', 'saveMsj');
      return;
    }

    const user = new Usuario(username.value, pass.value, name.value, lastName1.value, lastName2.value,
      birth.value, nationality.value, this.localUrl.toString());
    this.createAthlete(user);

  }

  createAthlete(user:Usuario) {
    var response = this.apiService.post(`http://127.0.0.1:${this.apiService.PORT}/api/Usuarios`, user);
    response.subscribe(
      (value:any) => {
        this.utilsService.showInfoModal('Exito', 'Registro completado', 'saveMsjLabel', 'msjText', 'saveMsj');
        this.created = true;
        //Hacer que navegue al inicio de sesion
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
        var codeError = error.status;
        if (codeError == 500) {
          this.utilsService.showInfoModal('Error', 'No se ha podido registrar', 'saveMsjLabel', 'msjText', 'saveMsj');
          return;
        } 
        if (codeError == 409) {
          this.utilsService.showInfoModal('Error', 'El usuario ya existe', 'saveMsjLabel', 'msjText', 'saveMsj');
          return;
        }
      });
  }

   /**
   * Metodo para cerrar un modal
   * @param id Id del modal a cerrar
   */
  closeModal(id: string): void {
    document.getElementById(id).style.setProperty('display', 'none');
    if (this.created) {
      this.router.navigate(['']);
      //navegar al inicio de sesion
    }
  }
}
