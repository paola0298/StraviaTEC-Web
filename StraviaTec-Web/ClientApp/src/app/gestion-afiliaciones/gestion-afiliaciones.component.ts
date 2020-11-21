import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-gestion-afiliaciones',
  templateUrl: './gestion-afiliaciones.component.html',
  styleUrls: ['./gestion-afiliaciones.component.css']
})
export class GestionAfiliacionesComponent implements OnInit {


  constructor(private ApiService: ApiService,
    private utilsService: UtilsService) { }

  ngOnInit(): void {
    //this.queryInscripciones();
    this.utilsService.configureContextMenu();
  }

  
 
}
