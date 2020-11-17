import { Component, OnInit } from '@angular/core';
import { Grupo} from '../models/grupo';
import { UtilsService } from '../services/utils.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-gestion-grupos',
  templateUrl: './gestion-grupos.component.html',
  styleUrls: ['./gestion-grupos.component.css']
})
export class GestionGruposComponent implements OnInit {
  usuarios = [];
  grupos = [];
  actualGrupo: Grupo;

  constructor(private utilsService: UtilsService, private apiService:ApiService) { }

  ngOnInit(): void {
    this.utilsService.configureContextMenu();
    this.loadUsuarios();
  }

  loadUsuarios() {
    var result = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Usuarios`);
    result.subscribe(
      (value:any) => {
        this.usuarios = value;
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
      }
      );
  }

  
  saveGrupo() {
    const nombre = (document.getElementById('name') as HTMLInputElement);
    const admin = (document.getElementById('admin') as HTMLInputElement);


    if (nombre.value == '' || admin.value == null) {
        this.utilsService.showInfoModal('Error', 'Por favor complete todos los campos.', 'saveMsjLabel', 'msjText', 'saveMsj');
        return;
    } 

    const grupo = new Grupo(nombre.value, admin.value);
  
    this.createGrupo(grupo);

  }

  loadGrupos() {
    console.log('Obteniendo todos los');
    console.log('\n');
    const response = this.apiService.get(`http//localhost:${this.apiService.PORT}/api/Grupos`)
    response.subscribe(
      (value: Grupo[]) => {
        console.log('Carreras ' + value);
        this.grupos = value;
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
      });
  }

  createGrupo(grupo: Grupo) {
    var response = this.apiService.post(`http://localhost:${this.apiService.PORT}/api/Grupos`,grupo);
    response.subscribe(
      (value: Grupo) => {
        console.log('Grupo ' + value);
        this.loadGrupos();
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
  askUser(): void {
    this.utilsService.showInfoModal('Eliminar', 'Esta seguro que desea eliminar el grupo con el nombre ' +
    this.actualGrupo.nombre,
    'optionMsjLabel', 'optionText', 'optionMsj');
  }

}
