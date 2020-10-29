import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * Metodo para limpiar los campos
   * @param htmlElements Elementos HTML Input
   * @param dropdownElements Elementos de dropdown
   * @param dropdownNewTag Nuevas etiquetas de los dropdowns
   */
  cleanField(htmlElements: HTMLInputElement[], dropdownElements: HTMLSelectElement[], dropdownNewTag: string[]) {
    htmlElements.forEach(element => {
      element.value = '';
    });

    for (let index = 0; index < dropdownElements.length; index++) {
      dropdownElements[index].value = dropdownNewTag[index];
    }

  }

  /**
   * Metodo para mostrar un modal
   * @param label Etiqueta del modal
   * @param content Contenido del modal
   * @param idLabel id de la etiqueta del modal
   * @param idContent id del contenido del modal
   * @param idElement id del modal
   */
  showInfoModal(label: string, content: string, idLabel: string, idContent: string, idElement: string) {
    const modal = document.getElementById(idElement);
    modal.style.setProperty('display', 'block');
    modal.style.setProperty('opacity', '100');
    document.getElementById(idLabel).textContent = label;
    document.getElementById(idContent).textContent = content;
  }

}
