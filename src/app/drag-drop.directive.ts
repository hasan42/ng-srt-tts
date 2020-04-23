import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {

  @Output() onFileDropped = new EventEmitter<any>(); // "отправка" содержимого
  
  @HostBinding('style.border') private border = '1px solid transparent' // стили для textarea - стандартные

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.border = '1px dashed #000000'; // стили для наведения
  }
  
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.border = '1px solid transparent' // сброс стилей на стандартные
  }
  
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.border = '1px solid transparent' // сброс стилей на стандартные
    let file = evt.dataTransfer.files[0]; // берем файл
    let reader = new FileReader(); // создаем файл реадер
    reader.onload = (event) => { // создаем событие для чтения
      this.onFileDropped.emit(event.target.result) // при загрузке - отправляем содержимое
    };
    reader.readAsText(file) // читаем файл
  }

}
