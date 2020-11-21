import { Component, OnInit } from '@angular/core';
import { InscripcionEvento } from '../models/inscripcionEvento';
import { Race } from '../models/race';
import { Usuario } from '../models/user';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-affiliations',
  templateUrl: './affiliations.component.html',
  styleUrls: ['./affiliations.component.css']
})
export class AffiliationsComponent implements OnInit {

  affiliations: InscripcionEvento[];
  actualAfiliation: InscripcionEvento;
  clicked = false;

  constructor(private utilsService: UtilsService, private apiService:ApiService) { }

  ngOnInit(): void {
    this.utilsService.configureContextMenu();
    this.loadAffiliations();
  }

  loadAffiliations() {
    var response =  this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Inscripciones`);
    response.subscribe(
      (value: InscripcionEvento[]) => {
        console.log(value);
        this.affiliations = value;
        console.log(this.affiliations.length);
        this.getNombres();
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
      });
  }

  getNombres() {
    this.affiliations.forEach(affiliation => {  
      this.getUserInfo(affiliation.idUsuario, affiliation);
      this.getCarreraInfo(affiliation.idCategoriaCarrera, affiliation);
    });
  }

  getUserInfo(id: string, affiliation: InscripcionEvento) {
    var result = this.apiService.get(`http://127.0.0.1:${this.apiService.PORT}/api/Usuarios/${id}`);
    result.subscribe(
      (value: Usuario)=>{
        console.log(value.nombre);
        affiliation.nombreDeportista = `${value.nombre} ${value.apellido1} ${value.apellido2}`;
      }, (error:any)=>{
        console.log(error.statusText);
        console.log(error.status);
      });
  }

  getCarreraInfo(id: number, affiliation: InscripcionEvento) {
    var response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Inscripciones/carrera/${id}`);
    response.subscribe(
      (info: Race) => {
        console.log(info.nombre);
        affiliation.nombreCarrera = info.nombre;
      }, (error:any)=>{
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
      });
  }

  onImageClick() {
    console.log('click image');
    console.log(this.clicked);
    var comprobante = document.getElementById('comprobante');
    if (this.clicked) {
      comprobante.style.transform = "scale(1)"; 
      comprobante.style.transition = "transform 0.25s ease"; 
      this.clicked = false;
      return;
    } 
    comprobante.style.transform = "scale(4)";
    comprobante.style.transition = "transform 0.25s ease";
    this.clicked = true;
  }

  /**
   *Metodo que se llama cuando se presiona click derecho en el item de la tabla
   * @param event Evento de click derecho
   * @param affiliation Afiliacion seleccionada
   */
  onAffiliationClick(event: any, affiliation: InscripcionEvento): boolean {
    this.getAffiliation(affiliation.id);
    this.utilsService.showContextMenu(event);
    return false;
  }

  getAffiliation(id: number) { 
    console.log('Obteniendo inscripcion actual');
    var response =  this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Inscripciones/${id}`);
    response.subscribe(
      (value: InscripcionEvento) => {
        console.log("inscripcion actual " + value);
        this.actualAfiliation = value;
        this.getNombres();
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
      });
  }

  accept() {
    if (this.actualAfiliation.estado == 'aprobado' || this.actualAfiliation.estado == 'denegado') {
      this.utilsService.showInfoModal("Error", "La solicitud ya ha sido verificada", "saveMsjLabel", "msjText", 'saveMsj');
      return;
    }
    console.log('Aceptando inscripcion');
    this.actualAfiliation.estado = 'aprobado';
    var response =  this.apiService.put(`http://localhost:${this.apiService.PORT}/api/Inscripciones/${this.actualAfiliation.id}`, this.actualAfiliation);
    response.subscribe(
      (value: any) => {
        this.loadAffiliations();
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
      });
   }

  deny() { 
    document.getElementById('optionMsj').style.setProperty('display', 'none');
    console.log('Rechazando inscripcion');
    this.actualAfiliation.estado = 'denegado';
    var response =  this.apiService.put(`http://localhost:${this.apiService.PORT}/api/Inscripciones/${this.actualAfiliation.id}`, this.actualAfiliation);
    response.subscribe(
      (value: any) => {
        this.loadAffiliations();
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
      });
  }

    /**
   * Metodo para mostrar al usuario un modal para tomar una decision de si o no
   */
  askUser() {
    if (this.actualAfiliation.estado == 'aprobado' || this.actualAfiliation.estado == 'denegado') {
      this.utilsService.showInfoModal("Error", "La solicitud ya ha sido verificada", "saveMsjLabel", "msjText", 'saveMsj');
      return;
    }
    this.utilsService.showInfoModal('Eliminar', 'Esta seguro que desea rechazar la solicitud de inscripción',
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
