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

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    let carreraId = this.route.snapshot.params.id;

    console.log(carreraId);
    this.loadRaceInfo(carreraId);
  }

  loadRaceInfo(id: number) {
    var response = this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Carreras/${id}`);
    response.subscribe((info: Race) => {
      console.log(info);
    })
  }

}
