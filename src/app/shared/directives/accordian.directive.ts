import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAccordian]'
})
export class AccordianDirective {

  constructor(private el: ElementRef) {
    this.el.nativeElement.classList.add('accordian');
    this.el.nativeElement.classList.add('mgb20');
  }

}