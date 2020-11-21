import { Component, OnInit } from '@angular/core';
import { Reto } from '../models/reto';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-detalle-reto',
  templateUrl: './detalle-reto.component.html',
  styleUrls: ['./detalle-reto.component.css']
})
export class DetalleRetoComponent implements OnInit {

  reto: Reto;
  idReto = window.localStorage.getItem('id-evento');

  constructor(private apiService: ApiService, private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.idReto = '3';
    this.loadRetoInfo();
  }

  loadRetoInfo() {
    console.log("Obteniendo reto");
    const response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Reto/${this.idReto}`)
    response.subscribe(
      (value: Reto) => {
        console.log(value);
        this.loadDiasRestantes(value.fin);
        value.inicio = this.utilsService.parseDate(value.inicio);
        value.fin = this.utilsService.parseDate(value.fin);
        this.reto = value;
        this.loadExtraInfo();
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
      });
  }

  loadDiasRestantes(fin: string) {
    var finDate = new Date(fin);
    var today = new Date();
    var diff = Math.abs(today.getTime() - finDate.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    if (diffDays < 1) {
      document.getElementById('diasRestantes').innerText = '0';
    } else {
      document.getElementById('diasRestantes').innerText = diffDays.toString();
    }
  }

  loadExtraInfo() {
    this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/tipo/${this.reto.idTipoActividad}`)
      .subscribe((info: any) => {
        document.getElementById('tipoActividad').innerText = info.nombre;
    });
    
    this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/patrocinadores/${this.reto.id}`)
      .subscribe((info: any) => {
        var container = document.getElementById('patrocinadores-container');
        this.createPatrocinador(container, info);
      });

      this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/retos/${this.reto.idTipoReto}`)
        .subscribe((info: any) => {
          document.getElementById('tipoReto').innerText = info.nombre;
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
