import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service'
import { ApiService } from 'src/app/services/api.service'
import { Router } from '@angular/router';
import { Race } from '../models/race';

@Component({
  selector: 'app-race-signup',
  templateUrl: './race-signup.component.html',
  styleUrls: ['./race-signup.component.css']
})
export class RaceSignupComponent implements OnInit {

  carreras = [
    // new Race(0, 0, 0, "Vuelta ciclistica en Varablanca", "2021-06-02", 6000),
    // new Race(0, 0, 0, "Caminata en Cataratas la Paz", "2021-02-16", 3000)
  ];

  constructor(private utilsService:UtilsService, private apiService: ApiService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadRaces();
  }

  async loadRaces() {
    var response = this.apiService.get(`http://127.0.0.1:${this.apiService.PORT}/api/Carreras`);
    response.subscribe((value: Race[]) => {
      console.log(value);
      this.carreras = value;
    });
  }

}
