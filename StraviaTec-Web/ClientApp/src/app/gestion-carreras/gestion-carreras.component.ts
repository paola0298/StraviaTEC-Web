import { Component, OnInit } from '@angular/core';
import { Carrera} from '../models/carrera';
import { UtilsService } from '../services/utils.service';
import { ApiService } from '../services/api.service';

import { Patrocinador } from '../models/patrocinador';
import { Race } from '../models/race';
import * as $ from 'jquery';
import { Grupo } from '../models/grupo';
import { flattenDiagnosticMessageText } from 'typescript';
import { CategoriaCarrera } from '../models/categoriaCarrera';
import { PatrocinadorEvento } from '../models/patrocinadorEvento';


@Component({
  selector: 'app-gestion-carreras',
  templateUrl: './gestion-carreras.component.html',
  styleUrls: ['./gestion-carreras.component.css']
})
export class GestionCarrerasComponent implements OnInit {
  localUrl: any[];
  created:boolean = false;
  carreras: Race[] = [];
  patrocinadores = [];
  actividades = [];
  categorias = [];
  grupos = [];
  cuentas = [];
  actualCarrera: Race;
  updating = false;


  constructor(private utilsService: UtilsService, private apiService:ApiService) { }

  ngOnInit(): void {
    this.utilsService.configureContextMenu();
    this.loadCarreras();
    
  }

