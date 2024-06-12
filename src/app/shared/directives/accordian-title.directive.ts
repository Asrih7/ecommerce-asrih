import {
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    Renderer2, SimpleChanges
} from '@angular/core';

@Directive({
    selector: '[appAccordianTitle]',

})
export class AccordianTitleDirective implements OnInit, OnChanges {

    @Input() open = false;
    @HostBinding('class.accordian_title') isAccordionTitle = true;
    @HostBinding('class.selected') isSelected = false;

    constructor(private el: ElementRef, private renderer: Renderer2) {
    }

    @HostBinding('class')
    classes = 'chevron-down';

    ngOnInit() {
        const icon = this.renderer.createElement('i');
        this.renderer.addClass(icon, 'fal');
        this.renderer.addClass(icon, 'fa-chevron-down');
        this.renderer.appendChild(this.el.nativeElement, icon);
        const content = this.el.nativeElement.nextElementSibling;
        content.classList.add(['accordian_content']);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['open'].firstChange) {
            this.onClick();
        }
        else {
            this.isSelected = this.open;
            const content = this.el.nativeElement.nextElementSibling;
            content.classList.toggle('show');
        }
    }


    @HostListener('click')
    onClick() {
        this.isSelected = !this.isSelected;
        this.classes = this.classes === '' ? ' selected' : '';
        const content = this.el.nativeElement.nextElementSibling;
        content.classList.toggle('show');
    }

}