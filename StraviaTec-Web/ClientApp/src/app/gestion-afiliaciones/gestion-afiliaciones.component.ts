import { Component, OnInit } from '@angular/core';
import { InscripcionEvento } from '../models/inscripcionEvento';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-gestion-afiliaciones',
  templateUrl: './gestion-afiliaciones.component.html',
  styleUrls: ['./gestion-afiliaciones.component.css']
})
export class GestionAfiliacionesComponent implements OnInit {

  affiliations: InscripcionEvento[];
  actualAfiliation: InscripcionEvento;

  constructor(private utilsService: UtilsService, private apiService:ApiService) { }

  ngOnInit(): void {
    this.loadAffiliations();
  }

  loadAffiliations() {
    var response =  this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Inscripciones`);
    response.subscribe(
      (value: InscripcionEvento[]) => {
        this.affiliations = value;
        console.log(this.affiliations.length);
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
      });
  }

  /**
   *Metodo que se llama cuando se presiona click derecho en el item de la tabla
   * @param event Evento de click derecho
   * @param affiliation Afiliacion seleccionada
   */
  onAffiliationClick(event: any, affiliation: InscripcionEvento): boolean {
    this.utilsService.showContextMenu(event);
    this.getAffiliation(affiliation.id); // todo obtener la carrera seleccionada
    return false;
  }
  getAffiliation(id: number) { }

  accept() { }

  deny() { }

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
