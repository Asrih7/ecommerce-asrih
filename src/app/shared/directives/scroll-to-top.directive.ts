import {Directive, HostListener, Input} from '@angular/core';
import {
    ActivationEnd,
    ChildActivationEnd,
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationSkipped,
    Router
} from "@angular/router";

@Directive({
    selector: '[scroll-to-top]'
})
export class ScrollToTopDirective {

    @Input() link: string[] = [];
    @Input() frag: string | undefined;

    constructor(private router: Router) {
    }

    @HostListener('click')
    scrollToTop() {
        this.router.navigate(this.link, {fragment: this.frag});
    }

}