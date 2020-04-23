import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {

  @Output() onFileDropped = new EventEmitter<any>();
  
  @HostBinding('style.border') private border = '1px solid transparent'

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.border = '1px dashed #000000';
  }
  
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.border = '1px solid transparent'
  }
  
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.border = '1px solid transparent'
    let file = evt.dataTransfer.files[0];
    let reader = new FileReader();
    reader.onload = (event) => {
      this.onFileDropped.emit(event.target.result)
    };
    reader.readAsText(file)
  }

}
