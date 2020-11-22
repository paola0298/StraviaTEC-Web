import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Carrera } from '../models/carrera';
import { Evento } from '../models/evento';
import { Race } from '../models/race';
import { Reto } from '../models/reto';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-evento-inscrito',
  templateUrl: './evento-inscrito.component.html',
  styleUrls: ['./evento-inscrito.component.css']
})
export class EventoInscritoComponent implements OnInit {

  eventos: Evento[] = [];
  retos: Reto[];
  carreras: Race[];
  user = localStorage.getItem('userId');

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    // var e = new Evento();
    // e.nombre = "Evento1",
    // e.tipoEvento = "Reto";
    // this.eventos.push(e);
    // console.log(this.eventos.length);
    this.loadRetos();
    this.loadRaces();
  }

  detailsReto(reto: Reto) {
    window.localStorage.setItem('id-evento', reto.id.toString());
    this.router.navigate(['detalle-reto']);
  }

  detailsCarrera(carrera: Race) {
    window.localStorage.setItem('id-evento', carrera.id.toString());
    this.router.navigate(['detalle-carrera']);
  }

  loadRetos() {
    const response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Reto/inscritos/${this.user}`);
    response.subscribe(
      (value: any) => {
        console.log(value);
        this.retos = value;
        this.loadExtraInfo();
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
      });

  }

  async loadRaces() {
    const userId = window.localStorage.getItem('userId');
    console.log('current user: ' + userId);
    // TODO CAMBIAR PARA OBTENER LA INFO CORRECTA CUANDO ESTE EL BACKEND
    const response = this.apiService.get(`http://127.0.0.1:${this.apiService.PORT}/api/Carreras/user/${userId}`);
    response.subscribe((value: Race[]) => {
      console.log(value);
      this.carreras = value;
      this.loadExtraInfoCarrera();
    });
  }

  loadExtraInfo() {
    this.retos.forEach(reto => {
      this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/tipo/${reto.idTipoActividad}`)
      .subscribe((info: any) => {
        reto.nombreActividad = info.nombre;
      });

      this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/retos/${reto.idTipoReto}`)
      .subscribe((info: any) => {
        reto.nombreTipoReto = info.nombre;
      });
    });
  }

  loadExtraInfoCarrera() {
    this.carreras.forEach(carrera => {
      this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/tipo/${carrera.idTipoActividad}`)
      .subscribe((info: any) => {
        console.log(info);
        carrera.nombreTipoActividad = info.nombre;
      });
    });
  }
}
