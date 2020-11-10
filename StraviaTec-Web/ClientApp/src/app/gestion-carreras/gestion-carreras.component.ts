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
  carreras = [];


  constructor(private utilsService: UtilsService, private apiService:ApiService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadCarreras();
  }
   loadRuta(event:any) {
    (document.getElementById('recorrido') as HTMLInputElement).setAttribute('hidden', 'true');
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        let ruta = reader.result;
        console.log(reader.result);
        return ruta;
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }
  }

  loadCarreras() {
    console.log('Obteniendo todas las carreras');
    console.log('\n');
    const response = this.apiService.get(`https://localhost:${this.apiService.PORT}/api/Carrera`)
    response.subscribe(
      (value: Carrera[]) => {
        console.log('Carreras ' + value);
        this.carreras = value;
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
      });
  }

  saveCarrera() {
    const nombre = (document.getElementById('name') as HTMLInputElement);
    const actividad = (document.getElementById('actividad') as HTMLInputElement);
    const categoria = (document.getElementById('categoria') as HTMLInputElement);
    const fecha = (document.getElementById('fecha') as HTMLInputElement);
    const patrocinador = (document.getElementById('patrocinador') as HTMLInputElement);
    const costo = (document.getElementById('costo') as HTMLInputElement);
    const cuentas = (document.getElementById('cuentaB') as HTMLInputElement);
    const recorrido = (document.getElementById('recorrido') as HTMLInputElement);

    if (nombre.value == '' || actividad.value == null || categoria.value == '' || fecha.value == '' || patrocinador.value == '' || 
      costo.value == '' || cuentas.value == '' || recorrido.value == '') {
        this.utilsService.showInfoModal('Error', 'Por favor complete todos los campos.', 'saveMsjLabel', 'msjText', 'saveMsj');
        return;
    } 

    const carrera = new Carrera(nombre.value, actividad.valueAsNumber , fecha.value, cuentas.value, categoria.valueAsNumber,
      patrocinador.valueAsNumber, costo.valueAsNumber, recorrido.value);
  
    this.createCarrera(carrera);

  }
  createCarrera(carrera: Carrera) {
    var response = this.apiService.post(`https://localhost:${this.apiService.PORT}/api/Carrera`,carrera);
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
     /**
   * Metodo para cerrar un modal
   * @param id Id del modal a cerrar
   */
  closeModal(id: string): void {
    document.getElementById(id).style.setProperty('display', 'none');
    if (this.created) {
      this.router.navigate(['']);
    }
  }
}
  