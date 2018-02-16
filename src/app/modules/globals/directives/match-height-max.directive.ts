import { Directive, ElementRef, AfterViewChecked, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[matchHeightMax]'
})
export class MatchHeightMaxDirective implements AfterViewChecked {

  @Input() matchHeightMax: string;
  @HostListener('window:resize')
  onresize() {
    this.matchHeightWith(this.el.nativeElement, this.matchHeightMax);
  }

  constructor(public  el: ElementRef) {  }
  
  ngAfterViewChecked() {
    this.matchHeightWith(this.el.nativeElement, this.matchHeightMax);
  }

  matchHeightWith(parent: HTMLElement, className: string) {
    if (!parent) return;
    const CHILDREN = parent.getElementsByClassName(className);
    if (!CHILDREN) return;
    Array.from(CHILDREN).forEach((x: HTMLElement) => {
      x.style.height = 'initial';
    });
    const ELEMENTSHEIGHT = Array.from(CHILDREN).map(x => x.getBoundingClientRect().height);
    const MAXHEIGHT = ELEMENTSHEIGHT.reduce((prev, curr) => {
      return curr > prev ? curr : prev;
    }, 0);
    Array.from(CHILDREN).forEach((x: HTMLElement) => x.style.height = `${MAXHEIGHT}px`);
  } 
}
