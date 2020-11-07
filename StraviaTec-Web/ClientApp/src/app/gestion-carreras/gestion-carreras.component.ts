import { Component, OnInit } from '@angular/core';
import { Carrera} from '../models/carrera';
import { UtilsService } from '../services/utils.service';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { Patrocinador } from '../models/patrocinador';


@Component({
  selector: 'app-gestion-carreras',
  templateUrl: './gestion-carreras.component.html',
  styleUrls: ['./gestion-carreras.component.css']
})
export class GestionCarrerasComponent implements OnInit {
  localUrl: any[];
  created:boolean = false;

  constructor(private utilsService: UtilsService, private apiService:ApiService,
    private router: Router) { }

  ngOnInit(): void {
    
  }
  loadRuta(event:any) {
    (document.getElementById('recorrido') as HTMLInputElement).setAttribute('hidden', 'true');
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        //me.modelvalue = reader.result;
        console.log(reader.result);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    } 
  }
 
}