  getNombres() {
    console.log('carreras tamanio ' + this.carreras.length);
    var newCarreras: Race[] = [];
    this.carreras.forEach(carrera => {
      var idActividad = carrera.idTipoActividad;
      var name = this.actividades.find(a => a.id == idActividad).nombre;
      carrera.nombreTipoActividad = name;
      carrera.fecha = this.utilsService.parseDate(carrera.fecha);
      this.getCategoryNames(carrera.categoriaCarrera);
      this.getSponsorNames(carrera.patrocinadorEvento);
      // carrera.categoriaCarrera = this.getCategoryNames(carrera.categoriaCarrera);
      // carrera.patrocinadorEvento = this.getSponsorNames(carrera.patrocinadorEvento);
    });
  }
  getSponsorNames(patrocinadorEvento: PatrocinadorEvento[]) {
    patrocinadorEvento.forEach(patrocinador => {
      var idP = patrocinador.idPatrocinador;
      var name = this.patrocinadores.find(p => p.id == idP).nombreComercial;
      patrocinador.nombreComercial = name;
    });

    return patrocinadorEvento;
  }
  getCategoryNames(categoriaCarrera: CategoriaCarrera[]) {
    categoriaCarrera.forEach(categoria => {
      var idCat = categoria.idCategoria;
      var name = this.categorias.find(c => c.id == idCat).nombre;
      categoria.nombre = name;
    });

    return categoriaCarrera;
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
        this.loadCategorias();
    
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
      }
      );
  }

  loadCategorias() {
    var result = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/categorias`);
    result.subscribe(
      (value:any) => {
        this.categorias = value;
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
        this.getNombres();
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
      });
  }

  loadRuta(event:any) {
    // (document.getElementById('recorrido') as HTMLInputElement).setAttribute('hidden', 'true');
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
          // console.log(reader.result);
          this.localUrl = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  loadCarreras() {
    console.log('Obteniendo todas las carreras');
    const response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Carreras/all`)
    response.subscribe(
      (value: Race[]) => {
        console.log('Carreras ' + value);
        this.carreras = value;
        
    this.loadActividades();
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
      });
  }

  saveCarrera() {
    const nombre = (document.getElementById('name') as HTMLInputElement);
    const actividad = (document.getElementById('activity') as HTMLSelectElement);
    const categoria = (document.getElementById('category') as HTMLSelectElement);
    const fecha = (document.getElementById('fecha') as HTMLInputElement);
    const patrocinador = (document.getElementById('sponsor') as HTMLSelectElement);
    const costo = (document.getElementById('costo') as HTMLInputElement);
    const recorrido = (document.getElementById('recorrido') as HTMLInputElement);
    const privado = this.getCheckedRadio('optradio');
    const gruposE = (document.getElementById('groups') as HTMLSelectElement);

    if (nombre.value == '' || actividad.value == 'Seleccione una actividad' || categoria.value == 'Seleccione una categoria' 
      || fecha.value == '' || patrocinador.value == 'Seleccione un patrocinador' || 
      costo.value == '' || this.cuentas.length == 0 || recorrido.value == '') {
        this.utilsService.showInfoModal('Error', 'Por favor complete todos los campos.', 'saveMsjLabel', 'msjText', 'saveMsj');
        return;
    }

    let carreraInfo;

    if (privado == 'true') {
      console.log('privado ' + privado );
      if (gruposE.value == 'Seleccione los grupos') {
        this.utilsService.showInfoModal('Error', 'Por favor complete todos los campos.', 'saveMsjLabel', 'msjText', 'saveMsj');
        return;
      }
      carreraInfo = {
        Nombre: nombre.value,
        Fecha: fecha.value,
        Costo: costo.value,
        TipoActividad: actividad.value,
        EsPrivado: privado,
        ArchivoRecorrido: this.localUrl.toString(),
        Patrocinadores: $('#sponsor').val(),
        Grupos: $('#groups').val(),
        CuentasBancarias: this.cuentas,
        Categorias: $('#category').val()
      };
    } else {
      carreraInfo = {
        Nombre: nombre.value,
        Fecha: fecha.value,
        Costo: costo.value,
        TipoActividad: actividad.value,
        EsPrivado: privado,
        ArchivoRecorrido: this.localUrl.toString(),
        Patrocinadores: $('#sponsor').val(),
        Grupos: [],
        CuentasBancarias: this.cuentas,
        Categorias: $('#category').val()
      };
    }

    
    // const carrera = new Carrera(nombre.value, actividad.valueAsNumber , fecha.value, cuentas.value, categoria.valueAsNumber,
    //   patrocinador.valueAsNumber, costo.valueAsNumber, this.localUrl.toString());
  
    console.log('carrera info ' + carreraInfo);

    if (this.updating) {
      //set id
      carreraInfo.id = this.actualCarrera.id;
      this.updateCarreraApi(carreraInfo, [nombre, fecha, costo, recorrido], [actividad, categoria, patrocinador, gruposE]);
    } else {
      this.saveCarreraApi(carreraInfo, [nombre, fecha, costo, recorrido], [actividad, categoria, patrocinador, gruposE]);
    }
  }

  getCheckedRadio (name: string) {
    var elements = document.getElementsByName(name) as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].checked) return elements[i].value;
    }
  }

  saveCarreraApi(carrera: any, htmlElements: HTMLInputElement[], selectElements: HTMLSelectElement[]) {
    var response = this.apiService.post(`http://localhost:${this.apiService.PORT}/api/Carreras`, carrera);
    response.subscribe(
      (value: Carrera) => {
        console.log('Producer ' + value);
        this.loadCarreras();
        this.utilsService.showInfoModal('Exito', 'Nueva carrera guardada correctamente.', 'saveMsjLabel', 'msjText', 'saveMsj');
        this.utilsService.cleanField(htmlElements, selectElements,
          ['Seleccione una actividad', 'Seleccione una categoria', 'Seleccione un patrocinador', 'Seleccione los grupos']);
        this.cuentas = [];
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
        if (error.status === 409) {
          this.utilsService.showInfoModal('Error', 'La carrera ya existe', 'saveMsjLabel', 'msjText', 'saveMsj');
        }
        console.log(carrera);
      });
  }

  getCarrera(id: number) {
    console.log('Obteniendo una carrera');
    const response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Carreras/${id}`)
    response.subscribe(
      (value: Race) => {
        console.log('Carrera ' + value);
        this.actualCarrera = value;
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
      });
  }

  deleteRace() {
    document.getElementById('optionMsj').style.setProperty('display', 'none');
    var response = this.apiService.delete(`http://localhost:${this.apiService.PORT}/api/Carreras/${this.actualCarrera.id}`);
    response.subscribe(
      (value: any) => {
        console.log('Deleted');
        this.utilsService.showInfoModal('Exito', 'Carrera eliminada correctamente.', 'saveMsjLabel', 'msjText', 'saveMsj');
        this.loadCarreras();
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        this.utilsService.showInfoModal('Error', 'Hubo un problema al eliminar la carrera.', 'saveMsjLabel', 'msjText', 'saveMsj');
      }
    );
  }

  updateCarrera() {
    (document.getElementById('saveButton') as HTMLButtonElement).textContent = 'Actualizar carrera';
    this.updating = true;
    this.setCuentas();
    this.setCategoryName();
    this.setActivityName();
    this.setSponsorName();
    (document.getElementById('name') as HTMLInputElement).value = this.actualCarrera.nombre;
    (document.getElementById('fecha') as HTMLInputElement).value = this.utilsService.parseDate(this.actualCarrera.fecha);
    (document.getElementById('costo') as HTMLInputElement).value = this.actualCarrera.costo.toString();
    if (this.actualCarrera.esPrivado){
      (document.getElementById('privado-radio') as HTMLInputElement).checked = true;
      this.setGroups();
      this.setGroupsName();
    } else {
      (document.getElementById('publico-radio') as HTMLInputElement).checked = true;
      this.clearGroups();
    }
  }

  updateCarreraApi(carrera: any, htmlElements: HTMLInputElement[], selectElements: HTMLSelectElement[]) {
    const response = this.apiService.put(`http://localhost:${this.apiService.PORT}/api/Carreras/${carrera.id}`, carrera);
    response.subscribe((value: any) => {
      this.utilsService.showInfoModal('Exito', 'Carrera actualizada correctamente.', 'saveMsjLabel', 'msjText', 'saveMsj');
      this.utilsService.cleanField(htmlElements, selectElements,
        ['Seleccione una actividad', 'Seleccione una categoria', 'Seleccione un patrocinador', 'Seleccione los grupos']);
      this.cuentas = [];
      this.loadCarreras();
      this.updating = false;
      (document.getElementById('saveButton') as HTMLButtonElement).textContent = 'Crear carrera';
    }, (error: any) => {
      console.log(error.statusText);
      console.log(error.status);
    });
  }

  setCuentas() {
    this.actualCarrera.cuentaBancaria.forEach(element => {
      this.cuentas.push(element.nombre);
    });
    
  }

  setSponsorName() {
    this.setMultiValues('sponsor', this.actualCarrera.patrocinadorEvento.map(p => p.idPatrocinador));
    
  }

  setActivityName() {
    this.setMultiValues('activity', [this.actualCarrera.idTipoActividad]);
  }

  setGroupsName() {
    console.log(this.actualCarrera.eventoGrupo.map(g => g.idGrupo));
    this.setMultiValues('groups', this.actualCarrera.eventoGrupo.map(g => g.idGrupo));
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

  setCategoryName() {
    this.setMultiValues('category', this.actualCarrera.categoriaCarrera.map(c => c.idCategoria));
  }

  addCuenta() {
    const cuenta = (document.getElementById('cuentaB') as HTMLInputElement);

    if (cuenta.value == '') {
      this.utilsService.showInfoModal('Error', 'Por favor ingrese una cuenta bancaria', 'saveMsjLabel', 'msjText', 'saveMsj');
      return;
    }

    this.cuentas.push(cuenta.value);
    cuenta.value = '';
  }

  deleteCuenta(cuenta: string) {
    const index = this.cuentas.indexOf(cuenta);
    this.cuentas.splice(index, 1);
  }

  clearGroups() {
    console.log("Publico seleccionado");
    document.getElementById('groupsOption').style.display = 'none'; 
  }

  setGroups() {
    console.log("Privado seleccionado");
    document.getElementById('groupsOption').style.display = 'flex'; 
  }

  /**
   *Metodo que se llama cuando se presiona click derecho en el item de la tabla
   * @param event Evento de click derecho
   * @param race Carrera seleccionada
   */
  onCarreraClick(event: any, race: Race): boolean {
    this.utilsService.showContextMenu(event);
    this.getCarrera(race.id); // todo obtener la carrera seleccionada
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
}
  