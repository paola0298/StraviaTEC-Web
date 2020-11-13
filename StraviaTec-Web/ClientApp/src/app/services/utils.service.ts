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

  parseDate(dateTime:string):string {
    const index = dateTime.indexOf('T');
    return dateTime.substring(0, index);
  }

  /**
   * Metodo para mostrar el menu contextual al presionar click derecho
   * @param event
   */
  showContextMenu(event: MouseEvent): boolean {
    const tds = document.getElementsByTagName('td');
    for (let i = 0; i < tds.length; i++) {
      tds[i].style.setProperty('box-shadow', 'none');
    }
    const top = event.pageY - 250;
    const left = event.pageX - 120;
    const menu = document.getElementById('context-menu');
    menu.style.setProperty('display', 'block');
    menu.style.setProperty('top', top.toString() + 'px');
    menu.style.setProperty('left', left.toString() + 'px');
    return false;
  }

    /**
   * Metodo para configurar el menu contextual
   */
  configureContextMenu() {
    document.getElementsByTagName('body')[0].addEventListener('click', (e: Event) => {
      const menu = document.getElementById('context-menu');

      if (menu != null) {
        if (menu.style.getPropertyValue('display') === 'block') {
          menu.style.setProperty('display', 'none');
        }
        const tds = document.getElementsByTagName('td');
        for (let i = 0; i < tds.length; i++) {
          tds[i].style.setProperty('box-shadow', 'none');
        }
      }
    });

    const menuItems = document.getElementById('context-menu').getElementsByTagName('a');
    for (let i = 0; i < menuItems.length; i++) {
      menuItems[i].addEventListener('click', (e: Event) => {
        menuItems[i].parentElement.style.setProperty('display', 'none');
      });
    }
  }

}
