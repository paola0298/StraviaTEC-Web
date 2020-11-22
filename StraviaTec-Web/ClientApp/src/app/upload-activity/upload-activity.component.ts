import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-upload-activity',
  templateUrl: './upload-activity.component.html',
  styleUrls: ['./upload-activity.component.css']
})
export class UploadActivityComponent implements OnInit {
  nombre: HTMLInputElement;
  fecha: HTMLInputElement;
  hora: HTMLInputElement;
  kilometraje: HTMLInputElement;
  duracion: HTMLInputElement;
  recorrido: HTMLInputElement;
  recorridoData: string;
  tipoActividad: HTMLSelectElement;
  tipoEvento: HTMLSelectElement;
  carreras: HTMLSelectElement;
  retos: HTMLSelectElement;
  esEvento: boolean = false;
  idUsuario: string;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.idUsuario = window.localStorage.getItem('userId');
    console.log(this.idUsuario);

    this.nombre = document.getElementById('nombre') as HTMLInputElement;
    this.fecha = document.getElementById('fecha') as HTMLInputElement;
    this.hora = document.getElementById('hora') as HTMLInputElement;
    this.kilometraje = document.getElementById('kilometraje') as HTMLInputElement;
    this.duracion = document.getElementById('duracion') as HTMLInputElement;
    this.recorrido = document.getElementById('recorrido') as HTMLInputElement;
    this.tipoActividad = document.getElementById('tipo-actividad') as HTMLSelectElement;
    this.tipoEvento = document.getElementById('evento') as HTMLSelectElement;
    this.carreras = document.getElementById('carreras') as HTMLSelectElement;
    this.retos = document.getElementById('retos') as HTMLSelectElement;

    let today = new Date();
    this.fecha.valueAsDate = today;
    let hours = today.getHours();
    let mins = today.getMinutes();
    this.hora.value = (hours < 10 ? '0' + hours : hours) + ":" + (mins < 10 ? '0' + mins : mins);

    this.loadTiposActividad();
  }

  loadTiposActividad() {
    this.apiService.get(`http://localhost:${this.apiService.PORT}/api/InfoEvento/tipos`)
      .subscribe((data: any[]) => {
        for (let i = 0; i < data.length; i++) {
          this.tipoActividad.appendChild(new Option(data[i].nombre, data[i].id));
        }
      });
  }

  recorridoChanged(event: Event) {
    let self = this;
    let file = this.recorrido.files[0];
    let reader = new FileReader();
    reader.onload = (data) => {
      console.log("File read");
      self.recorridoData = data.target.result.toString();
    };
    reader.readAsDataURL(file);
  }

  addActividad(event: Event) {
    console.log('Saving...')

    var data = {
      User: window.localStorage.getItem("userId"),
      Nombre: this.nombre.value,
      Fecha: this.fecha.value,
      Hora: this.hora.value,
      Kilometros: this.kilometraje.value,
      Duracion: this.duracion.value,
      Recorrido: this.recorridoData,
      IdTipoActividad: this.tipoActividad.value,
      EsEvento: this.esEvento.toString()
    };

    if (!this.checkData()) {
      console.log(data);
      this.showError("Debes completar todos los campos");
      return;
    }

    if (this.esEvento) {
      data['TipoEvento'] = this.tipoEvento.value;

      if (this.tipoEvento.value === "reto") {
        if (this.retos.value == "")
          this.showError("Debes seleccionar un reto");
        data['IdEvento'] = this.retos.value;
      } else if (this.tipoEvento.value === "carrera") {
        if (this.carreras.value == "")
          this.showError("Debes seleccionar una carrera");
        data['IdEvento'] = this.carreras.value;
      } else {
        //Show error
        this.showError("Debes seleccionar un tipo de evento");
      }
    }
    
    console.log(data);

    //TODO: enviar información al backend
    this.apiService.post(`http://localhost:${this.apiService.PORT}/api/Actividades`, data)
      .subscribe((data) => {
        // @ts-ignore
        jQuery('#successModal').modal();
      });
  }

  loadRetosInscritos() {
    var user = window.localStorage.getItem("userId");
    var retos = document.getElementById('reto-select');
    this.apiService.get(`http://localhost:${this.apiService.PORT}/api/Reto/inscritos/${user}`)
      .subscribe((data: any[]) => {
        for (let i = 0; i < data.length; i++) {
          var item = data[i];
          retos.appendChild(new Option(item.nombre, item.idEvento));
        }
      });
  }

  checkData() {
    return (
      this.fecha.value != "" && 
      this.hora.value != "" &&
      this.kilometraje.value != "" &&
      this.duracion.value != "" &&
      this.recorrido.value != "" &&
      this.tipoActividad.value != ""
    );
  }

  showError(msg: string) {
    let lbl = document.getElementById('error-msg');
    lbl.innerText = msg;

    // @ts-ignore
    jQuery('#errorModal').modal();
  }

  esEventoChanged(event: Event) {
    this.esEvento = JSON.parse((event.target as HTMLInputElement).value);
    
    let eventoContainer = document.getElementById('evento-select');
    eventoContainer.style.setProperty('display', this.esEvento ? 'flex': 'none');
  }

  onEventoTypeChange(event: Event) {
    var type = (event.target as HTMLSelectElement).value

    let carreras = document.getElementById('carrera-select');
    let retos = document.getElementById('reto-select');

    if (type === "carrera") {
      carreras.style.setProperty('display', 'block');
      retos.style.setProperty('display', 'none');
    } else if (type === "reto") {
      carreras.style.setProperty('display', 'none');
      retos.style.setProperty('display', 'block');
    } else {
      carreras.style.setProperty('display', 'none');
      retos.style.setProperty('display', 'none');
    }
  }
}
