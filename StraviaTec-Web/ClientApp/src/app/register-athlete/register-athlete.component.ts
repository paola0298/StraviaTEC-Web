import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/user'
import { UtilsService } from '../services/utils.service'

@Component({
  selector: 'app-register-athlete',
  templateUrl: './register-athlete.component.html',
  styleUrls: ['./register-athlete.component.css']
})
export class RegisterAthleteComponent implements OnInit {
  
  localUrl: any[];
  constructor(private utilsService: UtilsService) { }

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
        console.log('Completar todos los datos');
        this.utilsService.showInfoModal('Error', 'Por favor complete todos los campos.', 'saveMsjLabel', 'msjText', 'saveMsj');
        return;
    } 

    if (pass.value !== passConfirm.value) {
      console.log('Contrasenia no coincide');
      this.utilsService.showInfoModal('Error', 'La contraseña debe ser igual en ambos campos', 'saveMsjLabel', 'msjText', 'saveMsj');
      return;
    }

    

    const user = new Usuario(username.value, pass.value, name.value, lastName1.value, lastName2.value,
      birth.value, nationality.value, profilePhoto.value);

    // Llamar metodo que se conecte con el api para guardar un nuevo usuario

  }

   /**
   * Metodo para cerrar un modal
   * @param id Id del modal a cerrar
   */
  closeModal(id: string): void {
    document.getElementById(id).style.setProperty('display', 'none');
  }
}
