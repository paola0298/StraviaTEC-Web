import { Component, OnInit } from '@angular/core';
import { Reto } from '../models/reto';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-detalle-reto',
  templateUrl: './detalle-reto.component.html',
  styleUrls: ['./detalle-reto.component.css']
})
export class DetalleRetoComponent implements OnInit {

  reto: Reto;
  idReto = window.localStorage.getItem('id-evento');

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  loadRetoInfo(id: number) {

  }

  loadExtraInfo() {
    this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/tipo/${this.reto.idActividad}`)
      .subscribe((info: any) => {
        document.getElementById('tipoActividad').innerText = info.nombre;
    });
    
    this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/patrocinadores/${this.reto.id}`)
      .subscribe((info: any) => {
        var container = document.getElementById('patrocinadores-container');
        this.createPatrocinador(container, info);
      });
  }
  

  createPatrocinador (container: any, items: any) {
    for (let i = 0; i < items.length; i++) {
      var item = document.createElement('li');
      item.classList.add("list-group-item");
      var img = document.createElement('img');
      img.src = items[i].logo;
      img.alt = "Logo " + items[i].nombreComercial;
      img.title = items[i].nombreComercial;
      img.style.setProperty('width', '100px');
      img.style.setProperty('heigth', 'auto');
      img.style.setProperty('padding', '10px 0');
      item.appendChild(img);

      var representante = document.createElement('p');
      representante.innerText = "Representante: " + items[i].nombreRepresentante + "\n" + "Teléfono: " + items[i].telRepresentante;;
      item.appendChild(representante);

      container.appendChild(item);
    }
  }

}
