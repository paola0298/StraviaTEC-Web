import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { Usuario } from '../models/user';

@Component({
  selector: 'app-profile-athlete',
  templateUrl: './profile-athlete.component.html',
  styleUrls: ['./profile-athlete.component.css']
})
export class ProfileAthleteComponent implements OnInit {

  localUrl:string;
  update:boolean = true;

  constructor(private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.localUrl = 'https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/256x256/plain/user.png';
    //obtener imagen del usuario registrado
    (document.getElementById('profile-photo-input') as HTMLInputElement).hidden = true;
  }

  /**
   * Metodo para actualizar los datos de un usuario
   */
  updateData() {
    const profilePhoto = (document.getElementById('image') as HTMLInputElement);
    const name = (document.getElementById('name') as HTMLInputElement);
    const lastName1 = (document.getElementById('last-name1') as HTMLInputElement);
    const lastName2 = (document.getElementById('last-name2') as HTMLInputElement);
    const birth = (document.getElementById('birth') as HTMLInputElement);
    const nationality = (document.getElementById('nationality') as HTMLInputElement);
    const username = (document.getElementById('username') as HTMLInputElement);
    const inputFile = (document.getElementById('profile-photo-input') as HTMLInputElement);
    const saveButton = (document.getElementById('saveButton') as HTMLButtonElement);
   
    if (this.update) {
      this.setProfileEditable(name, lastName1, lastName2, birth, nationality, username, inputFile);
      this.update = false;
      saveButton.textContent = 'Guardar';
    } else {
      this.update = true;
      saveButton.textContent = 'Modificar mis datos';
      this.disableProfileEditable(name, lastName1, lastName2, birth, nationality, username, inputFile);
    }

  }

  /**
   * Metodo para cargar una imagen
   * @param event 
   */
  loadImage(event:any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
          this.localUrl = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  
  /**
   * Metodo para eliminar la cuenta de un usuario
   */
  deleteAccount() {

  }

  /**
   * Metodo para hacer que el perfil del usuario se pueda editar
   * @param id HTMLInputElement de la identificacion
   * @param name HTMLInputElement del nombre
   * @param lastName1 HTMLInputElement del apellido1
   * @param lastName2 HTMLInputElement del apellido2
   * @param birth HTMLInputElement de la fecha de nacimiento
   * @param nationality HTMLInputElement de la nacionalidad
   * @param username HTMLInputElement del nombre de usuario
   * @param inputFile HTMLInputElement para cargar una nueva imagen
   */
  setProfileEditable(name: HTMLInputElement, lastName1: HTMLInputElement, lastName2: HTMLInputElement,
    birth: HTMLInputElement, nationality: HTMLInputElement, username: HTMLInputElement, inputFile: HTMLInputElement) {
      name.removeAttribute('disabled');
      lastName1.removeAttribute('disabled');
      lastName2.removeAttribute('disabled');
      birth.removeAttribute('disabled');
      nationality.removeAttribute('disabled');
      username.removeAttribute('disabled');
      inputFile.hidden = false;  
  }

  /**
   * Metodo para hacer que el perfil del usuario no se pueda editar
   * @param id HTMLInputElement de la identificacion
   * @param name HTMLInputElement del nombre
   * @param lastName1 HTMLInputElement del apellido1
   * @param lastName2 HTMLInputElement del apellido2
   * @param birth HTMLInputElement de la fecha de nacimiento
   * @param nationality HTMLInputElement de la nacionalidad
   * @param username HTMLInputElement del nombre de usuario
   * @param inputFile HTMLInputElement para cargar una nueva imagen
   */
  disableProfileEditable(name: HTMLInputElement, lastName1: HTMLInputElement, lastName2: HTMLInputElement,
    birth: HTMLInputElement, nationality: HTMLInputElement, username: HTMLInputElement, inputFile: HTMLInputElement) {
      name.setAttribute('disabled', 'true');
      lastName1.setAttribute('disabled', 'true');
      lastName2.setAttribute('disabled', 'true');
      birth.setAttribute('disabled', 'true');
      nationality.setAttribute('disabled', 'true');
      username.setAttribute('disabled', 'true');
      inputFile.hidden = true;  
  }


  /**
   * Metodo para cerrar un modal
   * @param id Id del modal a cerrar
   */
  closeModal(id: string): void {
    document.getElementById(id).style.setProperty('display', 'none');
  }

   /**
   * Metodo para mostrar al usuario un modal para tomar una decision de si o no
   */
  askUser(): void {
    this.utilsService.showInfoModal('Eliminar', '¿Esta seguro que desea eliminar su cuenta?',
    'optionMsjLabel', 'optionText', 'optionMsj');
  }
}
