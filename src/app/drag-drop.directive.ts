import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';

// фикс ошибки типизации
interface FileReaderEventTarget extends EventTarget {
  result:string
}
interface FileReaderEvent extends ProgressEvent  {
  target: FileReaderEventTarget;
  getMessage():string;
}

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
    this.border = '1px solid transparent'; // сброс стилей на стандартные
    let file = evt.dataTransfer.files[0]; // берем файл
    let reader = new FileReader(); // создаем файл реадер
    reader.onload = (fre:FileReaderEvent):void => { // создаем событие для чтения
      this.onFileDropped.emit(fre.target.result) // при загрузке - отправляем содержимое
    };
    reader.readAsText(file) // читаем файл
  }

}
