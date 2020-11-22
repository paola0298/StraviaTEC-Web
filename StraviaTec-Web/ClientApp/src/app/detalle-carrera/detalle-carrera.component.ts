import { Component, OnInit } from '@angular/core';
import { Race } from '../models/race';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-detalle-carrera',
  templateUrl: './detalle-carrera.component.html',
  styleUrls: ['./detalle-carrera.component.css']
})
export class DetalleCarreraComponent implements OnInit {

  carrera: Race;
  idCarrera = window.localStorage.getItem('id-evento');
  mapView: Leaflet.Map;

  constructor(private apiService: ApiService, private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.loadCarreraInfo();
    this.loadMap();

    this.loadRoute(this.idCarrera);
  }

  ngOnDestroy(): void {
    this.mapView.remove();
  }

  loadMap() {
    const position = new Leaflet.LatLng(51.5, -0.09);
    this.mapView = new Leaflet.Map('leaflet-map');
    Leaflet.tileLayer('https://api.mapbox.com/styles/v1/{styleId}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      accessToken: 'pk.eyJ1IjoibWFybG9uLXgiLCJhIjoiY2tndDA4cTluMTZsdzJxbWwwY3M2dWtkOCJ9.CIVI7T0k69vrVIcfIAAFUw',
      tileSize: 512,
      zoomOffset: -1,
      // @ts-ignore
      styleId: 'mapbox/streets-v11'
    }).addTo(this.mapView);
  }

  showDuration(duration: number) {
    const durLabel = document.getElementById('duration');

    if (duration < 60) {
      durLabel.innerText = duration.toFixed(0) + 'm';
      return;
    }

    const hours = Math.floor((duration / 60));
    const minutes = duration - (hours * 60);
    durLabel.innerText = `${hours}h ${minutes.toFixed(0)}m`;
  }

  loadRoute(carreraId) {
    this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Recorridos/${carreraId}`)
      .subscribe((data: any) => {

        const points = data.points;

        if (points == null || points.length === 0) {
          return;
        }

        document.getElementById('distance').innerText = data.km.toFixed(2) + ' km';

        this.showDuration(data.duration);

        points.sort((p1, p2) => {
          if (p1.orden === p2.orden) {
            return 0;
          } else if (p1.orden < p2.orden) {
            return -1;
          } else {
            return 1;
          }
        });

        const pointsCount = points.length;

        const puntoInicial = points[0];
        const puntoFinal = points[pointsCount - 1];

        let segmentoActual = puntoInicial.segmento;
        let polyline = Leaflet.polyline([Leaflet.latLng(puntoInicial.lat, puntoInicial.lng)], {
          color: '#FC6203'
        });

        let maxLat = -1000;
        let maxLng = -1000;
        let minLat = 1000;
        let minLng = 1000;

        for (let i = 1; i < pointsCount; i++) {
          const punto = points[i];

          const lat = punto.lat;
          const lng = punto.lng;

          const latLng = Leaflet.latLng(lat, lng);

          if (punto.segmento === segmentoActual) {
            polyline.addLatLng(latLng);

            if (lat > maxLat) {
              maxLat = lat;
            } else if (lat < minLat) {
              minLat = lat;
            }

            if (lng > maxLng) {
              maxLng = lng;
            } else if (lng < minLng) {
              minLng = lng;
            }

            continue;
          }

          segmentoActual = punto.segmento;
          polyline.addTo(this.mapView);
          polyline = Leaflet.polyline([latLng], {
            color: '#FC6203'
          });

          if (lat > maxLat) {
            maxLat = lat;
          } else if (lat < minLat) {
            minLat = lat;
          }

          if (lng > maxLng) {
            maxLng = lng;
          } else if (lng < minLng) {
            minLng = lng;
          }
        }

        polyline.addTo(this.mapView);

        const centerLat = minLat + (maxLat - minLat) / 2;
        const centerLng = minLng + (maxLng - minLng) / 2;

        const bounds = polyline.getBounds();

        this.mapView.fitBounds(bounds);
        // this.mapView.setView(Leaflet.latLng(centerLat, centerLng), 12);
      });
  }

  loadCarreraInfo() {
    console.log('Obteniendo carrera');
    const response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Carreras/${this.idCarrera}`);
    response.subscribe(
      (value: Race) => {
        console.log(value);
        value.fecha = this.utilsService.parseDate(value.fecha);
        this.carrera = value;
        this.loadExtraInfo();
      }, (error: any) => {
        console.log(error.statusText);
        console.log(error.status);
        console.log(error);
      });
  }

  loadExtraInfo() {
    this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/tipo/${this.carrera.idTipoActividad}`)
      .subscribe((info: any) => {
        document.getElementById('tipoActividad').innerText = info.nombre;
    });

    this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/categorias/${this.carrera.id}`)
      .subscribe((info: any) => {
        const container = document.getElementById('categorias-container');
        this.createItems(container, info);

        const select = document.getElementById('categoria-usuario');
        for (let i = 0; i < info.length; i++) {
          const opt = info[i];
          select.appendChild(new Option(opt.nombre, opt.id));
        }
    });

    this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/patrocinadores/${this.carrera.id}`)
      .subscribe((info: any) => {
        const container = document.getElementById('patrocinadores-container');
        this.createPatrocinador(container, info);
      });
  }

  createItems(container: any, items: any) {
    for (let i = 0; i < items.length; i++) {
      const item = document.createElement('li');
          item.classList.add('list-group-item');
          item.innerText = items[i].nombre;
          container.appendChild(item);
    }
  }

  createPatrocinador (container: any, items: any) {
    for (let i = 0; i < items.length; i++) {
      const item = document.createElement('li');
      item.classList.add('list-group-item');
      const img = document.createElement('img');
      img.src = items[i].logo;
      img.alt = 'Logo ' + items[i].nombreComercial;
      img.title = items[i].nombreComercial;
      img.style.setProperty('width', '100px');
      img.style.setProperty('heigth', 'auto');
      img.style.setProperty('padding', '10px 0');
      item.appendChild(img);

      const representante = document.createElement('p');
      representante.innerText = 'Representante: ' + items[i].nombreRepresentante + '\n' + 'Teléfono: ' + items[i].telRepresentante;
      item.appendChild(representante);

      container.appendChild(item);
    }
  }

  computeDistanceInKm(lat1: number, lng1: number, lat2: number, lng2: number) {
    const earthRadiusInKm = 6371;
    const degreeLat = this.degToRad(lat2 - lat1);
    const degreeLng = this.degToRad(lng2 - lng1);
    const lat1Rad = this.degToRad(lat1);
    const lat2Rad = this.degToRad(lat2);

    const a1 = Math.sin(degreeLat / 2);
    const b1 = Math.sin(degreeLng / 2);
    const a = a1 * a1 + b1 * b1 * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    const b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const c = earthRadiusInKm * b;
    return c;
  }

  degToRad(deg: number) {
    return deg * (Math.PI / 180);
  }


}

