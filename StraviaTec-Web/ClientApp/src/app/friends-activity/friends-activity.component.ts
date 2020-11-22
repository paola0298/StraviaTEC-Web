import { Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-friends-activity',
  templateUrl: './friends-activity.component.html',
  styleUrls: ['./friends-activity.component.css']
})
export class FriendsActivityComponent implements OnInit {

  mapView: Leaflet.Map;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadMap();
    this.loadRoute(2);
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

}
