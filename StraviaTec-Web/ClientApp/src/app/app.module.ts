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
import { GestionPatrocinadoresComponent } from './gestion-patrocinadores/gestion-patrocinadores.component';
import { RaceSignupComponent } from './race-signup/race-signup.component';
import { AthleteMenuComponent } from './athlete-menu/athlete-menu.component';
import { RaceDetailComponent } from './race-detail/race-detail.component';
import { GestionRetosComponent } from './gestion-retos/gestion-retos.component';
import { AsociarseGrupoComponent } from './asociarse-grupo/asociarse-grupo.component';
import { UploadActivityComponent } from './upload-activity/upload-activity.component';
import { DetalleRetoComponent } from './detalle-reto/detalle-reto.component';
import { EventoInscritoComponent } from './evento-inscrito/evento-inscrito.component';
import { GestionGruposComponent } from './gestion-grupos/gestion-grupos.component';
import { AffiliationsComponent } from './affiliations/affiliations.component';

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
    GestionPatrocinadoresComponent,
    RaceSignupComponent,
    AthleteMenuComponent,
    RaceDetailComponent,
    GestionRetosComponent,
    AsociarseGrupoComponent,
    UploadActivityComponent,
    DetalleRetoComponent,
    EventoInscritoComponent,
    GestionGruposComponent,
    AffiliationsComponent,
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
      { path: 'gestion-patrocinadores', component: GestionPatrocinadoresComponent },
      { path: 'race-signup', component: RaceSignupComponent},
      { path: 'athlete-menu', component: AthleteMenuComponent},
      { path: 'race-detail/:id', component: RaceDetailComponent },
      { path: 'gestion-retos', component: GestionRetosComponent},
      { path: 'asociarse-grupo', component: AsociarseGrupoComponent},
      { path: 'upload-activity', component: UploadActivityComponent },
      { path: 'detalle-reto', component: DetalleRetoComponent},
      { path: 'evento-inscrito', component: EventoInscritoComponent},
      { path: 'gestion-grupos', component: GestionGruposComponent },
      { path: 'affiliations', component: AffiliationsComponent},
      
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
