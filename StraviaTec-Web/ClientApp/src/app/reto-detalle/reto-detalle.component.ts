import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Patrocinador } from '../models/patrocinador';
import { Reto } from '../models/reto';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-reto-detalle',
  templateUrl: './reto-detalle.component.html',
  styleUrls: ['./reto-detalle.component.css'],
})
export class RetoDetalleComponent implements OnInit {
  // TODO Obtener retos reales esperar a que esté listo backend, descomentar código cuando esto pase
  // reto: Reto;

  patrocinadores = [
    new Patrocinador(
      3,
      'Visa',
      'Representante Visa',
      '12345678',
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F0%2F04%2FVisa.svg%2F1200px-Visa.svg.png&f=1&nofb=1'
    ),
  ];

  reto: Reto = new Reto(
    1,
    'Reto 1',
    '20 Diciembre',
    '31 Diciembre',
    5000,
    1,
    4,
    this.patrocinadores,
    [],
    true
  );

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const retoId = this.route.snapshot.params.id;
    this.loadChallengeInfo(retoId);
  }

  loadChallengeInfo(id: number) {
    /* const response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Reto/${id}`);
    response.subscribe((info: Reto) => {
      this.reto = info;
      this.reto.inicio = this.reto.inicio.substring(0, this.reto.inicio.indexOf("T"));
      this.reto.fin = this.reto.fin.substring(0, this.reto.fin.indexOf("T"));
      console.log(this.reto);
    }); */
    this.loadExtraInfo();
  }

  loadExtraInfo() {
    this.apiService
      .get(
        `http://localhost:${this.apiService.PORT}/api/InfoEvento/tipo/${this.reto.idActividad}`
      )
      .subscribe((info: any) => {
        document.getElementById('tipoActividad').innerText = info.nombre;
      });

    this.apiService
      .get(
        `http://localhost:${this.apiService.PORT}/api/InfoEvento/patrocinadores/${this.reto.id}`
      )
      .subscribe((info: any) => {
        const container = document.getElementById('patrocinadores-container');
        this.createPatrocinador(container, info);
      });

    this.apiService
      .get(
        `http://localhost:${this.apiService.PORT}/api/InfoEvento/retos/${this.reto.idTipoReto}`
      )
      .subscribe((info: any) => {
        document.getElementById('tipoReto').innerText = info.nombre;
      });
  }

  createPatrocinador(container: any, items: any) {
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
      representante.innerText =
        'Representante: ' +
        items[i].nombreRepresentante +
        '\n' +
        'Teléfono: ' +
        items[i].telRepresentante;
      item.appendChild(representante);

      container.appendChild(item);
    }
  }

  async onInscribirse() {
    console.log('Inscribiendose...');
    const indicator = document.getElementById('loading-indicator');
    indicator.style.setProperty('display', 'inline-block');

    const data = {
      User: window.localStorage.getItem('userId'),
      IdReto: this.reto.id,
    };

    this.apiService
      .post(
        `http://localhost:${this.apiService.PORT}/api/Reto/inscripcion`,
        data
      )
      .subscribe(() => {
        const button = document.getElementById(
          'inscribirseButton'
        ) as HTMLButtonElement;
        button.disabled = true;
        document.getElementById('closeButton').click();
        this.router.navigate(['athlete-menu']);
      });
  }
}
