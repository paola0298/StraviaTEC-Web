import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Race } from '../models/race';
import { ApiService } from '../services/api.service';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-race-detail',
  templateUrl: './race-detail.component.html',
  styleUrls: ['./race-detail.component.css']
})
export class RaceDetailComponent implements OnInit, OnDestroy {

  carrera: Race;
  mapView: Leaflet.Map;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    let carreraId = this.route.snapshot.params.id;

    this.carrera = new Race();

    console.log(carreraId);
    this.loadRaceInfo(carreraId);

    this.loadMap();

    this.loadRoute(carreraId);
  }

  ngOnDestroy(): void {
    this.mapView.remove();
  }

  loadMap() {
    let position = new Leaflet.LatLng(51.5, -0.09);
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
    var durLabel = document.getElementById('duration'); 
    
    if (duration < 60) {
      durLabel.innerText = duration.toFixed(0) + "m"
      return;
    }

    var hours = Math.floor((duration / 60));
    var minutes = duration - (hours * 60);
    durLabel.innerText = `${hours}h ${minutes.toFixed(0)}m`;
  }

  loadRoute(carreraId) {
    this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Recorridos/${carreraId}`)
      .subscribe((data: any) => {

        var points =data.points;

        if (points == null || points.length == 0)
          return;

        document.getElementById('distance').innerText = data.km.toFixed(2) + " km";

        this.showDuration(data.duration);

        points.sort((p1, p2) => {
          if (p1.orden == p2.orden) {
            return 0;
          } else if (p1.orden < p2.orden) {
            return -1;
          } else {
            return 1;
          }
        })

        var pointsCount = points.length;

        var puntoInicial = points[0];
        var puntoFinal = points[pointsCount - 1];

        var segmentoActual = puntoInicial.segmento;
        var polyline = Leaflet.polyline([Leaflet.latLng(puntoInicial.lat, puntoInicial.lng)], {
          color: '#FC6203'
        });

        var maxLat = -1000;
        var maxLng = -1000;
        var minLat = 1000;
        var minLng = 1000;

        for (let i = 1; i < pointsCount; i++) {
          var punto = points[i];

          var lat = punto.lat;
          var lng = punto.lng;

          var latLng = Leaflet.latLng(lat, lng);

          if (punto.segmento == segmentoActual) {
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

        var centerLat = minLat + (maxLat - minLat) / 2;
        var centerLng = minLng + (maxLng - minLng) / 2;

        var bounds = polyline.getBounds()

        this.mapView.fitBounds(bounds);
        // this.mapView.setView(Leaflet.latLng(centerLat, centerLng), 12);
      });
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

  computeDistanceInKm(lat1: number, lng1: number, lat2: number, lng2: number) {
    var earthRadiusInKm = 6371;
    var degreeLat = this.degToRad(lat2 - lat1);
    var degreeLng = this.degToRad(lng2 - lng1);
    var lat1 = this.degToRad(lat1);
    var lat2 = this.degToRad(lat2);

    var a1 = Math.sin(degreeLat / 2);
    var b1 = Math.sin(degreeLng / 2);
    var a = a1 * a1 + b1 * b1 * Math.cos(lat1) * Math.cos(lat2);
    var b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var c = earthRadiusInKm * b;
    return c;
  }

  degToRad(deg: number) {
    return deg * (Math.PI / 180);
  }

  async fileToBase64(file: File): Promise<string> {
    console.log("Converting file...");

    if (file == null)
      return null;

    var reader = new FileReader();

    var promise = new Promise<string>((complete) => {
      reader.onload = (event: any) => {
        complete(event.target.result);
      }
      reader.readAsDataURL(file);
    });

    return promise;
  }

  async onInscribirse() {
    console.log("Inscribiendose...");
    var indicator = document.getElementById('loading-indicator');
    indicator.style.setProperty('display', 'inline-block');

    var comprobante = (document.getElementById('comprobante-pago') as HTMLInputElement).files[0];
    
    if (comprobante == null)
      return;
    
    var data = {
      User: window.localStorage.getItem('userId'),
      IdCarrera: this.carrera.id,
      ComprobantePago: await this.fileToBase64(comprobante)
    }

    this.apiService.post(`http://localhost:${this.apiService.PORT}/api/Carreras/inscripcion`, data)
      .subscribe(() => {
        var button = document.getElementById('inscribirseButton') as HTMLButtonElement;
        button.innerText = "Inscripción pendiente";
        button.disabled = true;

        document.getElementById('closeButton').click();
      });
  }

}
