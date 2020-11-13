import { Component, OnInit } from '@angular/core';
import { Reto } from '../models/reto';
import { UtilsService } from '../services/utils.service';
import { ApiService } from '../services/api.service';
import { Patrocinador } from '../models/patrocinador';

@Component({
  selector: 'app-gestion-retos',
  templateUrl: './gestion-retos.component.html',
  styleUrls: ['./gestion-retos.component.css']
})
export class GestionRetosComponent implements OnInit {

  constructor(private utilsService: UtilsService, private apiService:ApiService) { }

  retos = [];
  patrocinadores = [];
  actividades = [];
  tiposReto = [];
  grupos = [];
  updating = false;
  actualReto: Reto;

  ngOnInit(): void {
    this.utilsService.configureContextMenu();
    this.loadRetos();
    this.loadActividades();
    this.loadPatrocinadores();
    this.loadTiposReto();

    let pat = new Patrocinador(1, 'Movistar', 'Movistar', '1', '1');
    let reto = new Reto('nombre', '2020-12-01', '2020-12-15', 50, 1, 1, [pat], ['1', '2'], false);
    reto.nombreReto = 'Fondo';
    reto.nombreActividad = 'Correr';
    this.retos.push(reto);
    this.actualReto = reto;
  }

  loadRetos() {
    console.log('Cargando retos');

  }

  getReto(id:number) {
    console.log("Obteniendo reto");
  }

  saveReto() {
    console.log('Guardando reto');
    const name = document.getElementById('name') as HTMLInputElement;
    const fechaInicio = document.getElementById('fecha-inicio') as HTMLInputElement;
    const fechaFin = document.getElementById('fecha-fin') as HTMLInputElement;
    const tipoReto = document.getElementById('tipoReto') as HTMLSelectElement;
    const objetivo = document.getElementById('objetivo') as HTMLInputElement;
    const actividad = document.getElementById('activity') as HTMLSelectElement;
    const publico = document.getElementById('reto-publico') as HTMLInputElement;
    const privado = document.getElementById('reto-privado') as HTMLInputElement;
    const groups = document.getElementById('groups') as HTMLSelectElement;
    const patrocinador = document.getElementById('sponsor') as HTMLSelectElement;

    // console.log('Public ' + publico.checked);
    // console.log('Privado ' + privado.checked);
    // let pat = patrocinador.selectedOptions; 
    // let out = '';
    // for (let i=0; i<pat.length; i++) {
    //   console.log(pat[i].value);
    //   console.log(pat[i].label);
    // }

    // console.log(patrocinador.selectedOptions.length);

    if (name.value == '' || fechaInicio.value == '' || fechaFin.value == '' || tipoReto.value == 'Seleccione el tipo de reto' || objetivo.value == '' || actividad.value == 'Seleccione una actividad' || patrocinador.selectedOptions.length == 0) {
      this.utilsService.showInfoModal('Error', 'Por favor complete todos los campos.', 'saveMsjLabel', 'msjText', 'saveMsj');
      return;
    }

    if (privado.checked && groups.selectedOptions.length == 0) {
      this.utilsService.showInfoModal('Error', 'Debe seleccionar los grupos que pueden tener acceso al reto.', 'saveMsjLabel', 'msjText', 'saveMsj');
      return;
    }





  }

  updateReto() {
    console.log('Actualizando retos');
    this.updating = true;

    let publico = this.actualReto.publico;

    if (publico) {
      (document.getElementById('reto-publico') as HTMLInputElement).checked = true;
      this.clearGroups();
    } else {
      (document.getElementById('reto-privado') as HTMLInputElement).checked = true;
      this.setGroups();
    }

    (document.getElementById('name') as HTMLInputElement).value = this.actualReto.nombre;
    (document.getElementById('fecha-inicio') as HTMLInputElement).value = this.actualReto.inicio;
    (document.getElementById('fecha-fin') as HTMLInputElement).value = this.actualReto.fin;
    (document.getElementById('tipoReto') as HTMLSelectElement).value = this.actualReto.nombreReto;
    (document.getElementById('objetivo') as HTMLInputElement).value = this.actualReto.objetivo.toString();
    (document.getElementById('activity') as HTMLSelectElement).value = this.actualReto.nombreActividad;
    (document.getElementById('groups') as HTMLSelectElement);
    (document.getElementById('sponsor') as HTMLSelectElement);

  }

  deleteReto() {
    console.log('Eliminando reto');
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
    this.getReto(1); // todo obtener el id actual del reto seleccionado
    return false;
  }

   /**
   * Metodo para mostrar al usuario un modal para tomar una decision de si o no
   */
  askUser() {
    this.utilsService.showInfoModal('Eliminar', 'Esta seguro que desea eliminar la carrera',
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
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
      }
      );

  }

  loadGrupos() {
    console.log('Cargando grupos');
  }

}
