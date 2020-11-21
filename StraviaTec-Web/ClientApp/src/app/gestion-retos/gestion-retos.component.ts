import { Component, OnInit } from '@angular/core';
import { Reto } from '../models/reto';
import { UtilsService } from '../services/utils.service';
import { ApiService } from '../services/api.service';
import { Patrocinador } from '../models/patrocinador';
import { Grupo } from '../models/grupo';
import { PatrocinadorEvento } from '../models/patrocinadorEvento';
import { NOMEM } from 'dns';
import { EventoGrupo } from '../models/eventoGrupo';

@Component({
  selector: 'app-gestion-retos',
  templateUrl: './gestion-retos.component.html',
  styleUrls: ['./gestion-retos.component.css']
})
export class GestionRetosComponent implements OnInit {

  constructor(private utilsService: UtilsService, private apiService:ApiService) { }

  retos:Reto[] = [];
  patrocinadores = [];
  actividades = [];
  tiposReto = [];
  grupos = [];
  updating = false;
  actualReto: Reto;

  ngOnInit(): void {
    this.utilsService.configureContextMenu();
    this.loadRetos();
  }

  loadRetos() {
    console.log('Obteniendo todos los retos');
    const response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Reto`)
    response.subscribe(
      (value: Reto[]) => {
        this.retos = value;  
        this.loadActividades();
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
      });

  }

  getReto(id:number) {
    console.log("Obteniendo reto");
    const response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Reto/${id}`)
    response.subscribe(
      (value: Reto) => {
        value.inicio = this.utilsService.parseDate(value.inicio);
        value.fin = this.utilsService.parseDate(value.fin);
        this.actualReto = value;
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
      });

  }

  saveReto() {
    console.log('Guardando reto');
    const name = document.getElementById('name') as HTMLInputElement;
    const fechaInicio = document.getElementById('fecha-inicio') as HTMLInputElement;
    const fechaFin = document.getElementById('fecha-fin') as HTMLInputElement;
    const objetivo = document.getElementById('objetivo') as HTMLInputElement;
    const publico = document.getElementById('reto-publico') as HTMLInputElement;
    const privado = document.getElementById('reto-privado') as HTMLInputElement;
    const actividad = document.getElementById('activity') as HTMLSelectElement;
    const groups = document.getElementById('groups') as HTMLSelectElement;
    const tipoReto = document.getElementById('tipoReto') as HTMLSelectElement;
    const patrocinador = document.getElementById('sponsor') as HTMLSelectElement;

    if (name.value == '' || fechaInicio.value == '' || fechaFin.value == '' || tipoReto.value == 'Seleccione el tipo de reto' 
      || objetivo.value == '' || actividad.value == 'Seleccione una actividad' || patrocinador.selectedOptions.length == 0) {
      this.utilsService.showInfoModal('Error', 'Por favor complete todos los campos.', 'saveMsjLabel', 'msjText', 'saveMsj');
      return;
    }

    if (privado.checked && groups.selectedOptions.length == 0) {
      this.utilsService.showInfoModal('Error', 'Debe seleccionar los grupos que pueden tener acceso al reto.', 'saveMsjLabel', 'msjText', 'saveMsj');
      return;
    }

    let retoInfo;

    if (privado.checked) {
      retoInfo = {
        Nombre: name.value,
        Inicio: fechaInicio.value,
        Fin: fechaFin.value,
        Objetivo: objetivo.value,
        IdTipoReto: tipoReto.value,
        IdActividad: actividad.value,
        Patrocinadores: $('#sponsor').val(),
        Grupos: $('#groups').val(),
        EsPrivado: privado.checked
      };
    } else {
      retoInfo = {
        Nombre: name.value,
        Inicio: fechaInicio.value,
        Fin: fechaFin.value,
        Objetivo: objetivo.value,
        IdTipoReto: tipoReto.value,
        IdActividad: actividad.value,
        Patrocinadores: $('#sponsor').val(),
        Grupos: [],
        EsPrivado: privado.checked
      };
    }

    if (this.updating) {
      retoInfo.id = this.actualReto.id;
      this.updateRetoApi(retoInfo, [name, fechaInicio, fechaFin, objetivo], [actividad, groups, tipoReto, patrocinador]);
    } else {
      this.saveRetoApi(retoInfo, [name, fechaInicio, fechaFin, objetivo], [actividad, groups, tipoReto, patrocinador]);
    }
  }
  saveRetoApi(retoInfo: any, htmlElements: HTMLInputElement[], selectElements: HTMLSelectElement[]) {
    console.log(retoInfo);
    var response = this.apiService.post(`http://localhost:${this.apiService.PORT}/api/Reto`, retoInfo);
    response.subscribe(
      (value: any) => {
        console.log(value);
        this.loadRetos();
        this.utilsService.showInfoModal('Exito', 'Nuevo reto guardado correctamente.', 'saveMsjLabel', 'msjText', 'saveMsj');
        this.utilsService.cleanField(htmlElements, selectElements,
          ['Seleccione una actividad', 'Seleccione los grupos', 'Seleccione el tipo de reto','Seleccione un patrocinador']);
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
        if (error.status === 409) {
          this.utilsService.showInfoModal('Error', 'El reto ya existe', 'saveMsjLabel', 'msjText', 'saveMsj');
        }
      });
  }
  updateRetoApi(retoInfo: any, htmlElements: HTMLInputElement[], selectElements: HTMLSelectElement[]) {
    console.log(retoInfo);
    var response = this.apiService.put(`http://localhost:${this.apiService.PORT}/api/Reto/${retoInfo.id}`, retoInfo);
    response.subscribe(
      (value:any) => {
        this.loadRetos();
        this.utilsService.showInfoModal('Exito', 'Reto actualizado correctamente.', 'saveMsjLabel', 'msjText', 'saveMsj');
        this.utilsService.cleanField(htmlElements, selectElements,
          ['Seleccione una actividad', 'Seleccione los grupos', 'Seleccione el tipo de reto','Seleccione un patrocinador']);
        this.updating = false;
        (document.getElementById('saveButton') as HTMLButtonElement).textContent = 'Crear reto';
      }, (error: any) => {
      console.log(error.statusText);
      console.log(error.status);
    });
  }

  updateReto() {
    console.log('Actualizando retos');
    (document.getElementById('saveButton') as HTMLButtonElement).textContent = 'Actualizar reto';
    this.updating = true;
    this.setActivityName();
    this.setSponsorName();
    this.setTipoRetoName();

    let privado = this.actualReto.esPrivado;

    if (!privado) {
      (document.getElementById('reto-publico') as HTMLInputElement).checked = true;
      this.clearGroups();
    } else {
      (document.getElementById('reto-privado') as HTMLInputElement).checked = true;
      this.setGroups();
      this.setGroupsName();
    }

    (document.getElementById('name') as HTMLInputElement).value = this.actualReto.nombre;
    (document.getElementById('fecha-inicio') as HTMLInputElement).value = this.actualReto.inicio;
    (document.getElementById('fecha-fin') as HTMLInputElement).value = this.actualReto.fin;
    (document.getElementById('objetivo') as HTMLInputElement).value = this.actualReto.objetivo.toString();
  }

  deleteReto() {
    console.log('Eliminando reto');
    document.getElementById('optionMsj').style.setProperty('display', 'none');
    var response = this.apiService.delete(`http://localhost:${this.apiService.PORT}/api/Reto/${this.actualReto.id}`);
    response.subscribe(
      (value: any) => {
        this.utilsService.showInfoModal('Exito', 'Reto eliminado correctamente.', 'saveMsjLabel', 'msjText', 'saveMsj');
        this.loadRetos();
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        this.utilsService.showInfoModal('Error', 'Hubo un problema al eliminar el reto.', 'saveMsjLabel', 'msjText', 'saveMsj');
      });

  }

  clearGroups() {
    console.log('Publico seleccionado');
    document.getElementById('groupsOption').style.display = 'none'; 
  }

  setGroups() {
    console.log('Privado seleccionado');
    document.getElementById('groupsOption').style.display = 'flex'; 
  }

  /**
   *Metodo que se llama cuando se presiona click derecho en el item de la tabla
   * @param event Evento de click derecho
   * @param reto Reto seleccionada
   */
  onRetoClick(event: any, reto: Reto): boolean {
    this.utilsService.showContextMenu(event);
    this.getReto(reto.id); // todo obtener el id actual del reto seleccionado
    return false;
  }

   /**
   * Metodo para mostrar al usuario un modal para tomar una decision de si o no
   */
  askUser() {
    this.utilsService.showInfoModal('Eliminar', 'Esta seguro que desea eliminar el reto',
    'optionMsjLabel', 'optionText', 'optionMsj');
  }
  
  /**
   * Metodo para cerrar un modal
   * @param id Id del modal a cerrar
   */
  closeModal(id: string): void {
    document.getElementById(id).style.setProperty('display', 'none');
  }

  loadActividades() {
    var result = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/tipos`);
    result.subscribe(
      (value:any) => {
        this.actividades = value;
        this.loadPatrocinadores();
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
      }
      );
  }

  loadPatrocinadores() {
    var result = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/patrocinadores`);
    result.subscribe(
      (value:any) => {
        this.patrocinadores = value;
        this.loadTiposReto();
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
      }
      );
  }

  loadTiposReto() {
    var result = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/retos`);
    result.subscribe(
      (value:any) => {
        this.tiposReto = value;
        this.loadGrupos();
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
      }
      );

  }

  loadGrupos() {
    var response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Grupos`);
    response.subscribe(
      (value:Grupo[]) => {
        this.grupos = value;
        console.log('grupos size ' + this.grupos.length);
        this.getNombres();
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
      });
  }
  getNombres() {
    this.retos.forEach(reto => {
      var idActividad = reto.idTipoActividad;
      var name = this.actividades.find(a => a.id == idActividad).nombre;
      var tipoReto = this.tiposReto.find(r => r.id == reto.idTipoReto).nombre;
      reto.nombreTipoReto = tipoReto;
      reto.nombreActividad = name;
      reto.inicio = this.utilsService.parseDate(reto.inicio);
      reto.fin = this.utilsService.parseDate(reto.fin);
      this.getSponsorNames(reto.patrocinadorEvento);
      this.getGroupsNames(reto.eventoGrupo);
    })
  }
  getGroupsNames(eventoGrupo: EventoGrupo[]) {
    eventoGrupo.forEach(grupo => {
      var id = grupo.idGrupo;
      var name = this.grupos.find(g => g.id == id).nombre;
      grupo.nombreGrupo = name;
    });
  }

  getSponsorNames(patrocinadorEvento: PatrocinadorEvento[]) {
    patrocinadorEvento.forEach(patrocinador => {
      var idP = patrocinador.idPatrocinador;
      var name = this.patrocinadores.find(p => p.id == idP).nombreComercial;
      patrocinador.nombreComercial = name;
    });
  }

  getCheckedRadio (name: string) {
    var elements = document.getElementsByName(name) as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].checked) return elements[i].value;
    }
  }

  setMultiValues(selectName: string, selectValues: any) {
    const select = (document.getElementById(selectName) as HTMLSelectElement).options;
  
    for (var i = 0; i < select.length; i++) {
      /* Parse value to integer */
      const value = Number.parseInt(select[i].value);
      /* If option value contained in values, set selected attribute */
      if (selectValues.indexOf(value) !== -1) {
        select[i].setAttribute('selected', 'selected');
      }
      /* Otherwise ensure no selected attribute on option */
      else {
        select[i].removeAttribute('selected');
      }
    }
  }

  setGroupsName() {
    this.setMultiValues('groups', this.actualReto.eventoGrupo.map(g => g.idGrupo));
  }

  setSponsorName() {
    this.setMultiValues('sponsor', this.actualReto.patrocinadorEvento.map(p => p.idPatrocinador));
  }

  setActivityName() {
    this.setMultiValues('activity', [this.actualReto.idTipoActividad]);
  }

  setTipoRetoName() {
    this.setMultiValues('tipoReto', [this.actualReto.idTipoReto]);
  }
}
