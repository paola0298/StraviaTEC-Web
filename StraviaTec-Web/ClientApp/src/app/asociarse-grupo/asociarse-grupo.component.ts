import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { NumberLiteralType } from 'typescript';
import { Grupo } from '../models/grupo';
import { Usuario } from '../models/user';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-asociarse-grupo',
  templateUrl: './asociarse-grupo.component.html',
  styleUrls: ['./asociarse-grupo.component.css']
})
export class AsociarseGrupoComponent implements OnInit {

  grupos:Grupo[] = [];
  usuariosGrupo:Usuario[] = [];
  user = window.localStorage.getItem('userId');
  idActualGroup: number;
  nameActualGroup: string;

  constructor(private apiService:ApiService, private utilsService:UtilsService) { }

  ngOnInit(): void {
    this.getGroups();
  }


  loadUsersGroup(idGroup: number) {
    console.log('Obteniendo usuarios grupo');
    var response =  this.apiService.get(`http://localhost:${this.apiService.PORT}/api/UsuarioGrupo/usuarios/${idGroup}`);
    response.subscribe(
      (value:Usuario[]) => {
        this.usuariosGrupo = value;
        var actual = this.usuariosGrupo.findIndex(u => u.user == this.user);
        if (actual >= 0) {
          this.usuariosGrupo.splice(actual, 1);
        }
        this.utilsService.showInfoModal('Informacion', '', 'selectMsjLabel', 'selectmsjText', 'selectMsj');
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
      });
  }

  getGroups() {
    var response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Grupos`);
    response.subscribe(
      (value:Grupo[]) => {
        var groups = value;
        var response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/UsuarioGrupo/grupo/${this.user}`);
        response.subscribe((value:Grupo[]) => {
          var gruposUsuario = value;
          groups.forEach(element => {
            var grupo = gruposUsuario.find(g => g.id == element.id);
            if (grupo != undefined || element.idAdmin == this.user) {
              element.asociado = 'Salir del grupo';
            } else {
              element.asociado = 'Unirse al grupo';
            }
          });
          this.grupos = groups;
        }, (error:any) => {
          console.log(error.statusText);
          console.log(error.status);
          console.log(error);
        });

      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
      });
  }

  searchGroup() {

  }

  joinGroup(asociado:string, idGrupo:number, idAdmin:string, name:string) {
    this.idActualGroup = idGrupo;
    this.nameActualGroup = name;

    var groupInfo = {
      idGrupo : idGrupo,
      idUsuario : this.user
    };

    if (asociado == 'Unirse al grupo') {
      var response = this.apiService.post(`http://localhost:${this.apiService.PORT}/api/UsuarioGrupo`, groupInfo);
      response.subscribe((value:any) => {
        console.log('Agregado al grupo');
        this.getGroups();
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
      });
      return;
    }

    if (idAdmin == this.user) {
      this.loadUsersGroup(idGrupo);
    }
  }

  remove() {
    var newAdmin = (document.getElementById('nuevoAdmin') as HTMLSelectElement);

    if (newAdmin.value == 'Seleccione el nuevo administrador') {
      document.getElementById('selectmsjText').textContent = 'Debe seleccionar un administrador';
      return;
    }

    var list:string[] = newAdmin.value.split(' ');
    var idNewAdmin = list[list.length - 1];

    var nuevoGrupo = new Grupo(this.nameActualGroup, idNewAdmin);
    nuevoGrupo.id = this.idActualGroup;
    var updateAdmin = this.apiService.put(`http://localhost:${this.apiService.PORT}/api/Grupos/${this.idActualGroup}`, nuevoGrupo);
    updateAdmin.subscribe((value:any) => {
      console.log('Grupo Actualizado');
      var response = this.apiService.delete(`http://localhost:${this.apiService.PORT}/api/UsuarioGrupo/${this.idActualGroup}/${this.user}`);
      response.subscribe(
        (value:any) => {          
          console.log('Eliminado del grupo');
          this.getGroups();
        }, (error:any) => {
          console.log(error.statusText);
          console.log(error.status);
        });
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
      });

      this.closeModal('selectMsj');
    }

  closeModal(modal:string) {
    document.getElementById(modal).style.setProperty('display', 'none');
  }


}
