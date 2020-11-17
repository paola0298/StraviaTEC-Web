import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { Grupo } from '../models/grupo';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-asociarse-grupo',
  templateUrl: './asociarse-grupo.component.html',
  styleUrls: ['./asociarse-grupo.component.css']
})
export class AsociarseGrupoComponent implements OnInit {

  grupos:Grupo[] = [];
  user = window.localStorage.getItem('userId');

  constructor(private apiService:ApiService, private utilsService:UtilsService) { }

  ngOnInit(): void {
    this.getGroups();
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

  joinGroup(asociado:string, idGrupo:number) {
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

    var response = this.apiService.delete(`http://localhost:${this.apiService.PORT}/api/UsuarioGrupo/${idGrupo}/${this.user}`);
    response.subscribe(
      (value:any) => {
        console.log('Eliminado del grupo');
        this.getGroups();
    }, (error:any) => {
      console.log(error.statusText);
      console.log(error.status);
    });

  }

  closeModal(modal:string) {
    document.getElementById(modal).style.setProperty('display', 'none');
  }

}
