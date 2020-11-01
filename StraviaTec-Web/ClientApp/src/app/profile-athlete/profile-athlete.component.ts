import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { Usuario } from '../models/user';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-profile-athlete',
  templateUrl: './profile-athlete.component.html',
  styleUrls: ['./profile-athlete.component.css']
})
export class ProfileAthleteComponent implements OnInit {

  localUrl:string;
  update:boolean = true;
  user = 'paola'; //obtener nombre de usuario actual
  actualUser:Usuario;

  constructor(private utilsService: UtilsService, private apiService:ApiService) { }

  ngOnInit(): void {
    (document.getElementById('profile-photo-input') as HTMLInputElement).hidden = true;
    this.loadData();
  }

  /**
   * Metodo que se conecta al api para obtener la información de un usuario
   */
  loadData() {
    var result = this.apiService.get(`http://127.0.0.1:${this.apiService.PORT}/api/Usuarios/${this.user}`);
    result.subscribe(
      (value: Usuario)=>{
        this.actualUser = new Usuario(value.user, value.password, value.nombre, value.apellido1, 
          value.apellido2, this.utilsService.parseDate(value.fecha_nacimiento), value.nacionalidad, value.foto);
        this.updateProfile();
        console.log(value.fecha_nacimiento);
      }, (error:any)=>{
        console.log(error.statusText);
        console.log(error.status);
      });
  }

  /**
   * Metodo para actualizar los datos en el perfil, visualmente
   */
  updateProfile() {
    (document.getElementById('name') as HTMLInputElement).value = this.actualUser.nombre;
    (document.getElementById('last-name1') as HTMLInputElement).value = this.actualUser.apellido1;
    (document.getElementById('last-name2') as HTMLInputElement).value = this.actualUser.apellido2;
    (document.getElementById('birth') as HTMLInputElement).value = this.actualUser.fecha_nacimiento;
    (document.getElementById('nationality') as HTMLInputElement).value = this.actualUser.nacionalidad;
    (document.getElementById('username') as HTMLInputElement).value = this.actualUser.user;
    this.localUrl = this.actualUser.foto;
  }

  /**
   * Metodo para actualizar los datos de un usuario
   */
  getData() {
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
      this.updateUser(name.value, lastName1.value, lastName2.value, birth.value, nationality.value, username.value, inputFile.value);
    }

  }

  updateUser(name: string, lastName1: string, lastName2: string, birth: string, nationality: string, 
    username: string, inputFile: string) {
      if (inputFile == '' || name == '' || lastName1 == '' || lastName2 == '' || birth == '' || 
      nationality== '' || username == '') {
        this.utilsService.showInfoModal('Error', 'Por favor complete todos los campos.', 'saveMsjLabel', 'msjText', 'saveMsj');
        return;
      }
      
      this.actualUser.nombre = name;

  }

  /**
   * Metodo para eliminar la cuenta de un usuario
   */
  deleteAccount() {

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
