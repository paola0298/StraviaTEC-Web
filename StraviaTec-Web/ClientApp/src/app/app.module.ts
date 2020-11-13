import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { RegisterAthleteComponent } from './register-athlete/register-athlete.component';
import { ProfileAthleteComponent } from './profile-athlete/profile-athlete.component';
import { LoginDeportistasComponent } from './login-deportistas/login-deportistas.component';
import { MenuOrganizadorComponent } from './menu-organizador/menu-organizador.component';
import { GestionCarrerasComponent } from './gestion-carreras/gestion-carreras.component';
import { AddFriendComponent } from './add-friend/add-friend.component';
//import { RaceSignupComponent } from './race-signup/race-signup.component';
//import { AthleteMenuComponent } from './athlete-menu/athlete-menu.component';
import { GestionPatrocinadoresComponent } from './gestion-patrocinadores/gestion-patrocinadores.component';
import { GestionGruposComponent } from './gestion-grupos/gestion-grupos.component';
import { GestionAfiliacionesComponent } from './gestion-afiliaciones/gestion-afiliaciones.component';
import { RaceSignupComponent } from './race-signup/race-signup.component';
import { AthleteMenuComponent } from './athlete-menu/athlete-menu.component';
import { RaceDetailComponent } from './race-detail/race-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    RegisterAthleteComponent,
    ProfileAthleteComponent,
    LoginDeportistasComponent,
    MenuOrganizadorComponent,
    GestionCarrerasComponent,
    AddFriendComponent,
  //  RaceSignupComponent,
  //  AthleteMenuComponent
    GestionPatrocinadoresComponent,
    RaceSignupComponent,
    AthleteMenuComponent,
    RaceDetailComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'register-user', component: RegisterAthleteComponent },
      { path: 'profile', component: ProfileAthleteComponent },
      { path: 'login-deportista', component: LoginDeportistasComponent },
      { path: 'menu-organizador', component: MenuOrganizadorComponent },
      { path: 'gestion-carreras', component: GestionCarrerasComponent },
      { path: 'add-friend', component: AddFriendComponent },
   //   { path: 'race-signup', component: RaceSignupComponent},
   //   { path: 'athlete-menu', component: AthleteMenuComponent},
      { path: 'gestion-grupos', component: GestionGruposComponent },
      { path: 'gestion-afiliaciones', component: GestionAfiliacionesComponent },
      { path: 'gestion-patrocinadores', component: GestionPatrocinadoresComponent },
      { path: 'race-signup', component: RaceSignupComponent},
      { path: 'athlete-menu', component: AthleteMenuComponent},
      { path: 'race-detail/:id', component: RaceDetailComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
