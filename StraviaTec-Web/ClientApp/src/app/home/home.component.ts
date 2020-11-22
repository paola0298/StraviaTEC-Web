import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})
export class HomeComponent {

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkIfUserLoggedIn();
    // window.localStorage.setItem('userId', id);

  }

  checkIfUserLoggedIn() {
    console.log("Checking user status..");

    var userId = window.localStorage.getItem('userId');
    if (userId == null) {
      console.log("Not logged in...");
      return;
    }

    var userType = window.localStorage.getItem('userType');

    if (userType == null) {
      console.log('No user type...')
      return;
    }

    if (userType == 'athlete') {
      this.router.navigate(['friends-activity']);
    } else if (userType == 'organizer') {
      this.router.navigate(['menu-organizador']);
    }
  }

  setUserType(athlete:boolean) {
    if (athlete) {
      window.localStorage.setItem('userType', 'athlete');
    } else {
      window.localStorage.setItem('userType', 'organizer');
    }
  }
}
