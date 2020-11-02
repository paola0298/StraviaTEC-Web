import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/* Este servicio se utiliza para solicitar, enviar y recibir datos del servidor
mediante solicitudes HTTP como GET, POST, PUT y DELETE */

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public PORT = 5001;
  private options = {
    headers : {
      'Content-Type': 'application/json'
    }
  };

  constructor(protected http: HttpClient) { }

  /**
   * Solicitud HTTP POST
   * @param url url con el request para el api
   * @param body Objeto a enviar al api
   */
  post(url:string, body:Object) {
    console.log('Creando...');
    return this.http.post(url, JSON.stringify(body), this.options);
  }

  /**
   * Solicitud HTTP GET
   * @param url url con el request para el api
   */
  get(url:string) {
    console.log("Obteniendo...");
    return this.http.get(url, this.options);
  }

  /**
   * Solicitud HTTP PUT
   * @param url url con el request para el api
   * @param body Objeto a enviar al api
   */
  put(url:string, body:Object) {
    console.log("Actualizando...");
    return this.http.put(url, JSON.stringify(body), this.options);
  }

  /**
   * Solicitud HTTP DELETE
   * @param url url con el request para el api
   */
  delete(url:string) {
    console.log("Eliminando...")
    return this.http.delete(url, this.options);
  }

   /**
   * Solicitud HTTP POST para iniciar sesion
   * @param id Nombre de usuario
   * @param pass Contraseña
   */
  loginClient(id:string, pass:string) {
    var url = `https://localhost:${this.PORT}/api/Login`;
    var auth = {
      id: id,
      password: pass
    }
    return this.http.post(url, JSON.stringify(auth), this.options);
  }

}
