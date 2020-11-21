import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Carrera } from '../models/carrera';
import { Evento } from '../models/evento';
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
  user = localStorage.getItem('userId');

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    // var e = new Evento();
    // e.nombre = "Evento1",
    // e.tipoEvento = "Reto";
    // this.eventos.push(e);
    // console.log(this.eventos.length);
    this.loadRetos();
  }

  detailsReto(reto: Reto) {
    window.localStorage.setItem("id-evento", reto.id.toString());
    this.router.navigate(['detalle-reto']);
  }

  detailsCarrera(carrera: Carrera) {

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

}
