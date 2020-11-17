import { Component, OnInit } from '@angular/core';
import { Carrera} from '../models/carrera';
import { UtilsService } from '../services/utils.service';
import { ApiService } from '../services/api.service';
import { Patrocinador } from '../models/patrocinador';
import { Race } from '../models/race';
import * as $ from 'jquery';


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


  constructor(private utilsService: UtilsService, private apiService:ApiService) { }

  ngOnInit(): void {
    this.utilsService.configureContextMenu();
    this.loadCarreras();
    this.loadActividades();
    this.loadPatrocinadores();
    this.loadCategorias();
    // TODO cargar patrocinadores, actividades y categorias
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

  loadCategorias() {
    var result = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/categorias`);
    result.subscribe(
      (value:any) => {
        this.categorias = value;
      }, (error:any) => {
        console.log(error.statusText);
        console.log(error.status);
      }
      );
  }

  loadGrupos() {
    //TODO: Cargar grupos de la carrera
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
    console.log('\n');
    const response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Carreras/all`)
    response.subscribe(
      (value: Race[]) => {
        console.log('Carreras ' + value);
        this.carreras = value;
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
    const cuenta = (document.getElementById('cuentaB') as HTMLInputElement);
    const recorrido = (document.getElementById('recorrido') as HTMLInputElement);
    let privado = this.getCheckedRadio('optradio');

    if (nombre.value == '' || actividad.value == null || categoria.value == '' || fecha.value == '' || patrocinador.value == '' || 
      costo.value == '' || cuenta.value == '' || recorrido.value == '') {
        this.utilsService.showInfoModal('Error', 'Por favor complete todos los campos.', 'saveMsjLabel', 'msjText', 'saveMsj');
        return;
    } 

    let carreraInfo = {
      Nombre: nombre.value,
      Fecha: fecha.value,
      Costo: costo.value,
      TipoActividad: actividad.value,
      EsPrivado: privado,
      ArchivoRecorrido: this.localUrl.toString(),
      Patrocinadores: $('#sponsor').val(),
      Grupos: [],
      CuentasBancarias: [cuenta.value],
      Categorias: $('#category').val()
    };
    // const carrera = new Carrera(nombre.value, actividad.valueAsNumber , fecha.value, cuentas.value, categoria.valueAsNumber,
    //   patrocinador.valueAsNumber, costo.valueAsNumber, this.localUrl.toString());
  
    console.log(carreraInfo);
    this.createCarrera(carreraInfo);

  }

  getCheckedRadio (name: string) {
    var elements = document.getElementsByName(name) as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].checked) return elements[i].value;
    }
  }

  createCarrera(carrera: any) {
    var response = this.apiService.post(`http://localhost:${this.apiService.PORT}/api/Carreras`,carrera);
    response.subscribe(
      (value: Carrera) => {
        console.log('Producer ' + value);
        this.loadCarreras();
        this.utilsService.showInfoModal('Exito', 'Nueva carrera guardada correctamente.', 'saveMsjLabel', 'msjText', 'saveMsj');
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        if (error.status === 409) {
          this.utilsService.showInfoModal('Error', 'La carrera ya existe', 'saveMsjLabel', 'msjText', 'saveMsj');
        }
        console.log(carrera);
      });
  }

  getCarrera(id: number) {

  }

  deleteRace() {

  }

  updateCarrera() {

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
  onCarreraClick(event: any, race: Carrera): boolean {
    this.utilsService.showContextMenu(event);
    this.getCarrera(1); // todo obtener la carrera seleccionada
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
  