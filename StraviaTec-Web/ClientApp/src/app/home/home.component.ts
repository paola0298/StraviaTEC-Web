import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})
export class HomeComponent {

  setUserType(athlete:boolean) {
    if (athlete) {
      window.localStorage.setItem('userType', 'athlete');
    } else {
      window.localStorage.setItem('userType', 'organizer');
    }
  }
}
