import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { Reto } from '../models/reto';
import { Patrocinador } from '../models/patrocinador';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-retos-disponibles',
  templateUrl: './retos-disponibles.component.html',
  styleUrls: ['./retos-disponibles.component.css'],
})
export class RetosDisponiblesComponent implements OnInit {
  // TODO Obtener retos reales esperar a que esté listo backend, descomentar código cuando esto pase
  retos: Reto[];
  userId = window.localStorage.getItem('userId');

  // patrocinadores = [
  //   new Patrocinador(
  //     3,
  //     'Visa',
  //     'Representante Visa',
  //     '12345678',
  //     'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F0%2F04%2FVisa.svg%2F1200px-Visa.svg.png&f=1&nofb=1'
  //   ),
  // ];

  // retos = [
  //   new Reto(1,'Reto 1','20 Diciembre','31 Diciembre',5000,1,4,this.patrocinadores,[],true),
  //   new Reto(2,'Reto 2','10 Enero','20 Enero',2500,2,6,this.patrocinadores,[],true),
  // ];

  constructor(private utilsService: UtilsService, private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadChallenges();
  }

  async loadChallenges() {
    console.log('current user: ' + this.userId);
    const response = this.apiService.get(`http://127.0.0.1:${this.apiService.PORT}/api/Reto/user/${this.userId}`
    );
    response.subscribe((value: Reto[]) => {
      console.log(value);
      this.retos = value;
      this.formatDate();
    }, (error:any) => {
      console.log(error.statusText);
      console.log(error.status);
      console.log(error);
    });
  }
  formatDate() {
    this.retos.forEach(reto => {
      reto.inicio = this.utilsService.parseDate(reto.inicio);
      reto.fin = this.utilsService.parseDate(reto.fin);
    })
  }
}
