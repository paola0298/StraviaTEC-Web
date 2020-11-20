import { Component, OnInit } from '@angular/core';
import { Grupo } from '../models/grupo';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-gestion-grupos',
  templateUrl: './gestion-grupos.component.html',
  styleUrls: ['./gestion-grupos.component.css']
})
export class GestionGruposComponent implements OnInit {

  constructor(private utilsService: UtilsService, private apiService: ApiService) { }

  user = window.localStorage.getItem('userId');
  grupos: Grupo[] = [];
  actualGroup: Grupo;
  updating = false;

  ngOnInit(): void {
    this.loadGroups();
    this.utilsService.configureContextMenu();
  }

  loadGroups() {
    console.log('Obteniendo todos los grupos');
    const response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Grupos/user/${this.user}`);
    response.subscribe(
      (value: Grupo[]) => {
        console.log('grupos ' + value);
        this.grupos = value;
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
      });
  }

  saveGroup() { 
    const nombre = (document.getElementById('nameGroup') as HTMLInputElement);

    if (nombre.value == '') {
        this.utilsService.showInfoModal('Error', 'Por favor indique el nombre del grupo.', 'saveMsjLabel', 'msjText', 'saveMsj');
        return;
    } 

    const grupo = new Grupo(nombre.value, this.user);
    console.log(grupo);
    if (this.updating) {
      this.actualGroup.nombre = nombre.value;
      this.updateGroupApi(nombre);
      return;
    }
    this.createGroup(grupo);
  }

  createGroup(grupo: Grupo) {
    var response = this.apiService.post(`http://localhost:${this.apiService.PORT}/api/Grupos`, grupo);
    response.subscribe(
      (value: Grupo) => {
        console.log('Grupo ' + value);
        this.loadGroups();
        this.utilsService.showInfoModal('Exito', 'Nueva carrera guardada correctamente.', 'saveMsjLabel', 'msjText', 'saveMsj');
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        if (error.status === 409) {
          this.utilsService.showInfoModal('Error', 'La carrera ya existe', 'saveMsjLabel', 'msjText', 'saveMsj');
        }
        console.log(grupo);
      });
  }

   /**
   * Metodo para mostrar el menu contextual en la tabla al presionar click derecho
   * @param event Evento del mouse
   * @param grupo Grupo seleccionado
   */
  onGroupClick(event: any, grupo: Grupo) { 
    this.utilsService.showContextMenu(event);
    console.log(grupo.id);
    this.getGroup(grupo.id);
    return false;
  }

  getGroup(id: number) { 
    console.log('Obteniendo grupo actual');
    const response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Grupos/${id}`);
    response.subscribe(
      (value: Grupo) => {
        console.log('grupos ' + value.id + ' ' + value.nombre);
        this.actualGroup = value;
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
      });
  }

  updateGroup() { 
    (document.getElementById('nameGroup') as HTMLInputElement).value = this.actualGroup.nombre;
    (document.getElementById('saveButton') as HTMLButtonElement).textContent = 'Actualizar';
    this.updating = true;
  }

  updateGroupApi(inputElementName: HTMLInputElement) {
    console.log('Actualizando grupo');
    console.log(this.actualGroup.id);
    console.log(this.actualGroup.idAdmin);
    console.log(this.actualGroup.nombre);
    const response = this.apiService.put(`http://localhost:${this.apiService.PORT}/api/Grupos/${this.actualGroup.id}`, this.actualGroup);
    response.subscribe(
      (value: any) => {
        this.utilsService.showInfoModal('Exito', 'Grupo actualizado correctamente.', 'saveMsjLabel', 'msjText', 'saveMsj');
        this.utilsService.cleanField([inputElementName], [], []);
        this.loadGroups();
        this.updating = false;
        (document.getElementById('saveButton') as HTMLButtonElement).textContent = 'Guardar';
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
      });
  }

  deleteGroup() {
    document.getElementById('optionMsj').style.setProperty('display', 'none');
    const response = this.apiService.delete(`http://localhost:${this.apiService.PORT}/api/Grupos/${this.actualGroup.id}`);
    response.subscribe(
      (value: any) => {
        this.utilsService.showInfoModal('Exito', 'Grupo eliminado correctamente.', 'saveMsjLabel', 'msjText', 'saveMsj');
        this.loadGroups();
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        this.utilsService.showInfoModal('Error', 'Hubo un problema al eliminar el grupo.', 'saveMsjLabel', 'msjText', 'saveMsj');
      });

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
    this.utilsService.showInfoModal('Eliminar', 'Esta seguro que desea eliminar el grupo: ' + this.actualGroup.nombre,
    'optionMsjLabel', 'optionText', 'optionMsj');
  }



}
