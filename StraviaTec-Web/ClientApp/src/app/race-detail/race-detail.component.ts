import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { $ } from 'protractor';
import { Race } from '../models/race';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-race-detail',
  templateUrl: './race-detail.component.html',
  styleUrls: ['./race-detail.component.css']
})
export class RaceDetailComponent implements OnInit {

  carrera: Race;
  mapView;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    let carreraId = this.route.snapshot.params.id;

    this.carrera = new Race();

    console.log(carreraId);
    this.loadRaceInfo(carreraId);

    this.attachScripts();
  }

  loadRaceInfo(id: number) {
    var response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Carreras/${id}`);
    response.subscribe((info: Race) => {
      this.carrera = info;
      this.carrera.fecha = this.carrera.fecha.substring(0, this.carrera.fecha.indexOf("T"));
      console.log(this.carrera);

      this.loadExtraInfo();
    });
  }

  loadExtraInfo() {
    this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/tipo/${this.carrera.idTipoActividad}`)
      .subscribe((info: any) => {
        document.getElementById('tipoActividad').innerText = info.nombre;
    });
    
    this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/categorias/${this.carrera.id}`)
      .subscribe((info: any) => {
        var container = document.getElementById('categorias-container');
        this.createItems(container, info);
    });

    this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/cuentas/${this.carrera.id}`)
      .subscribe((info: any) => {
        var container = document.getElementById('cuentas-container');
        this.createItems(container, info);
    });
    this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/patrocinadores/${this.carrera.id}`)
      .subscribe((info: any) => {
        var container = document.getElementById('patrocinadores-container');
        console.log(info);
        this.createPatrocinador(container, info);
      });
  }

  createItems(container: any, items: any) {
    for (let i = 0; i < items.length; i++) {
      var item = document.createElement('li');
          item.classList.add("list-group-item");
          item.innerText = items[i].nombre;  
          container.appendChild(item);
    }
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

  attachScripts () {
    let leafletCss = document.createElement('link');
    leafletCss.crossOrigin = '';
    leafletCss.rel = 'stylesheet';
    leafletCss.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    leafletCss.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';

    let leafletScript = document.createElement('script');
    leafletScript.crossOrigin = '';
    leafletScript.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    leafletScript.integrity = 'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==';

    document.head.appendChild(leafletCss);
    document.head.appendChild(leafletScript);

    this.loadMap();
  }

  loadMap () {
    let position = [51.5, -0.09];

    this.mapView = L.map('leaflet-map').setView(position, 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{styleId}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        username: 'marlon-x',
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        styleId: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibWFybG9uLXgiLCJhIjoiY2tndDA4cTluMTZsdzJxbWwwY3M2dWtkOCJ9.CIVI7T0k69vrVIcfIAAFUw'
    }).addTo(this.mapView);

    // this.userLocation = L.marker(position, {
    //     draggable: true,
    // }).addTo(this.mapView);
    // this.userLocation.bindPopup("Move the marker to the desired location")
    //     .openPopup();

    // this.userLocation.on('dragend', () => {
    //     this.mapView.panTo(this.userLocation.getLatLng());
    //     this.updateFields(this.userLocation.getLatLng());
    // });

    // this.mapView.on('click', (e) => {
    //     this.userLocation.setLatLng(e.latlng);
    //     this.mapView.panTo(e.latlng);
    //     this.updateFields(e.latlng);
    // });

    // this.updateFields(this.userLocation.getLatLng());
  }

  onInscribirse() {
    console.log("Inscribiendose...");
  }

}
