import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evento } from '../models/evento';

@Component({
  selector: 'app-evento-inscrito',
  templateUrl: './evento-inscrito.component.html',
  styleUrls: ['./evento-inscrito.component.css']
})
export class EventoInscritoComponent implements OnInit {

  eventos: Evento[] = [];
  user = localStorage.getItem('userId');

  constructor(private router: Router) { }

  ngOnInit(): void {
    var e = new Evento();
    e.nombre = "Evento1",
    e.tipoEvento = "Reto";
    this.eventos.push(e);
    console.log(this.eventos.length);
  }

  details(tipoEvento: string, id: number) {
    if (tipoEvento == "Reto") {
      this.router.navigate(['detalle-reto']);
      window.localStorage.setItem("id-evento", id.toString());
      return;
    }

    // this.router.navigate(['detalle-carrera']);
  }

  loadRetos() {

  }

}
