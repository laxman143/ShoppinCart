import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appNgColor]'
})
export class NgColorDirective {

  @Input() public set color(color:string) {
    if(color) {
      this.elRef.nativeElement.style.backgroundColor = color;
    }
  }

  constructor(private elRef: ElementRef) { }

}
